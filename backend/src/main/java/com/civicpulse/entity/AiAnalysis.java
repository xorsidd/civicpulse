package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analysis", indexes = {
    @Index(name = "idx_ai_report", columnList = "report_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false, unique = true)
    private Long reportId;

    @Column(name = "valid_civic_issue", nullable = false)
    private Boolean validCivicIssue;

    @Column(name = "detected_category")
    private String detectedCategory;

    private Double confidence;

    @Enumerated(EnumType.STRING)
    private SeverityLevel severity;

    @Column(name = "visible_hazard")
    private Boolean visibleHazard;

    @Column(name = "estimated_damage")
    private String estimatedDamage;

    private String rejectionReason;

    @Column(name = "raw_json_response", columnDefinition = "TEXT")
    private String rawJsonResponse;

    @Builder.Default
    @Column(name = "analyzed_at", nullable = false, updatable = false)
    private LocalDateTime analyzedAt = LocalDateTime.now();
}
