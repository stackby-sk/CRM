package com.crm.backend.service;

import com.crm.backend.dto.CustomerRequestDto;
import com.crm.backend.dto.CustomerResponseDto;
import com.crm.backend.entity.Customer;
import com.crm.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final CurrentUserService currentUserService;

    public CustomerService(CustomerRepository customerRepository, CurrentUserService currentUserService) {
        this.customerRepository = customerRepository;
        this.currentUserService = currentUserService;
    }

    public List<CustomerResponseDto> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public CustomerResponseDto getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return toResponseDto(customer);
    }

    public CustomerResponseDto create(CustomerRequestDto request) {
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setCompany(request.getCompany());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        customer.setOwner(currentUserService.getCurrentUser());
        Customer saved = customerRepository.save(customer);
        return toResponseDto(saved);
    }

    public CustomerResponseDto update(Long id, CustomerRequestDto request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setName(request.getName());
        customer.setCompany(request.getCompany());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        Customer updated = customerRepository.save(customer);
        return toResponseDto(updated);
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }
        customerRepository.deleteById(id);
    }

    private CustomerResponseDto toResponseDto(Customer customer) {
        String ownerName = customer.getOwner() != null ? customer.getOwner().getName() : null;
        return new CustomerResponseDto(
                customer.getId(),
                customer.getName(),
                customer.getCompany(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                ownerName,
                customer.getCreatedAt()
        );
    }

}