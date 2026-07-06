package com.crm.backend.dto;

import java.time.LocalDateTime;

public class LeadResponseDto {

    private Long id;
    private Long customerId;
    private String customerName;
    private String source;
    private String status;
    private Double value;
    private String assignedToName;
    private LocalDateTime createdAt;

    public LeadResponseDto(Long id, Long customerId, String customerName, String source,
                           String status, Double value, String assignedToName, LocalDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.source = source;
        this.status = status;
        this.value = value;
        this.assignedToName = assignedToName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getSource() { return source; }
    public String getStatus() { return status; }
    public Double getValue() { return value; }
    public String getAssignedToName() { return assignedToName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}