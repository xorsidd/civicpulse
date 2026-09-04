package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "risk_locations", indexes = {
    @Index(name = "idx_risk_lat_lng", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // SCHOOL, HOSPITAL, INTERSECTION, RAILWAY_STATION, UNIVERSITY

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "radius_meters", nullable = false)
    @Builder.Default
    private Double radiusMeters = 300.0;

    @Column(name = "risk_weight", nullable = false)
    @Builder.Default
    private Double riskWeight = 25.0; // 0 - 100 risk impact weight
}
