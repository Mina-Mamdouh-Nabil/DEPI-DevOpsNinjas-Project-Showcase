import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CartItem } from '../data/product-data';
import { CartService } from '../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  total = 0;
  loading = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('[CartPage] Initializing cart page');
    
    // Force reload from server to ensure fresh data
    this.cartService.reloadFromServer();
    
    combineLatest([
      this.cartService.cartItems$,
      this.cartService.getCartTotal()
    ]).subscribe(([items, total]) => {
      console.log('[CartPage] Cart items updated:', items.length, 'items');
      
      // Create new array to trigger change detection
      this.cartItems = [...items];
      this.subtotal = total;
      this.tax = this.subtotal * 0.08; // 8% tax
      this.total = this.subtotal + this.tax;
      
      // Force change detection
      this.cdr.detectChanges();
      console.log('[CartPage] Change detection triggered, cartItems:', this.cartItems.length);
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    console.log('[CartPage] updateQuantity called for item:', {
      itemId: item.id,
      productId: item.product.id,
      productName: item.product.name,
      currentQuantity: item.quantity,
      newQuantity: quantity
    });
    
    const cartItemId = item.id || item.product.id;
    console.log('[CartPage] Using cartItemId:', cartItemId, '(type:', typeof cartItemId, ')');
    
    this.loading = true;
    this.cartService.updateQuantity(cartItemId, quantity).subscribe({
      next: () => {
        console.log('[CartPage] Quantity update completed successfully');
        this.loading = false;
        // Force change detection after update
        this.cdr.detectChanges();
        console.log('[CartPage] Change detection triggered after update');
      },
      error: (error) => {
        console.error('[CartPage] Error updating quantity:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(item: CartItem): void {
    const cartItemId = item.id || item.product.id;
    this.loading = true;
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.loading = false;
      }
    });
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}

