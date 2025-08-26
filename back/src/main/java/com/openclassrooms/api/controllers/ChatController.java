package com.openclassrooms.api.controllers;

import com.openclassrooms.api.models.Message;
import com.openclassrooms.api.models.Conversation;
import com.openclassrooms.api.models.User;
import com.openclassrooms.api.repositories.ConversationRepository;
import com.openclassrooms.api.repositories.MessageRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import com.openclassrooms.api.dto.MessageDTO;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate,
                          ConversationRepository conversationRepository,
                          MessageRepository messageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/chat/{conversationId}")
    public void sendMessage(@DestinationVariable Long conversationId, @Payload IncomingMessage incoming) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        User sender = new User();
        sender.setId(incoming.senderId);
        Message msg = new Message();
        msg.setConversation(conversation);
        msg.setSender(sender);
        msg.setContent(incoming.content);
        msg.setSentAt(LocalDateTime.now());
        Message saved = messageRepository.save(msg);
        messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, MessageDTO.fromEntity(saved));
    }

    static class IncomingMessage {
        public Long senderId;
        public String content;
    }
}


