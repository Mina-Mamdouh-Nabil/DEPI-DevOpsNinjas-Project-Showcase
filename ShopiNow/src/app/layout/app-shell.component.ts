import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

import { AppFooterComponent } from './app-footer.component';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, AppFooterComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent implements OnInit {
  searchQuery = '';
  selectedSearchCategory = 'all';
  suggestions: string[] = [];
  showSuggestions = false;
  cartCount = 0;
  isAuthPage = false;
  isAuthenticated = false;
  currentUser: any = null;

  readonly searchCategories = [
    { value: 'all', label: 'All' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'sports', label: 'Sports' }
  ];

  constructor(
    private router: Router,
    private searchService: SearchService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.getCartCount().subscribe(count => {
      console.log('[AppShell] Cart count updated:', count);
      this.cartCount = count;
      // Force change detection to update navbar
      this.cdr.detectChanges();
    });

    // Check authentication status
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
      this.cdr.detectChanges();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAuthPage = this.router.url.startsWith('/auth');
      });

    // Check initial route
    this.isAuthPage = this.router.url.startsWith('/auth');
  }

  logout(): void {
    this.authService.logout();
  }

  onSearchInput(): void {
    if (this.searchQuery && this.searchQuery.trim().length >= 2) {
      this.searchService.getSuggestions(this.searchQuery).subscribe(suggestions => {
        this.suggestions = suggestions;
        this.showSuggestions = suggestions.length > 0;
      });
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  onCategoryChange(category: string): void {
    console.log('[Navbar] Category changed to:', category);
    this.selectedSearchCategory = category;
    
    // If there's already a search query, trigger search with new category
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      // Trigger search with new category
      this.onSearch();
      return;
    }
    
    // Get current URL
    const currentUrl = this.router.url;
    console.log('[Navbar] Current URL:', currentUrl);
    
    if (category === 'all') {
      // If "All" is selected, go to home page
      if (currentUrl !== '/') {
        console.log('[Navbar] Navigating to homepage (All selected)');
        this.router.navigate(['/']);
      }
    } else if (category && category !== 'all') {
      // Always navigate to category page for consistency
      const categoryLower = category.toLowerCase();
      console.log('[Navbar] Navigating to category page:', categoryLower);
      this.router.navigate(['/category', categoryLower]);
    }
  }

  onSearch(): void {
    const query = this.searchQuery?.trim() || '';
    
    // If category is "All" and no search query, go to homepage
    if (this.selectedSearchCategory === 'all' && query.length === 0) {
      this.router.navigate(['/']);
      this.showSuggestions = false;
      return;
    }
    
    // If category is "All" but there's a search query, search without category filter
    if (this.selectedSearchCategory === 'all' && query.length > 0) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.showSuggestions = false;
      return;
    }
    
    // If there's a search query
    if (query.length > 0) {
      const queryParams: any = { q: query };
      if (this.selectedSearchCategory && this.selectedSearchCategory !== 'all') {
        queryParams.category = this.selectedSearchCategory;
      }
      this.router.navigate(['/search'], { queryParams });
      this.showSuggestions = false;
    } else if (this.selectedSearchCategory && this.selectedSearchCategory !== 'all') {
      // If no search query but category is selected, go to category page
      this.router.navigate(['/category', this.selectedSearchCategory]);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.suggestions = [];
    this.showSuggestions = false;
    // Navigate to homepage to show all products
    this.router.navigate(['/']);
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.onSearch();
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}

