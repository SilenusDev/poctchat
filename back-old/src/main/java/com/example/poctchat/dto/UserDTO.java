package com.openclassrooms.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors; // Ajoute cet import

import com.openclassrooms.api.models.User;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private List<SubjectDTO> subscribedSubjects;

    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreated_at());
        
        if (user.getSubscriptions() != null) {
            dto.setSubscribedSubjects(
                user.getSubscriptions().stream()
                    .map(subscription -> SubjectDTO.fromEntity(subscription.getSubject()))
                    .collect(Collectors.toList()) // Maintenant Collectors est reconnu
            );
        }       
        return dto;
    }
}


