import { Routes } from '@angular/router';

import { AuthPageComponent } from './pages/auth-page.component';
import { CartPageComponent } from './pages/cart-page.component';
import { CategoryPageComponent } from './pages/category-page.component';
import { CheckoutPageComponent } from './pages/checkout-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page.component';
import { AccountPageComponent } from './pages/account-page.component';
import { SearchResultsPageComponent } from './pages/search-results-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, // Public - browse products
  { path: 'search', component: SearchResultsPageComponent }, // Public - search
  { path: 'category/:category', component: CategoryPageComponent }, // Public - browse by category
  { path: 'product/:id', component: ProductDetailPageComponent }, // Public - view product
  { path: 'cart', component: CartPageComponent }, // Public - view cart (but API calls require auth)
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard] }, // Protected - requires login
  { path: 'account', component: AccountPageComponent, canActivate: [authGuard] }, // Protected - requires login
  { path: 'auth/login', component: AuthPageComponent },
  { path: 'auth/register', component: AuthPageComponent },
  { path: '**', redirectTo: '' }
];
