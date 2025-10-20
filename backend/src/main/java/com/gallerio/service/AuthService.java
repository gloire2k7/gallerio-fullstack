package com.gallerio.service;

import com.gallerio.repository.UserRepository;
import com.gallerio.dto.AuthResponse;
import com.gallerio.dto.LoginRequest;
import com.gallerio.dto.RegisterRequest;
import com.gallerio.model.Role;
import com.gallerio.model.User;
import com.gallerio.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email is already registered
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return AuthResponse.builder()
                    .message("Email already registered")
                    .build();
        }

        // Create new user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase()) : Role.COLLECTOR)
                .location(request.getLocation())
                .bio(request.getBio())
                .enabled(true)
                .build();

        // Handle profile photo upload
        if (request.getProfilePhoto() != null && !request.getProfilePhoto().isEmpty()) {
            try {
                // Read the image
                BufferedImage originalImage = ImageIO.read(request.getProfilePhoto().getInputStream());
                
                // Calculate new dimensions while maintaining aspect ratio
                int maxDimension = 200; // Maximum width or height
                int originalWidth = originalImage.getWidth();
                int originalHeight = originalImage.getHeight();
                int newWidth = originalWidth;
                int newHeight = originalHeight;
                
                if (originalWidth > maxDimension || originalHeight > maxDimension) {
                    if (originalWidth > originalHeight) {
                        newWidth = maxDimension;
                        newHeight = (int) ((double) originalHeight / originalWidth * maxDimension);
                    } else {
                        newHeight = maxDimension;
                        newWidth = (int) ((double) originalWidth / originalHeight * maxDimension);
                    }
                }
                
                // Create resized image
                BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
                resizedImage.createGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);
                
                // Convert to JPEG with compression
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                ImageIO.write(resizedImage, "jpg", outputStream);
                
                // Convert to base64
                String base64Image = Base64.getEncoder().encodeToString(outputStream.toByteArray());
                user.setProfilePhoto(base64Image);
            } catch (IOException e) {
                log.error("Error processing profile photo: {}", e.getMessage());
                return AuthResponse.builder()
                        .message("Error processing profile photo")
                        .build();
            }
        }

        // Save user
        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getEmail())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Get user from repository
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            // Generate JWT token
            log.debug("Generating token for user: {}", user.getEmail());
            String token = jwtTokenProvider.generateToken(user);
            log.debug("Token generated successfully for user: {}", user.getEmail());

            // Return successful response
            return AuthResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .username(user.getEmail())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .message("Login successful")
                    .build();

        } catch (Exception e) {
            // Log the specific exception causing the login failure
            log.error("Error during login process for email {}: {}", request.getEmail(), e.getMessage(), e);
            return AuthResponse.builder()
                    .message("Login failed due to an internal error. Please check logs.")
                    .build();
        }
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}