package com.gallerio.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "_order")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum PaymentStatus {
        PAID,
        PENDING_PAYMENT
    }
} 