# ShopiNow Frontend

Modern e-commerce frontend application built with Angular, featuring a clean Amazon-style UI, comprehensive product browsing, search functionality, shopping cart, and user authentication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

### Core Functionality
- **Product Browsing**: Browse all products with filtering and sorting
- **Advanced Search**: Smart search with category filtering, price range, and rating filters
- **Category Navigation**: Browse products by category (Electronics, Fashion, Home, Beauty, Sports)
- **Shopping Cart**: Add products to cart with quantity management
- **Checkout Process**: Complete checkout with shipping address
- **User Authentication**: Login and registration with JWT authentication
- **User Profile**: View profile and order history
- **Product Details**: Detailed product pages with quantity selection
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile devices

### Advanced Features
- **Smart Search**: Prioritizes product name matches, handles short queries intelligently
- **Filtering & Sorting**: Filter by category, price range, and rating. Sort by relevance, price, rating, and newest
- **Sticky Navigation**: Fixed header with search and category navigation
- **Cart Persistence**: Shopping cart synchronized with backend
- **Protected Routes**: Authentication guards for protected pages
- **Error Handling**: Global error handling with automatic redirects

## 🛠️ Tech Stack

- **Framework**: Angular 21.0.0
- **Language**: TypeScript 5.9.2
- **Styling**: SCSS
- **UI Framework**: Bootstrap 5.3.8
- **State Management**: RxJS 7.8.0 (BehaviorSubject, Observables)
- **Routing**: Angular Router
- **Forms**: Angular Forms (Template-driven)
- **HTTP Client**: Angular HttpClient with interceptors
- **Testing**: Vitest 4.0.8
- **Package Manager**: npm 10.9.3

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** or higher
  ```bash
  node --version
  ```

- **npm 10+** or higher
  ```bash
  npm --version
  ```

- **Angular CLI** (optional, but recommended)
  ```bash
  npm install -g @angular/cli
  ```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopinow-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL** (see [Configuration](#-configuration))

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:4200
   ```

## ⚙️ Configuration

### API Configuration

The frontend connects to the backend API. Configure the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

For production, create `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

### Environment Variables (Optional)

You can also use environment variables by modifying `angular.json`:

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
    }
  }
}
```

## 🏃 Running the Application

### Development Mode

```bash
# Start development server
npm start
```

The application will be available at `http://localhost:4200` and will automatically reload when you make changes.

### Build for Production

```bash
# Build the application
npm run build
```

The production build will be in `dist/shopinow/browser/`.

### Run Tests

```bash
# Run unit tests
npm test
```

## 📁 Project Structure

```
shopinow-frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   │   └── product-card.component.ts
│   │   ├── data/               # Type definitions
│   │   │   └── product-data.ts
│   │   ├── guards/             # Route guards
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/       # HTTP interceptors
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── layout/            # Layout components
│   │   │   ├── app-shell.component.ts
│   │   │   └── app-footer.component.ts
│   │   ├── pages/             # Page components
│   │   │   ├── home-page.component.ts
│   │   │   ├── search-results-page.component.ts
│   │   │   ├── category-page.component.ts
│   │   │   ├── product-detail-page.component.ts
│   │   │   ├── cart-page.component.ts
│   │   │   ├── checkout-page.component.ts
│   │   │   ├── auth-page.component.ts
│   │   │   └── account-page.component.ts
│   │   ├── services/          # Services
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── search.service.ts
│   │   ├── app.routes.ts      # Route configuration
│   │   ├── app.config.ts      # App configuration
│   │   └── app.ts             # Root component
│   ├── environments/          # Environment configuration
│   │   └── environment.ts
│   ├── styles.scss            # Global styles
│   ├── index.html             # Main HTML file
│   └── main.ts               # Application entry point
├── public/                    # Static assets
├── package.json
├── angular.json
└── README.md
```

## 🧪 Development

### Available npm Scripts

- `npm start` - Start development server (http://localhost:4200)
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests
- `npm run ng` - Access Angular CLI directly

### Code Structure

- **Components**: Standalone components using Angular's standalone API
- **Services**: Injectable services for business logic and API calls
- **Interceptors**: HTTP interceptors for authentication and error handling
- **Guards**: Route guards for protecting routes
- **Routes**: Centralized route configuration in `app.routes.ts`


## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in `dist/shopinow/browser/`.

### Deployment Options

#### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist/shopinow/browser/` folder to Netlify
3. Configure environment variables if needed

#### Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist/shopinow/browser`
4. Deploy

#### GitHub Pages
1. Build the project: `npm run build`
2. Copy contents of `dist/shopinow/browser/` to `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload `dist/shopinow/browser/` contents to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

#### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

### Production Checklist

- [ ] Update API URL in `environment.prod.ts`
- [ ] Configure CORS on backend for production domain
- [ ] Enable production mode in Angular
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure analytics (optional)
- [ ] Set up SSL/HTTPS
- [ ] Test all features in production environment


## 📄 License

This project is part of the ShopiNow e-commerce platform.

## 👤 Author

ShopiNow Development Team

## 🙏 Acknowledgments

- Angular team
- Bootstrap team
- All contributors

---

**Note**: This frontend is designed to work with the ShopiNow backend API. Ensure the backend is running and configured correctly before starting the frontend application.
