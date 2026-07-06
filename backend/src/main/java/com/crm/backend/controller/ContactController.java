package com.crm.backend.controller;

import com.crm.backend.dto.ContactRequestDto;
import com.crm.backend.dto.ContactResponseDto;
import com.crm.backend.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public ResponseEntity<List<ContactResponseDto>> getAll() {
        return ResponseEntity.ok(contactService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ContactResponseDto>> getByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(contactService.getByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<ContactResponseDto> create(@Valid @RequestBody ContactRequestDto request) {
        return ResponseEntity.ok(contactService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponseDto> update(@PathVariable Long id, @Valid @RequestBody ContactRequestDto request) {
        return ResponseEntity.ok(contactService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}