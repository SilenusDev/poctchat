package com.openclassrooms.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

import com.openclassrooms.api.models.Conversation;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long id;
    private UserDTO user1;
    private UserDTO user2;
    private LocalDateTime createdAt;
    
    public static ConversationDTO fromEntity(Conversation conversation) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conversation.getId());
        dto.setUser1(UserDTO.fromEntityWithoutEmail(conversation.getUser1()));
        dto.setUser2(UserDTO.fromEntityWithoutEmail(conversation.getUser2()));
        dto.setCreatedAt(conversation.getCreatedAt());
        return dto;
    }
}
