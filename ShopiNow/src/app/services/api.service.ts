import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductDto {
  id: number;
  productId?: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  category: string;
  tags?: string[];
  badges?: string[];
  featured?: boolean;
  stockQuantity?: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
}

export interface CartItemDto {
  id: number;
  product: ProductDto;
  quantity: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Products
  getProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products`);
  }

  getFeaturedProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products/featured`);
  }

  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products/category/${category}`);
  }

  searchProducts(query: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products/search`, {
      params: { q: query }
    });
  }

  getProductsWithFilters(category?: string, minPrice?: number, maxPrice?: number, minRating?: number): Observable<ProductDto[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
    if (minRating) params = params.set('minRating', minRating.toString());
    
    return this.http.get<ProductDto[]>(`${this.apiUrl}/products/filter`, { params });
  }

  // Categories
  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.apiUrl}/categories`);
  }

  // Cart (requires authentication)
  getCartItems(): Observable<CartItemDto[]> {
    return this.http.get<CartItemDto[]>(`${this.apiUrl}/cart`, { headers: this.getAuthHeaders() });
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItemDto> {
    return this.http.post<CartItemDto>(`${this.apiUrl}/cart/items`, null, {
      params: { productId: productId.toString(), quantity: quantity.toString() },
      headers: this.getAuthHeaders()
    });
  }

  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<CartItemDto> {
    return this.http.put<CartItemDto>(`${this.apiUrl}/cart/items/${cartItemId}`, null, {
      params: { quantity: quantity.toString() },
      headers: this.getAuthHeaders()
    });
  }

  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cart/items/${cartItemId}`, {
      headers: this.getAuthHeaders()
    });
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cart`, {
      headers: this.getAuthHeaders()
    });
  }

  // Auth
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  // Orders (requires authentication)
  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, orderData, {
      headers: this.getAuthHeaders()
    });
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`, {
      headers: this.getAuthHeaders()
    });
  }

  // User Profile
  getUserProfile(): Observable<UserDto> {
    const headers = this.getAuthHeaders();
    const token = headers.get('Authorization');
    console.log('[API] getUserProfile - URL:', `${this.apiUrl}/user/profile`);
    console.log('[API] getUserProfile - Token present:', !!token);
    console.log('[API] getUserProfile - Token value:', token ? token.substring(0, 30) + '...' : 'none');
    
    return this.http.get<UserDto>(`${this.apiUrl}/user/profile`, {
      headers: headers
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}

