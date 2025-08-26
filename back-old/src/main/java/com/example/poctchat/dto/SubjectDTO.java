package com.openclassrooms.api.dto;

import lombok.Data;
import com.openclassrooms.api.models.Subject;

@Data
public class SubjectDTO {
    private Long id;
    private String name;
    private String description;

    public SubjectDTO() {}

    public SubjectDTO(Subject subject) {
        this.id = subject.getId();
        this.name = subject.getName();
        this.description = subject.getDescription();
    }

    public static SubjectDTO fromEntity(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setDescription(subject.getDescription());
        return dto;
    }

}
