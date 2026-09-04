package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resolution_evidence", indexes = {
    @Index(name = "idx_resolution_cluster", columnList = "cluster_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResolutionEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cluster_id", nullable = false)
    private Long clusterId;

    @Column(name = "authority_user_id", nullable = false)
    private Long authorityUserId;

    @Column(name = "image_url", nullable = false, length = 512)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "ai_valid_score")
    private Double aiValidScore;

    @Column(name = "ai_verification_notes")
    private String aiVerificationNotes;

    @Builder.Default
    @Column(name = "resolved_at", nullable = false, updatable = false)
    private LocalDateTime resolvedAt = LocalDateTime.now();
}
