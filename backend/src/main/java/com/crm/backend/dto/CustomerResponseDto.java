package com.crm.backend.dto;

import java.time.LocalDateTime;

public class CustomerResponseDto {

    private Long id;
    private String name;
    private String company;
    private String email;
    private String phone;
    private String address;
    private String ownerName;
    private LocalDateTime createdAt;

    public CustomerResponseDto(Long id, String name, String company, String email,
                               String phone, String address, String ownerName, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.ownerName = ownerName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCompany() { return company; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getOwnerName() { return ownerName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}