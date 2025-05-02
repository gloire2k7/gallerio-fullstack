package com.gallerio.service;

import com.gallerio.Repository.UserRepository;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .message("Email is already registered")
                    .build();
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase()) : Role.COLLECTOR);
        user.setLocation(request.getLocation());
        user.setBio(request.getBio());
        user.setProfilePhoto(request.getProfilePhoto());

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getEmail())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("User registered successfully")
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
}