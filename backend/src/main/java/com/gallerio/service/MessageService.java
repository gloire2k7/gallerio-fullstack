package com.gallerio.service;

import com.gallerio.model.Message;
import com.gallerio.model.User;
import java.util.List;

public interface MessageService {
    Message sendMessage(User sender, User recipient, String content, String subject);
    List<Message> getInbox(User user);
    List<Message> getConversation(User user1, User user2);
    void markAsRead(Long messageId, User user);
    Message getMessageById(Long id);
} 