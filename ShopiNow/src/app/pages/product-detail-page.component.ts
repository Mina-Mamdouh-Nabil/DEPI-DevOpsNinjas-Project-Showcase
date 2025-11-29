import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ProductCardComponent } from '../components/product-card.component';
import { Product } from '../data/product-data';
import { ProductService } from '../services/product.service';

@Component({
  standalone: true,
  selector: 'app-product-detail-page',
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent implements OnInit {
  product?: Product;
  relatedProducts: Product[] = [];
  quantity: number = 1;
  quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        // Try to parse as number (backend ID) or use as string (productId)
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          this.loadProduct(numericId);
        } else {
          // If it's a string ID like "smartwatch-neo", find by productId
          this.findProductById(id);
        }
        this.quantity = 1;
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        if (product) {
          this.loadRelatedProducts(product.category, product.id);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  findProductById(productId: string): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.product = products.find(p => p.id === productId);
        if (this.product) {
          this.loadRelatedProducts(this.product.category, this.product.id);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error finding product:', error);
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(category: string, currentProductId: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity).subscribe({
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }
}

