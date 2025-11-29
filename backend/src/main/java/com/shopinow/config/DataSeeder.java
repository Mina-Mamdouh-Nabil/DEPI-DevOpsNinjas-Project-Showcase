package com.shopinow.config;

import com.shopinow.model.Category;
import com.shopinow.model.Product;
import com.shopinow.repository.CategoryRepository;
import com.shopinow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Only seed if database is empty
            if (categoryRepository.count() == 0) {
                seedCategories();
                seedProducts();
                System.out.println("✅ Database seeded successfully with all frontend data!");
            } else {
                System.out.println("✅ Database already contains data. Skipping seed.");
            }
        };
    }
    
    private void seedCategories() {
        List<Category> categories = Arrays.asList(
            createCategory("electronics", "Electronics", "Headphones, wearables, smart home and more", "⌚", "#4F46E5"),
            createCategory("fashion", "Fashion", "Curated seasonal drops and style essentials", "👗", "#FB923C"),
            createCategory("home", "Home", "Furniture, lighting and smart living", "🏠", "#10B981"),
            createCategory("beauty", "Beauty", "Self-care and premium skincare rituals", "💄", "#EC4899"),
            createCategory("kids", "Kids & Toys", "Education, creativity and fun", "🧸", "#F472B6"),
            createCategory("sports", "Sports Gear", "Performance, outdoors, and fitness", "🏁", "#22C55E")
        );
        
        categoryRepository.saveAll(categories);
    }
    
    private Category createCategory(String name, String title, String description, String icon, String accent) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIcon(icon);
        category.setAccentColor(accent);
        return category;
    }
    
    private void seedProducts() {
        // Get categories
        Category electronics = categoryRepository.findByName("electronics").orElseThrow();
        Category fashion = categoryRepository.findByName("fashion").orElseThrow();
        Category home = categoryRepository.findByName("home").orElseThrow();
        Category beauty = categoryRepository.findByName("beauty").orElseThrow();
        Category sports = categoryRepository.findByName("sports").orElseThrow();
        
        List<Product> products = Arrays.asList(
            // Electronics - 5 products
            createProduct("smartwatch-neo", "NovaFit Active Smartwatch",
                "Tracks your workouts, stress, and sleep while lasting 10 days on a single charge.",
                new BigDecimal("169.00"), new BigDecimal("229.00"), 4.8, 1120,
                "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
                electronics, Arrays.asList("Wearables"), Arrays.asList("Top rated"), true, 100),
            
            createProduct("noise-headphones", "Halo Comfort Noise-Cancelling Headphones",
                "Immersive sound with adaptive noise cancellation for long-haul flights.",
                new BigDecimal("219.00"), new BigDecimal("279.00"), 4.7, 840,
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                electronics, Arrays.asList("Audio"), Arrays.asList("Best seller"), true, 75),
            
            createProduct("smartphone-pro", "ProPhone 15 Max - 256GB",
                "6.7\" Super Retina display, A17 Pro chip, 48MP camera system with ProRAW.",
                new BigDecimal("999.00"), new BigDecimal("1199.00"), 4.9, 3420,
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
                electronics, Arrays.asList("Smartphones"), Arrays.asList("Best seller", "New"), true, 50),
            
            createProduct("laptop-ultra", "UltraBook Pro 16\" - M3 Chip",
                "16-inch Liquid Retina XDR display, M3 Pro chip, 18-hour battery life.",
                new BigDecimal("2499.00"), new BigDecimal("2799.00"), 4.8, 1890,
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
                electronics, Arrays.asList("Laptops"), Arrays.asList("Premium"), true, 30),
            
            createProduct("tablet-pro", "ProTab 12.9\" - 256GB WiFi",
                "12.9-inch Liquid Retina display, M2 chip, Apple Pencil compatible, perfect for creative professionals.",
                new BigDecimal("1099.00"), new BigDecimal("1299.00"), 4.7, 2150,
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
                electronics, Arrays.asList("Tablets"), Arrays.asList("Best seller", "New"), true, 40),
            
            // Fashion - 5 products
            createProduct("eco-backpack", "TerraTrail Adventure Backpack",
                "Water-resistant shell, padded straps, and laptop sleeve for urban explorers.",
                new BigDecimal("89.00"), null, 4.5, 602,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
                fashion, Arrays.asList("Travel"), Arrays.asList("Limited drop"), true, 80),
            
            createProduct("sneakers-pro", "AirFlex Running Sneakers",
                "Lightweight running shoes with breathable mesh and cushioned sole.",
                new BigDecimal("79.00"), new BigDecimal("99.00"), 4.4, 387,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                fashion, Arrays.asList("Footwear"), Arrays.asList("New"), true, 120),
            
            createProduct("leather-jacket", "Classic Leather Moto Jacket",
                "Genuine leather jacket with quilted lining and multiple pockets.",
                new BigDecimal("199.00"), new BigDecimal("249.00"), 4.7, 245,
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
                fashion, Arrays.asList("Outerwear"), Arrays.asList("Premium"), true, 45),
            
            createProduct("cotton-tshirt", "Premium Cotton T-Shirt Pack",
                "3-pack of 100% organic cotton t-shirts in classic colors.",
                new BigDecimal("29.00"), new BigDecimal("39.00"), 4.6, 1240,
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
                fashion, Arrays.asList("Clothing"), Arrays.asList("Bestseller"), true, 200),
            
            createProduct("denim-jeans", "Classic Fit Denim Jeans",
                "Slim fit jeans with stretch, available in multiple washes.",
                new BigDecimal("59.00"), new BigDecimal("79.00"), 4.5, 890,
                "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
                fashion, Arrays.asList("Clothing"), Arrays.asList("New"), true, 150),
            
            // Home - 5 products
            createProduct("studio-lamp", "Lumos Studio Smart Lamp",
                "Adjustable color temperature, voice control ready, perfect for productive nights.",
                new BigDecimal("129.00"), null, 4.6, 413,
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                home, Arrays.asList("Lighting"), Arrays.asList("Smart home"), true, 60),
            
            createProduct("pro-blender", "BlendPro Pulse Blender",
                "High torque motor with crushed ice and smoothie presets.",
                new BigDecimal("149.00"), new BigDecimal("179.00"), 4.4, 287,
                "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80",
                home, Arrays.asList("Appliances"), Arrays.asList("Kitchen"), true, 90),
            
            createProduct("coffee-maker", "BrewMaster Coffee Maker",
                "Programmable 12-cup coffee maker with thermal carafe and auto shut-off.",
                new BigDecimal("89.00"), new BigDecimal("119.00"), 4.5, 456,
                "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
                home, Arrays.asList("Kitchen"), Arrays.asList("Best value"), true, 70),
            
            createProduct("sofa-modern", "Modern 3-Seater Sofa",
                "Contemporary fabric sofa with soft cushions, perfect for living room.",
                new BigDecimal("599.00"), new BigDecimal("799.00"), 4.7, 320,
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
                home, Arrays.asList("Furniture"), Arrays.asList("Free delivery"), true, 25),
            
            createProduct("dining-table", "Wooden Dining Table Set",
                "6-person dining table with matching chairs, solid wood construction.",
                new BigDecimal("899.00"), new BigDecimal("1199.00"), 4.6, 156,
                "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=600&q=80",
                home, Arrays.asList("Furniture"), Arrays.asList("Premium"), true, 15),
            
            // Beauty - 4 products
            createProduct("skincare-set", "GlowBalance Skincare Ritual",
                "Hypoallergenic routine with hyaluronic acid, niacinamide, and SPF 50.",
                new BigDecimal("72.00"), null, 4.9, 650,
                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
                beauty, Arrays.asList("Skincare"), Arrays.asList("Dermatologist approved"), true, 180),
            
            createProduct("makeup-palette", "ColorPop Eyeshadow Palette",
                "12-shade eyeshadow palette with matte and shimmer finishes.",
                new BigDecimal("24.00"), new BigDecimal("34.00"), 4.5, 789,
                "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
                beauty, Arrays.asList("Makeup"), Arrays.asList("Bestseller"), true, 250),
            
            createProduct("lipstick-set", "Matte Lipstick Collection - 6 Shades",
                "Long-lasting matte lipstick set in trending colors, 12-hour wear.",
                new BigDecimal("34.00"), new BigDecimal("49.00"), 4.7, 1120,
                "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
                beauty, Arrays.asList("Makeup"), Arrays.asList("Limited Edition"), true, 140),
            
            createProduct("face-serum", "Vitamin C Brightening Serum",
                "Anti-aging serum with 20% vitamin C, hyaluronic acid, and peptides.",
                new BigDecimal("45.00"), new BigDecimal("65.00"), 4.8, 2340,
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
                beauty, Arrays.asList("Skincare"), Arrays.asList("Top rated"), true, 200),
            
            // Sports - 1 product
            createProduct("yoga-mat", "Premium Yoga Mat - Non-Slip",
                "Extra thick 6mm yoga mat with non-slip surface, perfect for all yoga practices and workouts.",
                new BigDecimal("39.00"), new BigDecimal("59.00"), 4.6, 1870,
                "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
                sports, Arrays.asList("Fitness"), Arrays.asList("Best seller"), true, 300)
        );
        
        productRepository.saveAll(products);
    }
    
    private Product createProduct(String productId, String name, String description, BigDecimal price, 
                                  BigDecimal oldPrice, Double rating, Integer reviewsCount,
                                  String imageUrl, Category category, List<String> tags,
                                  List<String> badges, Boolean featured, Integer stockQuantity) {
        Product product = new Product();
        product.setProductId(productId);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setOldPrice(oldPrice);
        product.setRating(rating);
        product.setReviewsCount(reviewsCount);
        product.setImageUrl(imageUrl);
        product.setCategory(category);
        product.setTags(tags);
        product.setBadges(badges);
        product.setFeatured(featured);
        product.setStockQuantity(stockQuantity);
        return product;
    }
}
