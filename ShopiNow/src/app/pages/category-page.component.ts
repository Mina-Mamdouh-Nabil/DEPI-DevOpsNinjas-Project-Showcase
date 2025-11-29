import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Product } from '../data/product-data';
import { ProductCardComponent } from '../components/product-card.component';
import { ProductService } from '../services/product.service';
import { ApiService, CategoryDto, ProductDto } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-category-page',
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit {
  categories: CategoryDto[] = [];
  selectedCategoryId = '';
  filteredProducts: Product[] = [];
  selectedSort = 'relevance';
  loading = true;
  error: string | null = null;
  
  readonly sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' }
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load categories in parallel (non-blocking)
    this.loadCategories();
    
    // Load products immediately from route parameter (don't wait for categories)
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category) {
        this.selectedCategoryId = category;
        // Load products immediately - don't wait for categories
        this.loadProducts();
      }
    });
  }

  loadCategories(): void {
    // Load categories in background - don't block product loading
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Set empty array to prevent template errors
        this.categories = [];
      }
    });
  }

  loadProducts(): void {
    if (!this.selectedCategoryId) {
      console.log('[CategoryPage] No category ID selected');
      this.loading = false;
      return;
    }
    
    const startTime = performance.now();
    console.log('[CategoryPage] Loading products for category:', this.selectedCategoryId);
    this.loading = true;
    this.error = null;
    this.filteredProducts = []; // Clear previous products immediately
    
    // Load products directly from API (skip ProductService conversion to save time)
    this.apiService.getProductsByCategory(this.selectedCategoryId).subscribe({
      next: (productDtos) => {
        const apiTime = performance.now() - startTime;
        console.log('[CategoryPage] Loaded products from API in', apiTime.toFixed(2), 'ms:', productDtos.length);
        
        const convertStart = performance.now();
        // Convert DTOs to Products inline (faster than going through ProductService)
        const products: Product[] = productDtos.map(p => ({
          id: p.productId || p.id.toString(),
          name: p.name,
          category: p.category || 'Uncategorized',
          description: p.description || '',
          price: typeof p.price === 'number' ? p.price : Number(p.price),
          oldPrice: p.oldPrice ? (typeof p.oldPrice === 'number' ? p.oldPrice : Number(p.oldPrice)) : undefined,
          rating: p.rating || 0,
          reviews: p.reviewsCount || 0,
          image: p.imageUrl || '',
          badges: p.badges || [],
          tags: p.tags || [],
          featured: p.featured || false
        }));
        const convertTime = performance.now() - convertStart;
        console.log('[CategoryPage] Converted products in', convertTime.toFixed(2), 'ms');
        
        const sortStart = performance.now();
        this.filteredProducts = this.sortProducts(products, this.selectedSort);
        const sortTime = performance.now() - sortStart;
        console.log('[CategoryPage] Sorted products in', sortTime.toFixed(2), 'ms');
        
        this.loading = false;
        const totalTime = performance.now() - startTime;
        console.log('[CategoryPage] Total processing time:', totalTime.toFixed(2), 'ms');
        console.log('[CategoryPage] Products ready to display:', this.filteredProducts.length);
        
        // Force change detection to update the view immediately
        this.cdr.detectChanges();
        console.log('[CategoryPage] Change detection triggered');
        
        if (products.length === 0) {
          console.warn('[CategoryPage] No products found for category:', this.selectedCategoryId);
        }
      },
      error: (error) => {
        const errorTime = performance.now() - startTime;
        console.error('[CategoryPage] Error loading products after', errorTime.toFixed(2), 'ms:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        this.filteredProducts = [];
      }
    });
  }

  get selectedCategory() {
    if (!this.categories || this.categories.length === 0) {
      return null;
    }
    return this.categories.find((category) => category.name === this.selectedCategoryId) ?? this.categories[0] ?? null;
  }

  onSortChange(): void {
    this.filteredProducts = this.sortProducts([...this.filteredProducts], this.selectedSort);
  }

  sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }
}

