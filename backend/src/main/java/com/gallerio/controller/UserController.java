package com.gallerio.controller;

import com.gallerio.dto.UserProfileResponse;
import com.gallerio.dto.UserProfileUpdateRequest;
import com.gallerio.dto.PasswordChangeRequest;
import com.gallerio.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @ModelAttribute UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(userDetails.getUsername(), request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PasswordChangeRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok().body(Map.of("message", "Password changed successfully"));
    }

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllArtists() {
        // Only return users with role ARTIST
        List<UserProfileResponse> artists = userService.getAllArtists();
        return ResponseEntity.ok(artists);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserProfileResponse>> searchUsers(@RequestParam("q") String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
} 