package com.crm.backend.dto;

import java.time.LocalDateTime;

public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public UserResponseDto(Long id, String name, String email, String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    // --- Getters only (response objects don't need setters) ---

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}