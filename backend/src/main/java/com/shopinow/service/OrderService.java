package com.shopinow.service;

import com.shopinow.dto.CreateOrderRequest;
import com.shopinow.dto.OrderDto;
import com.shopinow.dto.OrderItemDto;
import com.shopinow.dto.ProductDto;
import com.shopinow.exception.ResourceNotFoundException;
import com.shopinow.model.*;
import com.shopinow.repository.CartItemRepository;
import com.shopinow.repository.OrderRepository;
import com.shopinow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public OrderDto createOrder(User user, CreateOrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtAsc(user);
        
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }
        
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentMethod(request.getPaymentMethod());
        
        Order.ShippingAddress shippingAddress = new Order.ShippingAddress();
        shippingAddress.setFullName(request.getShippingAddress().getFullName());
        shippingAddress.setAddress(request.getShippingAddress().getAddress());
        shippingAddress.setCity(request.getShippingAddress().getCity());
        shippingAddress.setState(request.getShippingAddress().getState());
        shippingAddress.setZipCode(request.getShippingAddress().getZipCode());
        shippingAddress.setPhone(request.getShippingAddress().getPhone());
        order.setShippingAddress(shippingAddress);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
            
            subtotal = subtotal.add(
                cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()))
            );
            
            order.getOrderItems().add(orderItem);
        }
        
        order.setSubtotal(subtotal);
        order.setTax(subtotal.multiply(BigDecimal.valueOf(0.08))); // 8% tax
        order.setShipping(subtotal.compareTo(BigDecimal.valueOf(25)) >= 0 
            ? BigDecimal.ZERO 
            : BigDecimal.valueOf(5.99));
        order.setTotal(order.getSubtotal().add(order.getTax()).add(order.getShipping()));
        
        order = orderRepository.save(order);
        
        // Clear cart after order creation
        cartItemRepository.deleteByUser(user);
        
        return convertToDto(order);
    }
    
    public List<OrderDto> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public OrderDto getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Order does not belong to user");
        }
        
        return convertToDto(order);
    }
    
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus().name());
        dto.setSubtotal(order.getSubtotal());
        dto.setTax(order.getTax());
        dto.setShipping(order.getShipping());
        dto.setTotal(order.getTotal());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCreatedAt(order.getCreatedAt());
        
        if (order.getShippingAddress() != null) {
            com.shopinow.dto.ShippingAddressDto addressDto = new com.shopinow.dto.ShippingAddressDto();
            addressDto.setFullName(order.getShippingAddress().getFullName());
            addressDto.setAddress(order.getShippingAddress().getAddress());
            addressDto.setCity(order.getShippingAddress().getCity());
            addressDto.setState(order.getShippingAddress().getState());
            addressDto.setZipCode(order.getShippingAddress().getZipCode());
            addressDto.setPhone(order.getShippingAddress().getPhone());
            dto.setShippingAddress(addressDto);
        }
        
        dto.setOrderItems(order.getOrderItems().stream()
                .map(this::convertOrderItemToDto)
                .collect(Collectors.toList()));
        
        return dto;
    }
    
    private OrderItemDto convertOrderItemToDto(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPriceAtPurchase(orderItem.getPriceAtPurchase());
        
        ProductDto productDto = new ProductDto();
        Product product = orderItem.getProduct();
        productDto.setId(product.getId());
        productDto.setProductId(product.getProductId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setImageUrl(product.getImageUrl());
        productDto.setCategory(product.getCategory().getName());
        
        dto.setProduct(productDto);
        return dto;
    }
}

