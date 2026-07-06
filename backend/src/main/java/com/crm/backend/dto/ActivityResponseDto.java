package com.crm.backend.dto;

import java.time.LocalDate;

public class ActivityResponseDto {

    private Long id;
    private Long customerId;
    private String customerName;
    private String type;
    private LocalDate dueDate;
    private String status;
    private String assignedToName;

    public ActivityResponseDto(Long id, Long customerId, String customerName, String type,
                               LocalDate dueDate, String status, String assignedToName) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.type = type;
        this.dueDate = dueDate;
        this.status = status;
        this.assignedToName = assignedToName;
    }

    public Long getId() { return id; }
    public Long getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getType() { return type; }
    public LocalDate getDueDate() { return dueDate; }
    public String getStatus() { return status; }
    public String getAssignedToName() { return assignedToName; }
}