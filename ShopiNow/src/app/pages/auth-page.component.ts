import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-auth-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent implements OnInit {
  isLoginMode = true;
  loading = false;
  errorMessage = '';

  loginData = {
    email: '',
    password: '',
    remember: false
  };

  registrationData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateRouteMode();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteMode();
      });
  }

  private updateRouteMode(): void {
    const currentUrl = this.router.url;
    this.isLoginMode = !currentUrl.includes('/register');
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;

    if (this.isLoginMode) {
      this.authService.login({
        email: this.loginData.email,
        password: this.loginData.password
      }).subscribe({
        next: () => {
          this.loading = false;
          // Check if there's a return URL, otherwise go to home
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    } else {
      if (this.registrationData.password !== this.registrationData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        this.loading = false;
        return;
      }
      
      this.authService.register({
        name: this.registrationData.name,
        email: this.registrationData.email,
        password: this.registrationData.password
      }).subscribe({
        next: () => {
          this.loading = false;
          // Check if there's a return URL, otherwise go to home
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}

