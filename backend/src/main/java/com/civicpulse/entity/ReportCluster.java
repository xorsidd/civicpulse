package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_cluster", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"report_id", "cluster_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportCluster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id", nullable = false)
    private Long reportId;

    @Column(name = "cluster_id", nullable = false)
    private Long clusterId;

    @Column(name = "similarity_score", nullable = false)
    @Builder.Default
    private Double similarityScore = 100.0;

    @Builder.Default
    @Column(name = "linked_at", nullable = false, updatable = false)
    private LocalDateTime linkedAt = LocalDateTime.now();
}
