import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { CartItem, Product } from '../data/product-data';
import { ApiService, CartItemDto } from './api.service';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private productService: ProductService
  ) {
    console.log('[CartService] Initializing cart service');
    console.log('[CartService] Is authenticated:', this.authService.isAuthenticated());
    console.log('[CartService] Token exists:', !!this.authService.getToken());
    
    if (this.authService.isAuthenticated()) {
      console.log('[CartService] Loading cart from server');
      this.loadCartFromServer();
    } else {
      console.log('[CartService] Not authenticated - loading from localStorage');
      // Fallback to localStorage for non-authenticated users
      this.loadCartFromStorage();
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ))
    );
  }

  addToCart(product: Product, quantity: number = 1): Observable<void> {
    console.log('[CartService] addToCart called for product:', product.name, 'quantity:', quantity);
    console.log('[CartService] Is authenticated:', this.authService.isAuthenticated());
    
    if (!this.authService.isAuthenticated()) {
      console.log('[CartService] Not authenticated - adding to localStorage');
      // Fallback to localStorage
      return this.addToCartLocal(product, quantity);
    }

    // Find product numeric ID from backend and add to cart
    return this.getProductBackendId(product).pipe(
      switchMap(productId => {
        console.log('[CartService] Product backend ID:', productId);
        
        if (!productId) {
          console.warn('[CartService] No backend ID found - falling back to localStorage');
          // Fallback to local storage if product ID not found
          return this.addToCartLocal(product, quantity);
        }

        console.log('[CartService] Calling backend API to add product ID:', productId);
        return this.apiService.addToCart(productId, quantity).pipe(
          tap((response) => {
            console.log('[CartService] Backend response:', response);
          }),
          switchMap(() => {
            console.log('[CartService] Reloading cart from server (using switchMap)...');
            return this.apiService.getCartItems();
          }),
          tap((items) => {
            console.log('[CartService] Received updated cart items:', items.length, 'items');
            const converted = items.map(item => this.convertToCartItem(item));
            this.cartItemsSubject.next(converted);
            console.log('[CartService] Cart updated with', converted.length, 'items');
          }),
          map(() => void 0),
          catchError(error => {
            console.error('[CartService] Error adding to cart via API:', error);
            console.error('[CartService] Error status:', error.status, 'message:', error.message);
            console.warn('[CartService] Falling back to localStorage');
            // Fallback to local storage
            return this.addToCartLocal(product, quantity);
          })
        );
      }),
      catchError((error) => {
        console.error('[CartService] Error in getProductBackendId:', error);
        // Fallback to local storage on error
        return this.addToCartLocal(product, quantity);
      })
    );
  }

  removeFromCart(cartItemId: number | string): Observable<void> {
    console.log('[CartService] removeFromCart called - cartItemId:', cartItemId);
    
    if (!this.authService.isAuthenticated()) {
      console.log('[CartService] Not authenticated, removing locally');
      return this.removeFromCartLocal(cartItemId as string);
    }

    console.log('[CartService] Calling backend API to remove item');
    return this.apiService.removeFromCart(cartItemId as number).pipe(
      tap(() => {
        console.log('[CartService] Item removed from backend');
      }),
      switchMap(() => {
        console.log('[CartService] Reloading cart from server (using switchMap)...');
        return this.apiService.getCartItems();
      }),
      tap((items) => {
        console.log('[CartService] Received updated cart items:', items.length, 'items');
        const converted = items.map(item => this.convertToCartItem(item));
        this.cartItemsSubject.next(converted);
        console.log('[CartService] Cart updated with', converted.length, 'items');
      }),
      map(() => void 0),
      catchError(error => {
        console.error('[CartService] Error removing from cart via API:', error);
        console.warn('[CartService] Falling back to localStorage');
        return this.removeFromCartLocal(cartItemId as string);
      })
    );
  }

  updateQuantity(cartItemId: number | string, quantity: number): Observable<void> {
    console.log('[CartService] updateQuantity called - cartItemId:', cartItemId, 'quantity:', quantity);
    
    if (quantity <= 0) {
      console.log('[CartService] Quantity <= 0, removing item');
      return this.removeFromCart(cartItemId);
    }

    if (!this.authService.isAuthenticated()) {
      console.log('[CartService] Not authenticated, updating locally');
      return this.updateQuantityLocal(cartItemId as string, quantity);
    }

    console.log('[CartService] Calling backend API to update quantity');
    return this.apiService.updateCartItemQuantity(cartItemId as number, quantity).pipe(
      tap((response) => {
        console.log('[CartService] Backend update response:', response);
      }),
      switchMap(() => {
        console.log('[CartService] Reloading cart from server (using switchMap)...');
        return this.apiService.getCartItems();
      }),
      tap((items) => {
        console.log('[CartService] Received updated cart items:', items.length, 'items');
        const converted = items.map(item => this.convertToCartItem(item));
        this.cartItemsSubject.next(converted);
        console.log('[CartService] Cart updated with', converted.length, 'items');
      }),
      map(() => void 0),
      catchError(error => {
        console.error('[CartService] Error updating cart via API:', error);
        console.error('[CartService] Error status:', error.status, 'message:', error.message);
        console.warn('[CartService] Falling back to localStorage');
        return this.updateQuantityLocal(cartItemId as string, quantity);
      })
    );
  }

  clearCart(): Observable<void> {
    if (!this.authService.isAuthenticated()) {
      this.cartItemsSubject.next([]);
      this.saveCartToStorage([]);
      return of();
    }

    return this.apiService.clearCart().pipe(
      tap(() => {
        this.cartItemsSubject.next([]);
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error clearing cart:', error);
        this.cartItemsSubject.next([]);
        this.saveCartToStorage([]);
        return of();
      })
    );
  }

  private loadCartFromServer(): void {
    console.log('[CartService] loadCartFromServer - calling API...');
    this.apiService.getCartItems().subscribe({
      next: (items) => {
        console.log('[CartService] Received cart items from server:', items.length, 'items');
        console.log('[CartService] Cart items:', items);
        const converted = items.map(item => this.convertToCartItem(item));
        this.cartItemsSubject.next(converted);
        console.log('[CartService] Cart updated with', converted.length, 'items');
      },
      error: (error) => {
        console.error('[CartService] Error loading cart from server:', error);
        console.error('[CartService] Error details:', error.message, error.status);
        console.warn('[CartService] Falling back to localStorage');
        this.loadCartFromStorage();
      }
    });
  }

  // Public method to force reload from server
  public reloadFromServer(): void {
    console.log('[CartService] Forcing reload from server');
    if (this.authService.isAuthenticated()) {
      this.loadCartFromServer();
    } else {
      console.warn('[CartService] Cannot reload from server - not authenticated');
      this.loadCartFromStorage();
    }
  }

  private convertToCartItem(dto: CartItemDto): CartItem {
    return {
      id: dto.id, // Preserve backend cart item ID
      product: {
        id: dto.product.productId || dto.product.id.toString(),
        name: dto.product.name,
        category: dto.product.category,
        description: dto.product.description,
        price: dto.product.price,
        oldPrice: dto.product.oldPrice,
        rating: dto.product.rating,
        reviews: dto.product.reviewsCount,
        image: dto.product.imageUrl,
        badges: dto.product.badges,
        tags: dto.product.tags,
        featured: dto.product.featured,
        backendId: dto.product.id
      },
      quantity: dto.quantity
    };
  }

  private getProductBackendId(product: Product): Observable<number | null> {
    console.log('[CartService] getProductBackendId - product:', {
      id: product.id,
      name: product.name,
      backendId: product.backendId
    });
    
    // 1. Check if we already have the backend ID
    if (product.backendId) {
      console.log('[CartService] Using product.backendId:', product.backendId);
      return of(product.backendId);
    }

    // 2. Try to extract numeric ID from product.id (legacy/fallback)
    const numericId = parseInt(product.id);
    console.log('[CartService] Trying to parse product.id as number:', product.id, '→', numericId);
    if (!isNaN(numericId)) {
      console.log('[CartService] Using parsed numeric ID:', numericId);
      return of(numericId);
    }

    // If product.id is a string like "smartwatch-neo", search for it in the product list
    console.log('[CartService] Searching for product by string ID:', product.id);
    return this.productService.getProducts().pipe(
      map(products => {
        console.log('[CartService] Searching in', products.length, 'products');
        const found = products.find(p => p.id === product.id);
        if (found) {
          console.log('[CartService] Found product:', found.name, 'backendId:', found.backendId);
          // Use backendId directly if available
          if (found.backendId) {
            console.log('[CartService] Using found.backendId:', found.backendId);
            return found.backendId;
          }
          // Try to extract numeric ID from found product
          const id = parseInt(found.id);
          console.log('[CartService] Parsed found.id:', id);
          return !isNaN(id) ? id : null;
        }
        console.warn('[CartService] Product not found in product list');
        return null;
      }),
      catchError((error) => {
        console.error('[CartService] Error searching for product:', error);
        return of(null);
      })
    );
  }

  // Local storage fallback methods
  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem('shopinow_cart');
      const items = stored ? JSON.parse(stored) : [];
      this.cartItemsSubject.next(items);
    } catch {
      this.cartItemsSubject.next([]);
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem('shopinow_cart', JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }

  private addToCartLocal(product: Product, quantity: number): Observable<void> {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage(this.cartItemsSubject.value);
    return of();
  }

  private removeFromCartLocal(productId: string): Observable<void> {
    const currentItems = this.cartItemsSubject.value.filter(
      item => item.product.id !== productId
    );
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage(currentItems);
    return of();
  }

  private updateQuantityLocal(productId: string, quantity: number): Observable<void> {
    const currentItems = this.cartItemsSubject.value.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.cartItemsSubject.next(currentItems);
    this.saveCartToStorage(currentItems);
    return of();
  }
}

