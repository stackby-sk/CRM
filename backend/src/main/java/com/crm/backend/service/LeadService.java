package com.crm.backend.service;

import com.crm.backend.dto.LeadRequestDto;
import com.crm.backend.dto.LeadResponseDto;
import com.crm.backend.entity.Customer;
import com.crm.backend.entity.Lead;
import com.crm.backend.entity.User;
import com.crm.backend.repository.CustomerRepository;
import com.crm.backend.repository.LeadRepository;
import com.crm.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public LeadService(LeadRepository leadRepository, CustomerRepository customerRepository, UserRepository userRepository) {
        this.leadRepository = leadRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public List<LeadResponseDto> getAll() {
        return leadRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    public LeadResponseDto getById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return toResponseDto(lead);
    }

    public List<LeadResponseDto> getByCustomerId(Long customerId) {
        return leadRepository.findByCustomerId(customerId).stream().map(this::toResponseDto).toList();
    }

    public LeadResponseDto create(LeadRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Lead lead = new Lead();
        lead.setCustomer(customer);
        lead.setSource(request.getSource());
        lead.setValue(request.getValue());

        if (request.getStatus() != null) {
            lead.setStatus(Lead.Status.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            lead.setAssignedTo(assignedTo);
        }

        Lead saved = leadRepository.save(lead);
        return toResponseDto(saved);
    }

    public LeadResponseDto update(Long id, LeadRequestDto request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setSource(request.getSource());
        lead.setValue(request.getValue());

        if (request.getStatus() != null) {
            lead.setStatus(Lead.Status.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            lead.setAssignedTo(assignedTo);
        }

        Lead updated = leadRepository.save(lead);
        return toResponseDto(updated);
    }

    public void delete(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new RuntimeException("Lead not found");
        }
        leadRepository.deleteById(id);
    }

    private LeadResponseDto toResponseDto(Lead lead) {
        String assignedToName = lead.getAssignedTo() != null ? lead.getAssignedTo().getName() : null;
        return new LeadResponseDto(
                lead.getId(),
                lead.getCustomer().getId(),
                lead.getCustomer().getName(),
                lead.getSource(),
                lead.getStatus().name(),
                lead.getValue(),
                assignedToName,
                lead.getCreatedAt()
        );
    }
}