package com.gallerio.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private Long artworkId;
    private String phoneNumber;
    private String paymentMethod;
} 