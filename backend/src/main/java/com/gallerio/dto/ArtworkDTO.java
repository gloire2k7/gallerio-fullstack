package com.gallerio.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArtworkDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 