package com.civicpulse.dto;

import com.civicpulse.entity.IssueStatus;
import com.civicpulse.entity.MainCategory;
import com.civicpulse.entity.PriorityLevel;
import com.civicpulse.entity.SeverityLevel;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class IssueDtos {

    @Data
    public static class IssueClusterDto {
        private Long id;
        private String clusterCode;
        private MainCategory mainCategory;
        private String categoryCode;
        private String categoryName;
        private String title;
        private String description;
        private String primaryImageUrl;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String address;
        private SeverityLevel severity;
        private Double priorityScore;
        private PriorityLevel priorityLevel;
        private IssueStatus status;
        private Long departmentId;
        private String departmentName;
        private Long assignedUserId;
        private String assignedUserName;
        private Integer reportCount;
        private Integer supporterCount;
        private Double impactScore;
        private Double locationRiskScore;
        private Long zoneId;
        private String zoneName;
        private Boolean currentUserSupported;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class IssueDetailDto {
        private IssueClusterDto cluster;
        private List<ReportDtos.ReportResponseDto> reports;
        private List<StatusHistoryDto> statusHistory;
        private ResolutionEvidenceDto resolutionEvidence;
        private List<SupportVoteDto> supporters;
        private AiAnalysisResultDto primaryAiAnalysis;
    }

    @Data
    public static class StatusHistoryDto {
        private Long id;
        private IssueStatus oldStatus;
        private IssueStatus newStatus;
        private Long changedByUserId;
        private String changedByUserName;
        private String notes;
        private LocalDateTime changedAt;
    }

    @Data
    public static class ResolutionEvidenceDto {
        private Long id;
        private Long clusterId;
        private Long authorityUserId;
        private String authorityUserName;
        private String imageUrl;
        private String description;
        private Double aiValidScore;
        private String aiVerificationNotes;
        private LocalDateTime resolvedAt;
    }

    @Data
    public static class SupportVoteDto {
        private Long id;
        private Long clusterId;
        private Long userId;
        private String userName;
        private LocalDateTime votedAt;
    }

    @Data
    public static class StatusUpdateRequest {
        private IssueStatus status;
        private String notes;
    }

    @Data
    public static class AssignmentRequest {
        private Long departmentId;
        private Long authorityUserId;
        private String notes;
    }

    @Data
    public static class ResolutionUploadRequest {
        private String description;
    }

    @Data
    public static class CitizenVerificationRequest {
        private Boolean isFixed; // true = YES FIXED, false = STILL A PROBLEM
        private String feedbackNotes;
    }
}
