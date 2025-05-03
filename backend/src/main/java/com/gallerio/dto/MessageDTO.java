// src/main/java/com/gallerio/dto/MessageDTO.java
package com.gallerio.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MessageDTO {
    private Long id;
    private String content;
    private String subject;
    private String createdAt;
    private boolean read;
    private UserSummaryDTO sender;
    private UserSummaryDTO recipient;
}