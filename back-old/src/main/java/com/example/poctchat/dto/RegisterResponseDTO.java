package com.openclassrooms.api.dto;

public class RegisterResponseDTO {
    private String token;

    public RegisterResponseDTO(String token) {
        this.token = token;
    }   

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}
