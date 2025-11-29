package com.shopinow.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @Valid
    @NotBlank(message = "Shipping address is required")
    private ShippingAddressDto shippingAddress;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}


