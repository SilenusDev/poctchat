package com.openclassrooms.api.dto;

import java.time.LocalDateTime;

import com.openclassrooms.api.models.Message;

public class MessageDTO {
    public Long id;
    public Long senderId;
    public String content;
    public LocalDateTime sentAt;

    public static MessageDTO fromEntity(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.id = m.getId();
        dto.senderId = m.getSender() != null ? m.getSender().getId() : null;
        dto.content = m.getContent();
        dto.sentAt = m.getSentAt();
        return dto;
    }
}


