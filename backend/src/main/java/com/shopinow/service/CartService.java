package com.shopinow.service;

import com.shopinow.dto.CartItemDto;
import com.shopinow.dto.ProductDto;
import com.shopinow.exception.ResourceNotFoundException;
import com.shopinow.model.CartItem;
import com.shopinow.model.Product;
import com.shopinow.model.User;
import com.shopinow.repository.CartItemRepository;
import com.shopinow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    public List<CartItemDto> getCartItems(User user) {
        return cartItemRepository.findByUserOrderByCreatedAtAsc(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemDto addToCart(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        
        CartItem existingItem = cartItemRepository.findByUserAndProductId(user, productId).orElse(null);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
            return convertToDto(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartItemRepository.save(newItem);
            return convertToDto(newItem);
        }
    }
    
    @Transactional
    public CartItemDto updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to user");
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return convertToDto(cartItem);
    }
    
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to user");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
    
    private CartItemDto convertToDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        
        ProductDto productDto = new ProductDto();
        Product product = cartItem.getProduct();
        productDto.setId(product.getId());
        productDto.setProductId(product.getProductId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setOldPrice(product.getOldPrice());
        productDto.setRating(product.getRating());
        productDto.setReviewsCount(product.getReviewsCount());
        productDto.setImageUrl(product.getImageUrl());
        productDto.setCategory(product.getCategory().getName());
        productDto.setTags(product.getTags());
        productDto.setBadges(product.getBadges());
        productDto.setFeatured(product.getFeatured());
        productDto.setStockQuantity(product.getStockQuantity());
        
        dto.setProduct(productDto);
        return dto;
    }
}

