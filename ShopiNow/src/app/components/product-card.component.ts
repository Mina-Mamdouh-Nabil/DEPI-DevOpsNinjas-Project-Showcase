import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../data/product-data';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('[ProductCard] Adding product to cart:', this.product.name);
    this.cartService.addToCart(this.product, 1).subscribe({
      next: () => {
        console.log('[ProductCard] Product added successfully');
      },
      error: (error) => {
        console.error('[ProductCard] Error adding to cart:', error);
      }
    });
  }
}

