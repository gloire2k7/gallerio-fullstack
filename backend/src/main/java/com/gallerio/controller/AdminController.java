package com.gallerio.controller;

import com.gallerio.model.Order;
import com.gallerio.model.User;
import com.gallerio.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users/artists")
    public ResponseEntity<List<User>> getAllArtists() {
        return ResponseEntity.ok(adminService.getUsersByRole("ARTIST"));
    }

    @GetMapping("/users/collectors")
    public ResponseEntity<List<User>> getAllCollectors() {
        return ResponseEntity.ok(adminService.getUsersByRole("COLLECTOR"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateOrderStatus(orderId, status));
    }
} 