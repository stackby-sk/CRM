package com.crm.backend.service;

import com.crm.backend.dto.InteractionRequestDto;
import com.crm.backend.dto.InteractionResponseDto;
import com.crm.backend.entity.Customer;
import com.crm.backend.entity.Interaction;
import com.crm.backend.entity.User;
import com.crm.backend.repository.CustomerRepository;
import com.crm.backend.repository.InteractionRepository;
import com.crm.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public InteractionService(InteractionRepository interactionRepository,
                              CustomerRepository customerRepository,
                              UserRepository userRepository) {
        this.interactionRepository = interactionRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public List<InteractionResponseDto> getAll() {
        return interactionRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    public InteractionResponseDto getById(Long id) {
        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interaction not found"));
        return toResponseDto(interaction);
    }

    public List<InteractionResponseDto> getByCustomerId(Long customerId) {
        return interactionRepository.findByCustomerId(customerId).stream().map(this::toResponseDto).toList();
    }

    public InteractionResponseDto create(InteractionRequestDto request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Interaction interaction = new Interaction();
        interaction.setCustomer(customer);
        interaction.setType(Interaction.Type.valueOf(request.getType().toUpperCase()));
        interaction.setNotes(request.getNotes());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            interaction.setUser(user);
        }

        Interaction saved = interactionRepository.save(interaction);
        return toResponseDto(saved);
    }

    public void delete(Long id) {
        if (!interactionRepository.existsById(id)) {
            throw new RuntimeException("Interaction not found");
        }
        interactionRepository.deleteById(id);
    }

    private InteractionResponseDto toResponseDto(Interaction interaction) {
        String userName = interaction.getUser() != null ? interaction.getUser().getName() : null;
        return new InteractionResponseDto(
                interaction.getId(),
                interaction.getCustomer().getId(),
                interaction.getCustomer().getName(),
                userName,
                interaction.getType().name(),
                interaction.getNotes(),
                interaction.getTimestamp()
        );
    }
}