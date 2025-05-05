package com.gallerio.Repository;

import com.gallerio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}