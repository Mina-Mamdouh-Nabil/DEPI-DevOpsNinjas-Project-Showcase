import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, AuthResponse, LoginRequest, RegisterRequest } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      this.apiService.login(credentials).subscribe({
        next: (response) => {
          this.setAuthToken(response.token);
          this.setCurrentUser(response);
          this.currentUserSubject.next(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      this.apiService.register(userData).subscribe({
        next: (response) => {
          this.setAuthToken(response.token);
          this.setCurrentUser(response);
          this.currentUserSubject.next(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private setCurrentUser(user: AuthResponse): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }
}


