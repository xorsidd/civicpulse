package com.civicpulse.dto;

import com.civicpulse.entity.SeverityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResultDto {
    private Boolean validCivicIssue;
    private String category; // POTHOLE, GARBAGE_ACCUMULATION, BROKEN_STREETLIGHT, etc.
    private Double confidence; // 0.0 to 1.0
    private SeverityLevel severity; // LOW, MEDIUM, HIGH, CRITICAL
    private Boolean visibleHazard;
    private String estimatedDamage; // SMALL, MEDIUM, LARGE, EXTREME
    private String reason;
}
