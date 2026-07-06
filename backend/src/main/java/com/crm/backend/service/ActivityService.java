package com.crm.backend.service;

import com.crm.backend.dto.ActivityRequestDto;
import com.crm.backend.dto.ActivityResponseDto;
import com.crm.backend.entity.Activity;
import com.crm.backend.entity.Customer;
import com.crm.backend.entity.User;
import com.crm.backend.repository.ActivityRepository;
import com.crm.backend.repository.CustomerRepository;
import com.crm.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public ActivityService(ActivityRepository activityRepository,
                           CustomerRepository customerRepository,
                           UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public List<ActivityResponseDto> getAll() {
        return activityRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    public ActivityResponseDto getById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        return toResponseDto(activity);
    }

    public List<ActivityResponseDto> getByCustomerId(Long customerId) {
        return activityRepository.findByCustomerId(customerId).stream().map(this::toResponseDto).toList();
    }

    public ActivityResponseDto create(ActivityRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Activity activity = new Activity();
        activity.setCustomer(customer);
        activity.setType(Activity.Type.valueOf(request.getType().toUpperCase()));
        activity.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            activity.setStatus(Activity.Status.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            activity.setAssignedTo(assignedTo);
        }

        Activity saved = activityRepository.save(activity);
        return toResponseDto(saved);
    }

    public ActivityResponseDto update(Long id, ActivityRequestDto request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        activity.setType(Activity.Type.valueOf(request.getType().toUpperCase()));
        activity.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            activity.setStatus(Activity.Status.valueOf(request.getStatus().toUpperCase()));
        }

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            activity.setAssignedTo(assignedTo);
        }

        Activity updated = activityRepository.save(activity);
        return toResponseDto(updated);
    }

    public void delete(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new RuntimeException("Activity not found");
        }
        activityRepository.deleteById(id);
    }

    private ActivityResponseDto toResponseDto(Activity activity) {
        String assignedToName = activity.getAssignedTo() != null ? activity.getAssignedTo().getName() : null;
        return new ActivityResponseDto(
                activity.getId(),
                activity.getCustomer().getId(),
                activity.getCustomer().getName(),
                activity.getType().name(),
                activity.getDueDate(),
                activity.getStatus().name(),
                assignedToName
        );
    }
}