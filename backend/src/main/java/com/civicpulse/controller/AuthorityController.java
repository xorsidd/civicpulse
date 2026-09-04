package com.civicpulse.controller;

import com.civicpulse.dto.ApiResponse;
import com.civicpulse.dto.DashboardStatsDto;
import com.civicpulse.dto.IssueDtos.*;
import com.civicpulse.entity.IssueStatus;
import com.civicpulse.entity.MainCategory;
import com.civicpulse.entity.User;
import com.civicpulse.service.AdminService;
import com.civicpulse.service.AuthService;
import com.civicpulse.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Authority Management", description = "Authority dashboard, priority queue, department assignment, and resolution evidence")
public class AuthorityController {

    private final IssueService issueService;
    private final AdminService adminService;
    private final AuthService authService;

    @GetMapping("/api/authority/dashboard")
    @PreAuthorize("hasAnyRole('AUTHORITY', 'ADMIN')")
    @Operation(summary = "Get authority dashboard statistics and priority queue")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAuthorityDashboard() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/api/authority/issues")
    @PreAuthorize("hasAnyRole('AUTHORITY', 'ADMIN')")
    @Operation(summary = "Get issues for authority queue with filters")
    public ResponseEntity<ApiResponse<List<IssueClusterDto>>> getAuthorityIssues(
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) MainCategory category,
            @RequestParam(required = false) Long zoneId
    ) {
        User currentUser = authService.getCurrentUserEntity();
        // If authority user belongs to specific department and departmentId not provided, filter by authority's dept
        Long filterDept = departmentId;
        if (filterDept == null && currentUser.getDepartmentId() != null) {
            filterDept = currentUser.getDepartmentId();
        }
        List<IssueClusterDto> issues = issueService.getIssues(status, filterDept, category, zoneId);
        return ResponseEntity.ok(ApiResponse.ok(issues));
    }

    @PutMapping("/api/authority/issues/{id}/assign")
    @PreAuthorize("hasAnyRole('AUTHORITY', 'ADMIN')")
    @Operation(summary = "Assign department or authority officer to an issue")
    public ResponseEntity<ApiResponse<IssueClusterDto>> assignDepartment(
            @PathVariable Long id,
            @RequestBody AssignmentRequest request
    ) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.assignDepartment(id, request.getDepartmentId(), request.getAuthorityUserId(), request.getNotes(), currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Department assigned successfully", updated));
    }

    @PutMapping("/api/authority/issues/{id}/status")
    @PreAuthorize("hasAnyRole('AUTHORITY', 'ADMIN')")
    @Operation(summary = "Update status of an issue (e.g. IN_PROGRESS, REJECTED)")
    public ResponseEntity<ApiResponse<IssueClusterDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request
    ) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.updateStatus(id, request.getStatus(), request.getNotes(), currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", updated));
    }

    @PostMapping("/api/authority/issues/{id}/notes")
    @PreAuthorize("hasAnyRole('AUTHORITY', 'ADMIN')")
    @Operation(summary = "Add internal authority note to an issue")
    public ResponseEntity<ApiResponse<IssueClusterDto>> addInternalNote(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request
    ) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.updateStatus(id, request.getStatus() != null ? request.getStatus() : IssueStatus.IN_PROGRESS, "Internal Note: " + request.getNotes(), currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Internal note recorded", updated));
    }

    @PostMapping(value = "/api/issues/{id}/resolution", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('AUTHORITY', 'ADMIN')")
    @Operation(summary = "Upload resolution evidence image to mark issue as RESOLVED")
    public ResponseEntity<ApiResponse<IssueClusterDto>> uploadResolution(
            @PathVariable Long id,
            @RequestPart("image") MultipartFile image,
            @RequestParam(value = "description", required = false) String description
    ) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.uploadResolution(id, image, description, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Resolution evidence uploaded; status updated to RESOLVED", updated));
    }
}
