package com.civicpulse.service;

import com.civicpulse.dto.AiAnalysisResultDto;
import com.civicpulse.entity.MainCategory;
import com.civicpulse.entity.SeverityLevel;
import org.springframework.stereotype.Service;

@Service
public class SeverityAssessmentService {

    public SeverityLevel calculateSeverity(MainCategory mainCategory, String categoryCode, AiAnalysisResultDto aiAnalysis) {
        if (aiAnalysis != null && aiAnalysis.getSeverity() != null) {
            if (aiAnalysis.getSeverity() == SeverityLevel.CRITICAL) {
                return SeverityLevel.CRITICAL;
            }
        }

        if (mainCategory == MainCategory.ELECTRICITY) {
            return SeverityLevel.CRITICAL;
        }

        if (mainCategory == MainCategory.DRAINAGE || mainCategory == MainCategory.WATER) {
            if (aiAnalysis != null && Boolean.TRUE.equals(aiAnalysis.getVisibleHazard())) {
                return SeverityLevel.HIGH;
            }
            return SeverityLevel.HIGH;
        }

        if (mainCategory == MainCategory.ROAD) {
            if (aiAnalysis != null && "LARGE".equalsIgnoreCase(aiAnalysis.getEstimatedDamage())) {
                return SeverityLevel.HIGH;
            }
            return SeverityLevel.MEDIUM;
        }

        if (mainCategory == MainCategory.WASTE) {
            return SeverityLevel.MEDIUM;
        }

        return SeverityLevel.LOW;
    }

    public double getSeverityValue(SeverityLevel level) {
        if (level == null) return 50.0;
        return switch (level) {
            case LOW -> 25.0;
            case MEDIUM -> 50.0;
            case HIGH -> 75.0;
            case CRITICAL -> 100.0;
        };
    }
}
