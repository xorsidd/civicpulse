package com.civicpulse.dto;

import com.civicpulse.entity.IssueStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReportDtos {

    @Data
    public static class ReportCreateRequest {
        private String description;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String address;
    }

    @Data
    public static class ReportResponseDto {
        private Long id;
        private Long userId;
        private String userName;
        private String imageUrl;
        private String description;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String address;
        private IssueStatus status;
        private LocalDateTime createdAt;
        private AiAnalysisResultDto aiAnalysis;
        private DuplicateCheckResultDto duplicateCheck;
        private Long clusterId;
    }
}
