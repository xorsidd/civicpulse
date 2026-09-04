package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "risk_multiplier", nullable = false)
    @Builder.Default
    private BigDecimal riskMultiplier = new BigDecimal("1.0");

    @Column(columnDefinition = "TEXT")
    private String description;
}
