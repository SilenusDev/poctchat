package com.openclassrooms.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private UserDTO author;
    private SubjectDTO subject;
    private Long author_Id;
    private Long subject_Id;

}

