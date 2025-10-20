package com.gallerio.controller;

import com.gallerio.repository.UserRepository;
import com.gallerio.model.Message;
import com.gallerio.model.User;
import com.gallerio.service.MessageService;
import com.gallerio.dto.MessageDTO;
import com.gallerio.dto.UserSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    private final MessageService messageService;
    private final UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> payload
    ) {
        User sender = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(Long.parseLong(payload.get("recipientId")))
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        String content = payload.get("content");
        String subject = payload.getOrDefault("subject", "");
        Message message = messageService.sendMessage(sender, recipient, content, subject);
        return ResponseEntity.ok(message);
    }

    @GetMapping
    public ResponseEntity<List<MessageDTO>> getInbox(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Message> messages = messageService.getInbox(user);
        List<MessageDTO> dtos = messages.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private MessageDTO toDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .subject(message.getSubject())
                .createdAt(message.getCreatedAt() != null ? message.getCreatedAt().toString() : null)
                .read(message.isRead())
                .sender(UserSummaryDTO.builder()
                        .id(message.getSender().getId())
                        .firstName(message.getSender().getFirstName())
                        .lastName(message.getSender().getLastName())
                        .profilePhoto(message.getSender().getProfilePhoto())
                        .build())
                .recipient(UserSummaryDTO.builder()
                        .id(message.getRecipient().getId())
                        .firstName(message.getRecipient().getFirstName())
                        .lastName(message.getRecipient().getLastName())
                        .profilePhoto(message.getRecipient().getProfilePhoto())
                        .build())
                .build();
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long userId
    ) {
        User user1 = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        List<Message> messages = messageService.getConversation(user1, user2);
        List<MessageDTO> dtos = messages.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        messageService.markAsRead(id, user);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<MessageDTO> replyToMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        User sender = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        Message original = messageService.getMessageById(id);
        User recipient = original.getSender();
        String content = payload.get("content");
        String subject = "Re: " + (original.getSubject() != null ? original.getSubject() : "");
        Message reply = messageService.sendMessage(sender, recipient, content, subject);
        MessageDTO dto = toDTO(reply);
        return ResponseEntity.ok(dto);
    }
} 