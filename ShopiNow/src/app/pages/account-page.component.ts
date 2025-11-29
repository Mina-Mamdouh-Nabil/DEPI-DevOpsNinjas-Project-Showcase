import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService, UserDto } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-account-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent implements OnInit {
  userProfile: UserDto | null = null;
  recentOrders: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('[Account] Component initialized - Current state:', {
      loading: this.loading,
      hasProfile: !!this.userProfile,
      hasError: !!this.error
    });
    
    // If we already have profile data, don't reload
    if (this.userProfile) {
      console.log('[Account] Profile already loaded, skipping reload');
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    
    // Auth guard handles redirect, but we keep this as a safety check
    if (!this.authService.isAuthenticated()) {
      console.log('[Account] Not authenticated - guard will redirect');
      this.loading = false;
      this.cdr.detectChanges();
      return; // Guard will handle redirect
    }

    // Check if we have a valid token
    const token = this.authService.getToken();
    console.log('[Account] Init - Token exists:', !!token);
    console.log('[Account] Init - Is authenticated:', this.authService.isAuthenticated());
    
    if (!token) {
      console.log('[Account] No token found - redirecting to login');
      this.loading = false;
      this.error = 'No authentication token found. Please login again.';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
      return;
    }

    console.log('[Account] Starting to load profile and orders...');
    // Load immediately - no delay needed
    this.loadUserProfile();
    this.loadOrders();
  }

  loadUserProfile(): void {
    // Check token first
    const token = this.authService.getToken();
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      this.loading = false;
      this.error = 'No authentication token. Please login.';
      setTimeout(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: '/account' }
        });
      }, 1500);
      return;
    }

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (this.loading) {
        console.error('Profile loading timeout after 8 seconds');
        this.loading = false;
        this.error = 'Request timed out. Check browser console for details.';
      }
    }, 8000); // 8 second timeout

    console.log('Calling getUserProfile API...');
    const startTime = Date.now();
    
    this.apiService.getUserProfile().subscribe({
      next: (profile) => {
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        console.log(`[Account] Profile loaded successfully in ${duration}ms:`, profile);
        console.log(`[Account] Setting loading to false, userProfile:`, profile);
        this.userProfile = profile;
        this.loading = false;
        this.error = null;
        // Force change detection
        this.cdr.detectChanges();
        console.log(`[Account] After change detection - loading:`, this.loading, 'userProfile:', !!this.userProfile);
      },
      error: (error) => {
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        console.error(`Profile loading failed after ${duration}ms:`, error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.loading = false;
        
        // Error interceptor handles 401 redirect, but we still need to handle the error here
        if (error.status === 401 || error.status === 403) {
          // Token is invalid - clear and redirect
          this.authService.logout();
          this.error = 'Your session has expired. Please login again.';
          setTimeout(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: '/account' }
            });
          }, 2000);
          return;
        }
        
        // Network/CORS errors
        if (error.status === 0 || error.message?.includes('Network') || error.message?.includes('Failed to fetch')) {
          this.error = 'Cannot connect to server. Is the backend running on http://localhost:8080?';
          return;
        }
        
        // Other errors
        this.error = error.error?.message || `Failed to load profile. Error: ${error.status || 'Unknown'}`;
      }
    });
  }

  loadOrders(): void {
    this.apiService.getUserOrders().subscribe({
      next: (orders: any[]) => {
        this.recentOrders = orders.slice(0, 3).map(order => ({
          id: `#${order.id}`,
          status: order.status || 'Processing',
          total: `$${order.total?.toFixed(2) || '0.00'}`,
          eta: this.getOrderETA(order.status)
        }));
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        // Don't show error for orders, just leave empty
      }
    });
  }

  getOrderETA(status: string | undefined): string {
    if (!status) return 'Processing';
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Processing';
      case 'PROCESSING':
        return 'Tomorrow';
      case 'SHIPPED':
        return 'Today • 9pm';
      case 'DELIVERED':
        return 'Delivered';
      default:
        return 'Processing';
    }
  }

  logout(): void {
    this.authService.logout();
  }

  get accountHighlights() {
    if (!this.userProfile) return [];
    
    return [
      {
        title: 'Account Information',
        detail: `Member since ${this.formatDate(this.userProfile.createdAt)}`
      },
      {
        title: 'Email',
        detail: this.userProfile.email
      },
      {
        title: 'Account Type',
        detail: this.userProfile.role === 'ADMIN' ? 'Administrator' : 'Standard User'
      }
    ];
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return 'Recently';
    }
  }
}

