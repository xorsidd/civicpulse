package com.civicpulse.service;

import com.civicpulse.dto.AuthDtos.*;
import com.civicpulse.entity.Department;
import com.civicpulse.entity.Role;
import com.civicpulse.entity.User;
import com.civicpulse.exception.BadRequestException;
import com.civicpulse.exception.DuplicateResourceException;
import com.civicpulse.exception.ResourceNotFoundException;
import com.civicpulse.exception.UnauthorizedException;
import com.civicpulse.repository.DepartmentRepository;
import com.civicpulse.repository.UserRepository;
import com.civicpulse.security.CustomUserPrincipal;
import com.civicpulse.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email address is already registered: " + request.getEmail());
        }

        // Prevent public users from freely registering as ADMIN
        Role userRole = request.getRole();
        if (userRole == Role.ADMIN) {
            // Default to CITIZEN if self-registering as ADMIN without authorization
            userRole = Role.CITIZEN;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .departmentId(request.getDepartmentId())
                .phoneNumber(request.getPhoneNumber())
                .build();

        userRepository.save(user);

        // Auto login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, mapToUserDto(user));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return new AuthResponse(token, mapToUserDto(principal.getUser()));
    }

    public UserDto getCurrentUserDto() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }
        CustomUserPrincipal principal = (CustomUserPrincipal) auth.getPrincipal();
        User user = userRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDto(user);
    }

    public User getCurrentUserEntity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }
        CustomUserPrincipal principal = (CustomUserPrincipal) auth.getPrincipal();
        return userRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setDepartmentId(user.getDepartmentId());
        dto.setPhoneNumber(user.getPhoneNumber());

        if (user.getDepartmentId() != null) {
            departmentRepository.findById(user.getDepartmentId())
                    .ifPresent(dept -> dto.setDepartmentName(dept.getName()));
        }
        return dto;
    }
}
