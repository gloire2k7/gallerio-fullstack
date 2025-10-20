package com.gallerio.service;

import com.gallerio.repository.OrderRepository;
import com.gallerio.repository.ArtworkRepository;
import com.gallerio.repository.UserRepository;
import com.gallerio.model.Order;
import com.gallerio.model.Artwork;
import com.gallerio.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(Long artworkId, String customerEmail, String phoneNumber, String paymentMethod) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));
        
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = Order.builder()
                .artwork(artwork)
                .customer(customer)
                .phoneNumber(phoneNumber)
                .paymentMethod(paymentMethod)
                .paymentStatus(Order.PaymentStatus.PENDING_PAYMENT)
                .build();

        return orderRepository.save(order);
    }

    public List<Order> getArtistOrders(String artistEmail) {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        return orderRepository.findByArtwork_User(artist);
    }

    public List<Order> getCustomerOrders(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return orderRepository.findByCustomer(customer);
    }
} 