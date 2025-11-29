import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../components/product-card.component';
import { Product } from '../data/product-data';
import { SearchService } from '../services/search.service';
import { ProductService } from '../services/product.service';
import { ApiService, CategoryDto, ProductDto } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-search-results',
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.scss'
})
export class SearchResultsPageComponent implements OnInit {
  searchQuery = '';
  results: Product[] = [];
  filteredResults: Product[] = [];
  isLoading = false;
  categories: CategoryDto[] = [];
  
  // Filters
  selectedCategory = 'all';
  selectedSort = 'relevance';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating = 0;
  readonly sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest Arrivals' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private productService: ProductService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      const category = params['category'] || '';
      this.searchQuery = query;
      
      // Set category filter if provided in query params
      if (category && category !== 'all') {
        this.selectedCategory = category;
      } else {
        this.selectedCategory = 'all';
      }
      
      if (query) {
        this.performSearch(query);
      } else {
        this.results = [];
        this.filteredResults = [];
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.results = [];
      this.filteredResults = [];
      this.isLoading = false;
      return;
    }

    const startTime = performance.now();
    console.log('[Search] Starting search for:', query);
    this.isLoading = true;
    this.results = [];
    this.filteredResults = [];
    
    // Call API directly to skip SearchService layer (faster)
    const searchTerm = query.trim().toLowerCase();
    this.apiService.searchProducts(query).subscribe({
      next: (productDtos: ProductDto[]) => {
        const apiTime = performance.now() - startTime;
        console.log('[Search] API response received in', apiTime.toFixed(2), 'ms:', productDtos.length, 'results');
        
        const convertStart = performance.now();
        // Convert DTOs to Products inline (faster)
        // For short queries (1-2 chars), only match product names to avoid too many results
        // For longer queries, match name, description, tags, or category
        const isShortQuery = searchTerm.length <= 2;
        const products: Product[] = productDtos
          .filter(p => {
            if (!p.name && !p.description && !p.tags && !p.category) {
              return false; // Skip products with no searchable fields
            }
            
            const nameMatch = p.name?.toLowerCase().includes(searchTerm) || false;
            
            // For short queries, ONLY match product names (not descriptions/categories)
            if (isShortQuery) {
              if (!nameMatch) {
                console.log('[Search] Filtered out product (short query):', p.name, '- name does not contain:', searchTerm);
              }
              return nameMatch;
            }
            
            // For longer queries, match name, description, tags, or category
            const descMatch = p.description?.toLowerCase().includes(searchTerm) || false;
            const tagMatch = p.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;
            const categoryMatch = p.category?.toLowerCase().includes(searchTerm) || false;
            
            // Product must match in at least one field
            const matches = nameMatch || descMatch || tagMatch || categoryMatch;
            
            if (!matches) {
              console.log('[Search] Filtered out product:', p.name, '- no match for:', searchTerm);
            }
            
            return matches;
          })
          .map(p => ({
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
        console.log('[Search] Converted and filtered products in', convertTime.toFixed(2), 'ms');
        console.log('[Search] Products after filtering:', products.length, 'out of', productDtos.length);
        console.log('[Search] Search term was:', searchTerm);
        
        this.results = products;
        const filterStart = performance.now();
        this.applyFilters();
        const filterTime = performance.now() - filterStart;
        console.log('[Search] Applied filters in', filterTime.toFixed(2), 'ms');
        
        this.isLoading = false;
        const totalTime = performance.now() - startTime;
        console.log('[Search] Total search time:', totalTime.toFixed(2), 'ms');
        console.log('[Search] Results ready to display:', this.filteredResults.length);
        
        // Force change detection
        this.cdr.detectChanges();
      },
      error: (error) => {
        const errorTime = performance.now() - startTime;
        console.error('[Search] Error after', errorTime.toFixed(2), 'ms:', error);
        this.isLoading = false;
        this.results = [];
        this.filteredResults = [];
      }
    });
  }

  applyFilters(): void {
    if (!this.results || this.results.length === 0) {
      this.filteredResults = [];
      return;
    }

    // Start with all search results
    let filtered = [...this.results];

    // Category filter - check if category is selected and not 'all'
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Price filter
    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }

    // Rating filter
    if (this.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= this.minRating);
    }

    // Sort
    filtered = this.sortProducts(filtered, this.selectedSort);

    this.filteredResults = [...filtered];
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
        return sorted; // Would need a date field for this
      default:
        return sorted;
    }
  }

  onFilterChange(): void {
    // Apply filters immediately
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

