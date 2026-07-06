package com.crm.backend.controller;

import com.crm.backend.dto.LeadRequestDto;
import com.crm.backend.dto.LeadResponseDto;
import com.crm.backend.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public ResponseEntity<List<LeadResponseDto>> getAll() {
        return ResponseEntity.ok(leadService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<LeadResponseDto>> getByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(leadService.getByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<LeadResponseDto> create(@Valid @RequestBody LeadRequestDto request) {
        return ResponseEntity.ok(leadService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponseDto> update(@PathVariable Long id, @Valid @RequestBody LeadRequestDto request) {
        return ResponseEntity.ok(leadService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}