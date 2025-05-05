package com.gallerio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String location;
    private String bio;
    private MultipartFile profilePhoto;
} 