package com.civicpulse.dto;

import com.civicpulse.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        @NotNull(message = "Role is required")
        private Role role;

        private Long departmentId;
        private String phoneNumber;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private UserDto user;

        public AuthResponse(String token, UserDto user) {
            this.token = token;
            this.user = user;
        }
    }

    @Data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private Role role;
        private Long departmentId;
        private String departmentName;
        private String phoneNumber;
    }
}
