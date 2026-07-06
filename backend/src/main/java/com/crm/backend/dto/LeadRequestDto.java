package com.crm.backend.dto;

import jakarta.validation.constraints.NotNull;

public class LeadRequestDto {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private String source;

    private String status;

    private Double value;

    private Long assignedToId;

    // --- Getters and Setters ---

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
}