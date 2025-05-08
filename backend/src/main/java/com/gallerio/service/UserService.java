package com.gallerio.service;

import com.gallerio.Repository.UserRepository;
import com.gallerio.dto.UserProfileResponse;
import com.gallerio.dto.UserProfileUpdateRequest;
import com.gallerio.dto.PasswordChangeRequest;
import com.gallerio.model.User;
import com.gallerio.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .location(user.getLocation())
                .bio(user.getBio())
                .profilePhoto(user.getProfilePhoto())
                .build();
    }

    @Transactional
    public UserProfileResponse updateUserProfile(String email, UserProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
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
                throw new RuntimeException("Error processing profile photo");
            }
        }

        userRepository.save(user);

        return getUserProfile(email);
    }

    @Transactional
    public void deleteUserWithCascade(Long userId) {
        userRepository.deleteUserAndRelated(userId);
    }

    @Transactional
    public void changePassword(String email, PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public List<UserProfileResponse> getAllArtists() {
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == Role.ARTIST)
            .map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .location(user.getLocation())
                .bio(user.getBio())
                .profilePhoto(user.getProfilePhoto())
                .build())
            .collect(Collectors.toList());
    }

    public List<UserProfileResponse> searchUsers(String query) {
        return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query)
            .stream()
            .map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .location(user.getLocation())
                .bio(user.getBio())
                .profilePhoto(user.getProfilePhoto())
                .build())
            .collect(Collectors.toList());
    }
} 