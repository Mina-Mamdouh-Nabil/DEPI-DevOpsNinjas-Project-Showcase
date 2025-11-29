import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        // Only redirect if not already on auth pages
        if (!router.url.startsWith('/auth')) {
          // Clear any stored auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('current_user');
          
          // Redirect to login page
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: router.url }
          });
        }
      }
      
      // Handle 403 Forbidden
      if (error.status === 403) {
        // User is authenticated but doesn't have permission
        console.error('Access denied:', error);
      }
      
      // Log network errors for debugging
      if (error.status === 0) {
        console.error('Network error - backend may be down:', error);
      }
      
      return throwError(() => error);
    })
  );
};

