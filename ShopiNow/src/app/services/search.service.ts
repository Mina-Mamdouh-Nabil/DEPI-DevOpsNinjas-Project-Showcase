import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../data/product-data';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResultsSubject = new BehaviorSubject<Product[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private productService: ProductService) {}

  search(query: string): Observable<Product[]> {
    if (!query || query.trim().length === 0) {
      this.searchResultsSubject.next([]);
      return of([]);
    }

    return this.productService.searchProducts(query).pipe(
      map(results => {
        this.searchResultsSubject.next(results);
        return results;
      }),
      catchError(error => {
        console.error('Error searching products:', error);
        this.searchResultsSubject.next([]);
        return of([]);
      })
    );
  }

  getSuggestions(query: string): Observable<string[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    return this.productService.getProducts().pipe(
      map(products => {
        const searchTerm = query.toLowerCase().trim();
        const suggestions = new Set<string>();

        products.forEach(product => {
          if (product.name.toLowerCase().includes(searchTerm)) {
            suggestions.add(product.name);
          }
          if (product.category.toLowerCase().includes(searchTerm)) {
            suggestions.add(product.category);
          }
          product.tags?.forEach(tag => {
            if (tag.toLowerCase().includes(searchTerm)) {
              suggestions.add(tag);
            }
          });
        });

        return Array.from(suggestions).slice(0, 5);
      }),
      catchError(() => of([]))
    );
  }

  clearResults(): void {
    this.searchResultsSubject.next([]);
  }
}

