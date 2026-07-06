package com.crm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InteractionRequestDto {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private Long userId;

    @NotBlank(message = "Type is required")
    private String type;

    private String notes;

    // --- Getters and Setters ---

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}