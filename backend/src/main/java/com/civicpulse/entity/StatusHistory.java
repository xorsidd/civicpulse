package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "status_history", indexes = {
    @Index(name = "idx_status_history_cluster", columnList = "cluster_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cluster_id", nullable = false)
    private Long clusterId;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private IssueStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private IssueStatus newStatus;

    @Column(name = "changed_by_user_id")
    private Long changedByUserId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt = LocalDateTime.now();
}
