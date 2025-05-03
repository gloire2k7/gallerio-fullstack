// src/main/java/com/gallerio/dto/UserSummaryDTO.java
package com.gallerio.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String profilePhoto;
}