import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    // Always add token if it exists - let backend decide if endpoint needs auth
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[Interceptor] Added token to request:', req.url);
  } else {
    console.warn('[Interceptor] No token found for request:', req.url);
  }
  
  return next(req);
};

