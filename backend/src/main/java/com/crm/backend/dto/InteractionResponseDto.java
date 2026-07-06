package com.crm.backend.dto;

import java.time.LocalDateTime;

public class InteractionResponseDto {

    private Long id;
    private Long customerId;
    private String customerName;
    private String userName;
    private String type;
    private String notes;
    private LocalDateTime timestamp;

    public InteractionResponseDto(Long id, Long customerId, String customerName, String userName,
                                  String type, String notes, LocalDateTime timestamp) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.userName = userName;
        this.type = type;
        this.notes = notes;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public Long getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getUserName() { return userName; }
    public String getType() { return type; }
    public String getNotes() { return notes; }
    public LocalDateTime getTimestamp() { return timestamp; }
}