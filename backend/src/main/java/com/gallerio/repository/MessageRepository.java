package com.gallerio.repository;

import com.gallerio.model.Message;
import com.gallerio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrderByCreatedAtDesc(User recipient);
    List<Message> findBySenderOrderByCreatedAtDesc(User sender);
    List<Message> findBySenderAndRecipientOrRecipientAndSenderOrderByCreatedAtAsc(
        User sender, User recipient, User recipient2, User sender2
    );
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.recipient = :user2) OR (m.sender = :user2 AND m.recipient = :user1) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("user1") User user1, @Param("user2") User user2);
} 