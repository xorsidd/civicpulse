package com.civicpulse.controller;

import com.civicpulse.dto.ApiResponse;
import com.civicpulse.dto.IssueDtos.*;
import com.civicpulse.entity.IssueStatus;
import com.civicpulse.entity.MainCategory;
import com.civicpulse.entity.User;
import com.civicpulse.service.AuthService;
import com.civicpulse.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Tag(name = "Issues", description = "Civic issue clusters and citizen interactions")
public class IssueController {

    private final IssueService issueService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get civic issue clusters with optional filters (sorted by priority score descending)")
    public ResponseEntity<ApiResponse<List<IssueClusterDto>>> getIssues(
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) MainCategory category,
            @RequestParam(required = false) Long zoneId
    ) {
        List<IssueClusterDto> issues = issueService.getIssues(status, departmentId, category, zoneId);
        return ResponseEntity.ok(ApiResponse.ok(issues));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full issue cluster detail with linked reports, supporters, status history, and resolution evidence")
    public ResponseEntity<ApiResponse<IssueDetailDto>> getIssueDetail(@PathVariable Long id) {
        IssueDetailDto detail = issueService.getIssueDetail(id);
        return ResponseEntity.ok(ApiResponse.ok(detail));
    }

    @PostMapping("/{id}/support")
    @Operation(summary = "Support an existing civic issue (1 support vote per citizen)")
    public ResponseEntity<ApiResponse<IssueClusterDto>> supportIssue(@PathVariable Long id) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.supportIssue(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Issue supported successfully", updated));
    }

    @PostMapping("/{id}/verify-resolution")
    @Operation(summary = "Citizen verification of resolved issue (Fixed vs Still a Problem)")
    public ResponseEntity<ApiResponse<IssueClusterDto>> verifyResolution(
            @PathVariable Long id,
            @RequestBody CitizenVerificationRequest request
    ) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.verifyResolution(id, request.getIsFixed(), request.getFeedbackNotes(), currentUser);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @PostMapping("/{id}/reopen")
    @Operation(summary = "Reopen incorrectly resolved civic issue")
    public ResponseEntity<ApiResponse<IssueClusterDto>> reopenIssue(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        User currentUser = authService.getCurrentUserEntity();
        IssueClusterDto updated = issueService.verifyResolution(id, false, reason, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Issue reopened", updated));
    }
}
