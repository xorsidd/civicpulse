package com.civicpulse.controller;

import com.civicpulse.dto.AdminDtos.*;
import com.civicpulse.dto.ApiResponse;
import com.civicpulse.dto.AuthDtos.UserDto;
import com.civicpulse.dto.DashboardStatsDto;
import com.civicpulse.entity.*;
import com.civicpulse.service.AdminService;
import com.civicpulse.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "System administration, departments, categories, zones, and fraud detection")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin system analytics dashboard metrics")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminDashboard() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered users (Citizens, Authorities, Admins)")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get all authority departments")
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllDepartments()));
    }

    @PostMapping("/departments")
    @Operation(summary = "Create a new authority department")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody DepartmentCreateRequest request) {
        Department dept = adminService.createDepartment(request);
        return ResponseEntity.ok(ApiResponse.ok("Department created successfully", dept));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all configurable issue categories")
    public ResponseEntity<ApiResponse<List<IssueCategory>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllCategories()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new issue category with department mapping")
    public ResponseEntity<ApiResponse<IssueCategory>> createCategory(@RequestBody CategoryCreateRequest request) {
        IssueCategory cat = adminService.createCategory(request);
        return ResponseEntity.ok(ApiResponse.ok("Category created successfully", cat));
    }

    @GetMapping("/zones")
    @Operation(summary = "Get all geographic zones and risk multipliers")
    public ResponseEntity<ApiResponse<List<Zone>>> getAllZones() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllZones()));
    }

    @PostMapping("/zones")
    @Operation(summary = "Create a new geographic zone")
    public ResponseEntity<ApiResponse<Zone>> createZone(@RequestBody ZoneCreateRequest request) {
        Zone zone = adminService.createZone(request);
        return ResponseEntity.ok(ApiResponse.ok("Zone created successfully", zone));
    }

    @GetMapping("/fraud")
    @Operation(summary = "Get all flagged suspicious or fraudulent report activities")
    public ResponseEntity<ApiResponse<List<FraudFlagDto>>> getFraudFlags() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getFraudFlags()));
    }

    @PutMapping("/fraud/{id}/resolve")
    @Operation(summary = "Review and resolve a suspicious report flag")
    public ResponseEntity<ApiResponse<Void>> resolveFraudFlag(
            @PathVariable Long id,
            @RequestParam(required = false) String action
    ) {
        User admin = authService.getCurrentUserEntity();
        adminService.resolveFraudFlag(id, action, admin);
        return ResponseEntity.ok(ApiResponse.ok("Fraud flag resolved successfully", null));
    }
}
