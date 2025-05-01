package com.gallerio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {


    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;

    // Optional fields
    private String location;
    private String bio;
    private String profilePhoto;
}