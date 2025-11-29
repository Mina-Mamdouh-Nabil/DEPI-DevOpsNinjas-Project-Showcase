import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService, ProductDto } from './api.service';
import { Product } from '../data/product-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCache$ = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsCache$.asObservable();

  constructor(private apiService: ApiService) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (products) => {
        const converted = products.map(p => this.convertToProduct(p));
        this.productsCache$.next(converted);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.productsCache$.next([]);
      }
    });
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.apiService.getFeaturedProducts().pipe(
      map(products => products.map(p => this.convertToProduct(p))),
      catchError(error => {
        console.error('Error loading featured products:', error);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.apiService.getProductById(id).pipe(
      map(product => this.convertToProduct(product)),
      catchError(error => {
        console.error('Error loading product:', error);
        return of(undefined);
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.apiService.getProductsByCategory(category).pipe(
      map(products => products.map(p => this.convertToProduct(p))),
      catchError(error => {
        console.error('Error loading products by category:', error);
        return of([]);
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }
    return this.apiService.searchProducts(query).pipe(
      map(products => products.map(p => this.convertToProduct(p))),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }

  getProductsWithFilters(category?: string, minPrice?: number, maxPrice?: number, minRating?: number): Observable<Product[]> {
    return this.apiService.getProductsWithFilters(category, minPrice, maxPrice, minRating).pipe(
      map(products => products.map(p => this.convertToProduct(p))),
      catchError(error => {
        console.error('Error loading filtered products:', error);
        return of([]);
      })
    );
  }

  private convertToProduct(dto: ProductDto): Product {
    const converted = {
      id: dto.productId || dto.id.toString(),
      name: dto.name,
      category: dto.category,
      description: dto.description,
      price: dto.price,
      oldPrice: dto.oldPrice,
      rating: dto.rating,
      reviews: dto.reviewsCount,
      image: dto.imageUrl,
      badges: dto.badges,
      tags: dto.tags,
      featured: dto.featured,
      backendId: dto.id
    };
    
    console.log('[ProductService] convertToProduct:', {
      'dto.id': dto.id,
      'dto.productId': dto.productId,
      'converted.id': converted.id,
      'converted.backendId': converted.backendId,
      'name': dto.name
    });
    
    return converted;
  }
}


