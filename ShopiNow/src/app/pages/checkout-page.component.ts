import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CartService } from '../services/cart.service';
import { CartItem } from '../data/product-data';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  shipping = 0;
  total = 0;

  shippingAddress = {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  };

  paymentMethod = 'card';
  cardDetails = {
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  };

  readonly paymentMethods = [
    { value: 'card', label: 'Credit or debit card' },
    { value: 'cod', label: 'Cash on delivery' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.cartService.cartItems$,
      this.cartService.getCartTotal()
    ]).subscribe(([items, total]) => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
        return;
      }
      this.subtotal = total;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.tax = this.subtotal * 0.08;
    this.shipping = this.subtotal >= 25 ? 0 : 5.99;
    this.total = this.subtotal + this.tax + this.shipping;
  }

  placeOrder(): void {
    if (!this.shippingAddress.fullName || !this.shippingAddress.address) {
      alert('Please fill in all required shipping information');
      return;
    }
    console.log('Order placed:', {
      items: this.cartItems,
      shipping: this.shippingAddress,
      payment: this.paymentMethod,
      total: this.total
    });
    this.cartService.clearCart().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.router.navigate(['/']);
      }
    });
  }
}

