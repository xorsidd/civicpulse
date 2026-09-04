package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issue_categories", indexes = {
    @Index(name = "idx_category_code", columnList = "code"),
    @Index(name = "idx_main_category", columnList = "main_category")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "main_category", nullable = false)
    private MainCategory mainCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_severity", nullable = false)
    private SeverityLevel defaultSeverity;

    private String description;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
