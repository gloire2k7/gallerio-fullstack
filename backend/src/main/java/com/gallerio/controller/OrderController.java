package com.gallerio.controller;

import com.gallerio.dto.OrderRequest;
import com.gallerio.model.Order;
import com.gallerio.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody OrderRequest request) {
        Order order = orderService.createOrder(
            request.getArtworkId(),
            userDetails.getUsername(),
            request.getPhoneNumber(),
            request.getPaymentMethod()
        );
        return ResponseEntity.ok(order);
    }

    @GetMapping("/artist")
    public ResponseEntity<List<Order>> getArtistOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getArtistOrders(userDetails.getUsername()));
    }

    @GetMapping("/customer")
    public ResponseEntity<List<Order>> getCustomerOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getCustomerOrders(userDetails.getUsername()));
    }
} 