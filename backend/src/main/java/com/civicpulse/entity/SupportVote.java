package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"cluster_id", "user_id"})
}, indexes = {
    @Index(name = "idx_support_cluster", columnList = "cluster_id"),
    @Index(name = "idx_support_user", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cluster_id", nullable = false)
    private Long clusterId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Builder.Default
    @Column(name = "voted_at", nullable = false, updatable = false)
    private LocalDateTime votedAt = LocalDateTime.now();
}
