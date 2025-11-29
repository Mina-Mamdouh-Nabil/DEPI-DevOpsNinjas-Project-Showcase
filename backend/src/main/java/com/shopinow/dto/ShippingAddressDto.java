package com.shopinow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddressDto {
    private String fullName;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
}


