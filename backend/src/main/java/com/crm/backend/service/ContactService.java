package com.crm.backend.service;

import com.crm.backend.dto.ContactRequestDto;
import com.crm.backend.dto.ContactResponseDto;
import com.crm.backend.entity.Contact;
import com.crm.backend.entity.Customer;
import com.crm.backend.repository.ContactRepository;
import com.crm.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;

    public ContactService(ContactRepository contactRepository, CustomerRepository customerRepository) {
        this.contactRepository = contactRepository;
        this.customerRepository = customerRepository;
    }

    public List<ContactResponseDto> getAll() {
        return contactRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    public ContactResponseDto getById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        return toResponseDto(contact);
    }

    public List<ContactResponseDto> getByCustomerId(Long customerId) {
        return contactRepository.findByCustomerId(customerId).stream().map(this::toResponseDto).toList();
    }

    public ContactResponseDto create(ContactRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Contact contact = new Contact();
        contact.setCustomer(customer);
        contact.setName(request.getName());
        contact.setRole(request.getRole());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());

        Contact saved = contactRepository.save(contact);
        return toResponseDto(saved);
    }

    public ContactResponseDto update(Long id, ContactRequestDto request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        contact.setName(request.getName());
        contact.setRole(request.getRole());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());

        Contact updated = contactRepository.save(contact);
        return toResponseDto(updated);
    }

    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found");
        }
        contactRepository.deleteById(id);
    }

    private ContactResponseDto toResponseDto(Contact contact) {
        return new ContactResponseDto(
                contact.getId(),
                contact.getCustomer().getId(),
                contact.getCustomer().getName(),
                contact.getName(),
                contact.getRole(),
                contact.getEmail(),
                contact.getPhone()
        );
    }
}