package com.gallerio.controller;

import com.gallerio.repository.UserRepository;
import com.gallerio.dto.AuthResponse;
import com.gallerio.dto.LoginRequest;
import com.gallerio.dto.RegisterRequest;
import com.gallerio.model.User;
import com.gallerio.security.JwtTokenProvider;
import com.gallerio.service.AuthService;
import com.gallerio.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.Random;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserRepository userService;

    @Autowired
    private EmailService emailService;

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> register(@Valid @ModelAttribute RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        log.info("Registration request details - firstName: {}, lastName: {}, role: {}", 
            request.getFirstName(), request.getLastName(), request.getRole());
        log.info("Profile photo present: {}", request.getProfilePhoto() != null);
        
        try {
            AuthResponse response = authService.register(request);
            log.info("Registration successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration failed for email: {} - Error: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .message("Registration failed: " + e.getMessage())
                            .build()
            );
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AuthResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        String errorMessage = errors.entrySet().stream()
            .map(entry -> entry.getKey() + ": " + entry.getValue())
            .findFirst()
            .orElse("Validation failed");

        return ResponseEntity.badRequest().body(
            AuthResponse.builder()
                .message(errorMessage)
                .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for email: {}", request.getEmail());
        try {
            AuthResponse response = authService.login(request);
            log.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for email: {}", request.getEmail(), e);
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .message("Login failed: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<AuthResponse> verifyToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(
                    AuthResponse.builder()
                        .message("Invalid or expired token")
                        .build()
                );
            }

            String email = authentication.getName();
            Optional<User> userOpt = userService.findByEmail(email);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return ResponseEntity.ok(AuthResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getEmail())
                    .role(user.getRole().name())
                    .message("Token is valid")
                    .build());
            }
            
            return ResponseEntity.status(401).body(
                AuthResponse.builder()
                    .message("User not found")
                    .build()
            );
        } catch (Exception e) {
            log.error("Token verification failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(
                AuthResponse.builder()
                    .message("Token verification failed: " + e.getMessage())
                            .build()
            );
        }
    }

    // --- Forgot Password: Send Code ---
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        User user = userService.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "No user found with that email."));
        }
        // Generate 6-digit code
        String code = String.format("%06d", new Random().nextInt(999999));
        user.setResetCode(code);
        user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(15));
        userService.save(user);
        // Send email
        String subject = "Your Password Reset Code";
        String text = "Your password reset code is: " + code + "\nThis code will expire in 15 minutes.";
        emailService.sendEmail(user.getEmail(), subject, text);
        return ResponseEntity.ok(Map.of("message", "Reset code sent to your email."));
    }

    // --- Forgot Password: Reset Password ---
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
        String newPassword = payload.get("newPassword");
        User user = userService.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "No user found with that email."));
        }
        if (user.getResetCode() == null || user.getResetCodeExpiry() == null
            || !user.getResetCode().equals(code)
            || user.getResetCodeExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired code."));
        }
        // Reset password
        user.setPassword(authService.encodePassword(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        userService.save(user);
        return ResponseEntity.ok(Map.of("message", "Password reset successful. You can now log in."));
    }
}