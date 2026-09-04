package com.civicpulse.dto;

import com.civicpulse.entity.MainCategory;
import com.civicpulse.entity.SeverityLevel;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminDtos {

    @Data
    @Builder
    public static class DepartmentCreateRequest {
        private String name;
        private String code;
        private String contactEmail;
        private String contactPhone;
        private String description;
    }

    @Data
    @Builder
    public static class CategoryCreateRequest {
        private String code;
        private String name;
        private MainCategory mainCategory;
        private SeverityLevel defaultSeverity;
        private String description;
        private Long defaultDepartmentId;
    }

    @Data
    @Builder
    public static class ZoneCreateRequest {
        private String name;
        private String code;
        private BigDecimal riskMultiplier;
        private String description;
    }

    @Data
    @Builder
    public static class FraudFlagDto {
        private Long id;
        private Long reportId;
        private Long userId;
        private String userName;
        private String userEmail;
        private String reason;
        private Double riskScore;
        private Boolean isResolved;
        private String adminActionTaken;
        private LocalDateTime createdAt;
    }
}
