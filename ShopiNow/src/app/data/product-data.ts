export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badges?: string[];
  tags?: string[];
  featured?: boolean;
  backendId?: number;
}

export interface CartItem {
  id?: number; // Backend cart item ID
  product: Product;
  quantity: number;
}

export const categories: Category[] = [
  {
    id: 'electronics',
    title: 'Electronics',
    description: 'Headphones, wearables, smart home and more',
    icon: '⌚',
    accent: '#4F46E5'
  },
  {
    id: 'fashion',
    title: 'Fashion',
    description: 'Curated seasonal drops and style essentials',
    icon: '👗',
    accent: '#FB923C'
  },
  {
    id: 'home',
    title: 'Home',
    description: 'Furniture, lighting and smart living',
    icon: '🏠',
    accent: '#10B981'
  },
  {
    id: 'beauty',
    title: 'Beauty',
    description: 'Self-care and premium skincare rituals',
    icon: '💄',
    accent: '#EC4899'
  },
  {
    id: 'kids',
    title: 'Kids & Toys',
    description: 'Education, creativity and fun',
    icon: '🧸',
    accent: '#F472B6'
  },
  {
    id: 'sports',
    title: 'Sports Gear',
    description: 'Performance, outdoors, and fitness',
    icon: '🏁',
    accent: '#22C55E'
  }
];

export const heroPromo = {
  title: 'A shop that keeps pace with your lifestyle',
  subtitle: 'Curated homes, gadgets, and wellness essentials from brands you trust.',
  callToAction: 'Start browsing',
  secondaryAction: 'See daily highlights',
  stats: [
    { label: 'Global brands', value: '2,500+' },
    { label: 'Same-day delivery', value: '120 cities' },
    { label: 'Satisfaction score', value: '4.9/5' }
  ]
};

export const supportHighlights = [
  {
    title: 'Fast delivery',
    description: 'Schedule your delivery window and track it live.',
    icon: '🚚'
  },
  {
    title: 'Secure payments',
    description: 'PCI-compliant payments with fraud monitoring.',
    icon: '🔒'
  },
  {
    title: '24/7 support',
    description: 'Live chat, WhatsApp, and phone support in English & Arabic.',
    icon: '💬'
  }
];

