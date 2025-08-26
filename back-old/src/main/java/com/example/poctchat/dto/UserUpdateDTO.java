package com.openclassrooms.api.dto;

import jakarta.validation.constraints.NotNull;

public class UserUpdateDTO {
    @NotNull(message = "L'ID ne peut pas être null")
    private Long id;
    private String name;
    private String email;
    private String password;
    
    // Constructeurs, getters et setters
    public UserUpdateDTO() {
    }

    public UserUpdateDTO(Long id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
