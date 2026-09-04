package com.civicpulse.controller;

import com.civicpulse.dto.AiAnalysisResultDto;
import com.civicpulse.dto.ApiResponse;
import com.civicpulse.service.AiAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Analysis", description = "AI vision pre-scan analysis endpoints")
public class AiController {

    private final AiAnalysisService aiAnalysisService;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Pre-scan image with Vision AI before final report submission")
    public ResponseEntity<ApiResponse<AiAnalysisResultDto>> analyzeImage(
            @RequestPart("image") MultipartFile image,
            @RequestParam(value = "description", required = false) String description
    ) {
        AiAnalysisResultDto result = aiAnalysisService.analyzeImage(image, description);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
