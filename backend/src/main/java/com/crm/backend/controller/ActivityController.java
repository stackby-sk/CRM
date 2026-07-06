package com.crm.backend.controller;

import com.crm.backend.dto.ActivityRequestDto;
import com.crm.backend.dto.ActivityResponseDto;
import com.crm.backend.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponseDto>> getAll() {
        return ResponseEntity.ok(activityService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ActivityResponseDto>> getByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(activityService.getByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<ActivityResponseDto> create(@Valid @RequestBody ActivityRequestDto request) {
        return ResponseEntity.ok(activityService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponseDto> update(@PathVariable Long id, @Valid @RequestBody ActivityRequestDto request) {
        return ResponseEntity.ok(activityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}