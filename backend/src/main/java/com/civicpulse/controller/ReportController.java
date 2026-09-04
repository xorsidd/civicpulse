package com.civicpulse.controller;

import com.civicpulse.dto.ApiResponse;
import com.civicpulse.dto.ReportDtos.ReportResponseDto;
import com.civicpulse.entity.User;
import com.civicpulse.service.AuthService;
import com.civicpulse.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Citizen report submission and retrieval endpoints")
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit a new citizen report with image upload and GPS coordinates")
    public ResponseEntity<ApiResponse<ReportResponseDto>> createReport(
            @RequestPart("image") MultipartFile image,
            @RequestParam("latitude") BigDecimal latitude,
            @RequestParam("longitude") BigDecimal longitude,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "address", required = false) String address
    ) {
        User currentUser = authService.getCurrentUserEntity();
        ReportResponseDto response = reportService.createReport(image, latitude, longitude, description, address, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Report created successfully with AI analysis", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get all reports submitted by the authenticated citizen")
    public ResponseEntity<ApiResponse<List<ReportResponseDto>>> getMyReports() {
        User currentUser = authService.getCurrentUserEntity();
        List<ReportResponseDto> reports = reportService.getUserReports(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok(reports));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get report details by report ID")
    public ResponseEntity<ApiResponse<ReportResponseDto>> getReportById(@PathVariable Long id) {
        ReportResponseDto report = reportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }
}
