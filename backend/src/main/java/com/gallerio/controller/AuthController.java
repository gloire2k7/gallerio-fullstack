package com.gallerio.controller;

import com.gallerio.Repository.UserRepository;
import com.gallerio.dto.AuthResponse;
import com.gallerio.dto.LoginRequest;
import com.gallerio.dto.RegisterRequest;
import com.gallerio.model.User;
import com.gallerio.security.JwtTokenProvider;
import com.gallerio.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserRepository userService;

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
}