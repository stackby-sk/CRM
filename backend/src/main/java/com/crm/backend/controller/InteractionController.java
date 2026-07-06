package com.crm.backend.controller;

import com.crm.backend.dto.InteractionRequestDto;
import com.crm.backend.dto.InteractionResponseDto;
import com.crm.backend.service.InteractionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {

    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    @GetMapping
    public ResponseEntity<List<InteractionResponseDto>> getAll() {
        return ResponseEntity.ok(interactionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InteractionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(interactionService.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<InteractionResponseDto>> getByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(interactionService.getByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<InteractionResponseDto> create(@Valid @RequestBody InteractionRequestDto request) {
        return ResponseEntity.ok(interactionService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        interactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}