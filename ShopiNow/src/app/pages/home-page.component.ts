import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ProductCardComponent } from '../components/product-card.component';
import { Product } from '../data/product-data';
import { ProductService } from '../services/product.service';
import { ApiService, CategoryDto, ProductDto } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: CategoryDto[] = [];
  private destroy$ = new Subject<void>();
  
  // Filters
  selectedCategory = 'all';
  selectedSort = 'relevance';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating = 0;
  loading = true;
  
  readonly sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest Arrivals' }
  ];

  constructor(
    private productService: ProductService,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('[HomePage] ngOnInit called, current URL:', this.router.url);
    // Load data on initial load
    this.loadData();
    
    // Listen for navigation events to reload data when navigating to homepage
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // If navigating to homepage, check for category query param
        if (event.url === '/' || event.urlAfterRedirects === '/') {
          console.log('[HomePage] Navigation detected to homepage, URL:', event.url);
          
          // Check for category query parameter
          const urlTree = this.router.parseUrl(event.url);
          const categoryParam = urlTree.queryParams['category'];
          
          if (categoryParam) {
            // Category filter from navbar - just filter existing products (instant)
            console.log('[HomePage] Category filter from query param:', categoryParam);
            this.selectedCategory = categoryParam;
            if (this.allProducts.length > 0) {
              // Products already loaded - just filter (instant)
              this.applyFilters();
            } else {
              // Products not loaded yet - load them first
              this.loadData();
            }
          } else {
            // No category filter - reload all data
            this.loading = true;
            this.filteredProducts = [];
            this.cdr.detectChanges();
            this.loadData();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    console.log('[HomePage] loadData() called');
    // Reset state when component initializes
    this.allProducts = [];
    this.filteredProducts = [];
    this.loading = true;
    this.selectedCategory = 'all';
    this.selectedSort = 'relevance';
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = 0;
    
    // Force change detection to show loading state
    this.cdr.detectChanges();
    
    this.loadCategories();
    this.loadAllProducts(); // Load all products instead of just featured
  }

  loadCategories(): void {
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

  loadAllProducts(): void {
    this.loading = true;
    this.filteredProducts = []; // Clear filtered products while loading
    // Fetch all products from API
    this.apiService.getProducts().subscribe({
      next: (products: ProductDto[]) => {
        console.log('[HomePage] Loaded products from API:', products.length);
        if (products.length === 0) {
          console.warn('[HomePage] No products returned from API!');
          this.allProducts = [];
          this.filteredProducts = [];
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }
        // Convert DTOs to Products
        this.allProducts = products.map(p => ({
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
        console.log('[HomePage] Converted products:', this.allProducts.length);
        console.log('[HomePage] Selected category:', this.selectedCategory);
        console.log('[HomePage] Sample product categories:', this.allProducts.slice(0, 3).map(p => ({ name: p.name, category: p.category })));
        // Apply filters after products are loaded
        this.applyFilters();
        console.log('[HomePage] Filtered products after applyFilters:', this.filteredProducts.length);
        
        // Set loading to false
        this.loading = false;
        console.log('[HomePage] Loading set to false, filteredProducts.length:', this.filteredProducts.length, 'loading:', this.loading);
        
        // Force change detection immediately
        this.cdr.detectChanges();
        console.log('[HomePage] Change detection triggered immediately');
      },
      error: (error) => {
        console.error('Error loading all products:', error);
        this.loading = false;
        this.cdr.detectChanges();
        // Fallback to featured products
        this.loadFeaturedProducts();
      }
    });
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    if (!this.allProducts || this.allProducts.length === 0) {
      console.log('[HomePage] No products to filter');
      this.filteredProducts = [];
      return;
    }

    let filtered = [...this.allProducts];
    console.log('[HomePage] Starting with', filtered.length, 'products');
    console.log('[HomePage] Filters - category:', this.selectedCategory, 'minPrice:', this.minPrice, 'maxPrice:', this.maxPrice, 'minRating:', this.minRating);

    // Category filter - only apply if not 'all'
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(p => {
        if (!p.category) return false;
        const matches = p.category.toLowerCase() === this.selectedCategory.toLowerCase();
        if (!matches) {
          console.log('[HomePage] Category mismatch:', p.category, 'vs', this.selectedCategory);
        }
        return matches;
      });
      console.log('[HomePage] After category filter:', filtered.length, 'products (was', beforeCount, ')');
    } else {
      console.log('[HomePage] Category filter skipped (selectedCategory is "all")');
    }

    // Price filter
    if (this.minPrice !== null && this.minPrice > 0) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(p => p.price >= this.minPrice!);
      console.log('[HomePage] After minPrice filter:', filtered.length, 'products (was', beforeCount, ')');
    }
    if (this.maxPrice !== null && this.maxPrice > 0) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
      console.log('[HomePage] After maxPrice filter:', filtered.length, 'products (was', beforeCount, ')');
    }

    // Rating filter
    if (this.minRating > 0) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(p => p.rating >= this.minRating);
      console.log('[HomePage] After rating filter:', filtered.length, 'products (was', beforeCount, ')');
    }

    // Sort
    filtered = this.sortProducts(filtered, this.selectedSort);

    console.log('[HomePage] Final filtered products:', filtered.length);
    this.filteredProducts = [...filtered];
    // Force change detection after filtering
    this.cdr.detectChanges();
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
      case 'newest':
        return sorted;
      default:
        return sorted;
    }
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedSort = 'relevance';
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = 0;
    this.applyFilters();
  }
}

