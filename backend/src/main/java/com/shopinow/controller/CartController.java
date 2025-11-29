package com.shopinow.controller;

import com.shopinow.dto.CartItemDto;
import com.shopinow.model.User;
import com.shopinow.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCartItems(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartItems(user));
    }
    
    @PostMapping("/items")
    public ResponseEntity<CartItemDto> addToCart(
            @AuthenticationPrincipal User user,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }
    
    @PutMapping("/items/{id}")
    public ResponseEntity<CartItemDto> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        CartItemDto item = cartService.updateQuantity(user, id, quantity);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        cartService.removeFromCart(user, id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}


