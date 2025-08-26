package com.openclassrooms.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long author_id;  // ID de l'auteur
    private Long post_id;    // ID du post
  
}