package com.gallerio.dto;

import lombok.Data;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
public class ArtworkDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private String status;
    private Long userId;
    private String artistName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @JsonIgnore
    private MultipartFile image;
} 