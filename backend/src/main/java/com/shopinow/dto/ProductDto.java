package com.shopinow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String productId; // Frontend product ID
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private Double rating;
    private Integer reviewsCount;
    private String imageUrl;
    private String category;
    private List<String> tags;
    private List<String> badges;
    private Boolean featured;
    private Integer stockQuantity;
}

