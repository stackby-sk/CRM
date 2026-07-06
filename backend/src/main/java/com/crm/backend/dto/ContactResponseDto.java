package com.crm.backend.dto;

public class ContactResponseDto {

    private Long id;
    private Long customerId;
    private String customerName;
    private String name;
    private String role;
    private String email;
    private String phone;

    public ContactResponseDto(Long id, Long customerId, String customerName, String name,
                              String role, String email, String phone) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.name = name;
        this.role = role;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public Long getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
}