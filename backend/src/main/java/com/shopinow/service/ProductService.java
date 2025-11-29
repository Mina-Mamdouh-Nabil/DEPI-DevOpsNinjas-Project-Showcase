package com.shopinow.service;

import com.shopinow.dto.ProductDto;
import com.shopinow.exception.ResourceNotFoundException;
import com.shopinow.model.Product;
import com.shopinow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByCategory(String category) {
        // Normalize category name to lowercase for consistent matching
        String normalizedCategory = category.toLowerCase();
        return productRepository.findByCategoryName(normalizedCategory).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToDto(product);
    }
    
    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        String trimmedQuery = query.trim();
        
        // For very short queries (1-2 characters), only search product names
        // This prevents matching category names like "fashion" when searching for "f"
        if (trimmedQuery.length() <= 2) {
            return productRepository.findAll().stream()
                    .filter(p -> p.getName() != null && 
                            p.getName().toLowerCase().contains(trimmedQuery.toLowerCase()))
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
        
        // For longer queries, search all fields (name, description, category)
        return productRepository.searchProducts(trimmedQuery).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProductDto> getProductsWithFilters(String category, Double minPrice, Double maxPrice, Double minRating) {
        return productRepository.findWithFilters(category, minPrice, maxPrice, minRating).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOldPrice(product.getOldPrice());
        dto.setRating(product.getRating());
        dto.setReviewsCount(product.getReviewsCount());
        dto.setImageUrl(product.getImageUrl());
        dto.setCategory(product.getCategory().getName());
        dto.setTags(product.getTags());
        dto.setBadges(product.getBadges());
        dto.setFeatured(product.getFeatured());
        dto.setStockQuantity(product.getStockQuantity());
        return dto;
    }
}

