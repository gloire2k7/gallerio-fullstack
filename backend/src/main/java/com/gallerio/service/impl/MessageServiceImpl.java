package com.gallerio.service.impl;

import com.gallerio.repository.MessageRepository;
import com.gallerio.repository.UserRepository;
import com.gallerio.model.Message;
import com.gallerio.model.User;
import com.gallerio.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Message sendMessage(User sender, User recipient, String content, String subject) {
        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .subject(subject)
                .read(false)
                .build();
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getInbox(User user) {
        return messageRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    @Override
    public List<Message> getConversation(User user1, User user2) {
        return messageRepository.findConversation(user1, user2);
    }

    @Override
    public void markAsRead(Long messageId, User user) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (message.getRecipient().getId().equals(user.getId())) {
            message.setRead(true);
            messageRepository.save(message);
        }
    }

    @Override
    public Message getMessageById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }
} 