package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_clusters", indexes = {
    @Index(name = "idx_cluster_code", columnList = "cluster_code"),
    @Index(name = "idx_cluster_status", columnList = "status"),
    @Index(name = "idx_cluster_priority", columnList = "priority_score"),
    @Index(name = "idx_cluster_department", columnList = "department_id"),
    @Index(name = "idx_cluster_lat_lng", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueCluster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cluster_code", nullable = false, unique = true)
    private String clusterCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "main_category", nullable = false)
    private MainCategory mainCategory;

    @Column(name = "category_code", nullable = false)
    private String categoryCode;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "primary_image_url", length = 512)
    private String primaryImageUrl;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SeverityLevel severity = SeverityLevel.MEDIUM;

    @Column(name = "priority_score", nullable = false)
    @Builder.Default
    private Double priorityScore = 50.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level", nullable = false)
    @Builder.Default
    private PriorityLevel priorityLevel = PriorityLevel.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private IssueStatus status = IssueStatus.REPORTED;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "assigned_user_id")
    private Long assignedUserId;

    @Column(name = "report_count", nullable = false)
    @Builder.Default
    private Integer reportCount = 1;

    @Column(name = "supporter_count", nullable = false)
    @Builder.Default
    private Integer supporterCount = 0;

    @Column(name = "impact_score", nullable = false)
    @Builder.Default
    private Double impactScore = 10.0;

    @Column(name = "location_risk_score", nullable = false)
    @Builder.Default
    private Double locationRiskScore = 0.0;

    @Column(name = "zone_id")
    private Long zoneId;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
