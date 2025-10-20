package com.gallerio.repository;

import com.gallerio.model.Order;
import com.gallerio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByArtwork_User(User artist);
    List<Order> findByCustomer(User customer);
} 