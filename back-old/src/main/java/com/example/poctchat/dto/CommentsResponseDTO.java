package com.openclassrooms.api.dto;

public class CommentsResponseDTO {
    private String content;
    private String authorName;

    public CommentsResponseDTO(String content, String authorName) {
        this.content = content;
        this.authorName = authorName;
    }

    // Getters et setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
}