export const products: Product[] = [
  // Electronics - 3 products
  {
    id: 'smartwatch-neo',
    name: 'NovaFit Active Smartwatch',
    category: 'electronics',
    description: 'Tracks your workouts, stress, and sleep while lasting 10 days on a single charge.',
    price: 169,
    oldPrice: 229,
    rating: 4.8,
    reviews: 1120,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    badges: ['Top rated'],
    tags: ['Wearables'],
    featured: true
  },
  {
    id: 'noise-headphones',
    name: 'Halo Comfort Noise-Cancelling Headphones',
    category: 'electronics',
    description: 'Immersive sound with adaptive noise cancellation for long-haul flights.',
    price: 219,
    oldPrice: 279,
    rating: 4.7,
    reviews: 840,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badges: ['Best seller'],
    tags: ['Audio'],
    featured: true
  },
  {
    id: 'smartphone-pro',
    name: 'ProPhone 15 Max - 256GB',
    category: 'electronics',
    description: '6.7" Super Retina display, A17 Pro chip, 48MP camera system with ProRAW.',
    price: 999,
    oldPrice: 1199,
    rating: 4.9,
    reviews: 3420,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
    badges: ['Best seller', 'New'],
    tags: ['Smartphones'],
    featured: true
  },
  {
    id: 'laptop-ultra',
    name: 'UltraBook Pro 16" - M3 Chip',
    category: 'electronics',
    description: '16-inch Liquid Retina XDR display, M3 Pro chip, 18-hour battery life.',
    price: 2499,
    oldPrice: 2799,
    rating: 4.8,
    reviews: 1890,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    badges: ['Premium'],
    tags: ['Laptops'],
    featured: true
  },
  {
    id: 'tablet-pro',
    name: 'ProTab 12.9" - 256GB WiFi',
    category: 'electronics',
    description: '12.9-inch Liquid Retina display, M2 chip, Apple Pencil compatible, perfect for creative professionals.',
    price: 1099,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 2150,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    badges: ['Best seller', 'New'],
    tags: ['Tablets'],
    featured: true
  },
  // Fashion - 3 products
  {
    id: 'eco-backpack',
    name: 'TerraTrail Adventure Backpack',
    category: 'fashion',
    description: 'Water-resistant shell, padded straps, and laptop sleeve for urban explorers.',
    price: 89,
    rating: 4.5,
    reviews: 602,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    badges: ['Limited drop'],
    tags: ['Travel'],
    featured: true
  },
  {
    id: 'sneakers-pro',
    name: 'AirFlex Running Sneakers',
    category: 'fashion',
    description: 'Lightweight running shoes with breathable mesh and cushioned sole.',
    price: 79,
    oldPrice: 99,
    rating: 4.4,
    reviews: 387,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    badges: ['New'],
    tags: ['Footwear'],
    featured: true
  },
  {
    id: 'leather-jacket',
    name: 'Classic Leather Moto Jacket',
    category: 'fashion',
    description: 'Genuine leather jacket with quilted lining and multiple pockets.',
    price: 199,
    oldPrice: 249,
    rating: 4.7,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    badges: ['Premium'],
    tags: ['Outerwear'],
    featured: true
  },
  {
    id: 'cotton-tshirt',
    name: 'Premium Cotton T-Shirt Pack',
    category: 'fashion',
    description: '3-pack of 100% organic cotton t-shirts in classic colors.',
    price: 29,
    oldPrice: 39,
    rating: 4.6,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    badges: ['Bestseller'],
    tags: ['Clothing'],
    featured: true
  },
  {
    id: 'denim-jeans',
    name: 'Classic Fit Denim Jeans',
    category: 'fashion',
    description: 'Slim fit jeans with stretch, available in multiple washes.',
    price: 59,
    oldPrice: 79,
    rating: 4.5,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
    badges: ['New'],
    tags: ['Clothing'],
    featured: true
  },
  // Home - 3 products
  {
    id: 'studio-lamp',
    name: 'Lumos Studio Smart Lamp',
    category: 'home',
    description: 'Adjustable color temperature, voice control ready, perfect for productive nights.',
    price: 129,
    rating: 4.6,
    reviews: 413,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    badges: ['Smart home'],
    tags: ['Lighting'],
    featured: true
  },
  {
    id: 'pro-blender',
    name: 'BlendPro Pulse Blender',
    category: 'home',
    description: 'High torque motor with crushed ice and smoothie presets.',
    price: 149,
    oldPrice: 179,
    rating: 4.4,
    reviews: 287,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
    badges: ['Kitchen'],
    tags: ['Appliances'],
    featured: true
  },
  {
    id: 'coffee-maker',
    name: 'BrewMaster Coffee Maker',
    category: 'home',
    description: 'Programmable 12-cup coffee maker with thermal carafe and auto shut-off.',
    price: 89,
    oldPrice: 119,
    rating: 4.5,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80',
    badges: ['Best value'],
    tags: ['Kitchen'],
    featured: true
  },
  {
    id: 'sofa-modern',
    name: 'Modern 3-Seater Sofa',
    category: 'home',
    description: 'Contemporary fabric sofa with soft cushions, perfect for living room.',
    price: 599,
    oldPrice: 799,
    rating: 4.7,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    badges: ['Free delivery'],
    tags: ['Furniture'],
    featured: true
  },
  {
    id: 'dining-table',
    name: 'Wooden Dining Table Set',
    category: 'home',
    description: '6-person dining table with matching chairs, solid wood construction.',
    price: 899,
    oldPrice: 1199,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=600&q=80',
    badges: ['Premium'],
    tags: ['Furniture'],
    featured: true
  },
  // Beauty - 3 products
  {
    id: 'skincare-set',
    name: 'GlowBalance Skincare Ritual',
    category: 'beauty',
    description: 'Hypoallergenic routine with hyaluronic acid, niacinamide, and SPF 50.',
    price: 72,
    rating: 4.9,
    reviews: 650,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
    badges: ['Dermatologist approved'],
    tags: ['Skincare'],
    featured: true
  },
  {
    id: 'makeup-palette',
    name: 'ColorPop Eyeshadow Palette',
    category: 'beauty',
    description: '12-shade eyeshadow palette with matte and shimmer finishes.',
    price: 24,
    oldPrice: 34,
    rating: 4.5,
    reviews: 789,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    badges: ['Bestseller'],
    tags: ['Makeup'],
    featured: true
  },
  {
    id: 'lipstick-set',
    name: 'Matte Lipstick Collection - 6 Shades',
    category: 'beauty',
    description: 'Long-lasting matte lipstick set in trending colors, 12-hour wear.',
    price: 34,
    oldPrice: 49,
    rating: 4.7,
    reviews: 1120,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    badges: ['Limited Edition'],
    tags: ['Makeup'],
    featured: true
  },
  {
    id: 'face-serum',
    name: 'Vitamin C Brightening Serum',
    category: 'beauty',
    description: 'Anti-aging serum with 20% vitamin C, hyaluronic acid, and peptides.',
    price: 45,
    oldPrice: 65,
    rating: 4.8,
    reviews: 2340,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    badges: ['Top rated'],
    tags: ['Skincare'],
    featured: true
  },
  // Sports
  {
    id: 'yoga-mat',
    name: 'Premium Yoga Mat - Non-Slip',
    category: 'sports',
    description: 'Extra thick 6mm yoga mat with non-slip surface, perfect for all yoga practices and workouts.',
    price: 39,
    oldPrice: 59,
    rating: 4.6,
    reviews: 1870,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
    badges: ['Best seller'],
    tags: ['Fitness'],
    featured: true
  }
];

export const cartItems: CartItem[] = [
  { product: products[0], quantity: 1 },
  { product: products[3], quantity: 1 },
  { product: products[5], quantity: 2 }
];

export const accountHighlights = [
  {
    title: 'Orders in progress',
    detail: '2 packages are out for delivery and linked to your mobile number.'
  },
  {
    title: 'Preferred addresses',
    detail: 'Home, work, and a weekend spot all saved with contactless instructions.'
  },
  {
    title: 'Reward balance',
    detail: 'You have 4,600 points ready to be redeemed.'
  }
];


