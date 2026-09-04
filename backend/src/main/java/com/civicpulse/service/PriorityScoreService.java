package com.civicpulse.service;

import com.civicpulse.entity.IssueCluster;
import com.civicpulse.entity.PriorityLevel;
import com.civicpulse.entity.RiskLocation;
import com.civicpulse.repository.RiskLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PriorityScoreService {

    private final RiskLocationRepository riskLocationRepository;
    private final SeverityAssessmentService severityAssessmentService;
    private final DuplicateDetectionService duplicateDetectionService;

    public Double calculateLocationRisk(BigDecimal lat, BigDecimal lng) {
        if (lat == null || lng == null) return 0.0;

        List<RiskLocation> riskLocations = riskLocationRepository.findAll();
        double maxRisk = 0.0;

        for (RiskLocation rl : riskLocations) {
            double dist = duplicateDetectionService.calculateHaversineDistance(
                    lat.doubleValue(), lng.doubleValue(),
                    rl.getLatitude().doubleValue(), rl.getLongitude().doubleValue()
            );

            if (dist <= rl.getRadiusMeters()) {
                double proximityMultiplier = 1.0 - (dist / rl.getRadiusMeters());
                double calculatedRisk = rl.getRiskWeight() * (0.5 + 0.5 * proximityMultiplier);
                if (calculatedRisk > maxRisk) {
                    maxRisk = calculatedRisk;
                }
            }
        }
        return Math.min(100.0, Math.round(maxRisk * 10.0) / 10.0);
    }

    public Double calculateCitizenImpact(int reportCount, int supporterCount) {
        // Unique citizen report count + supporters
        int totalUniqueCitizens = Math.max(1, reportCount) + Math.max(0, supporterCount);
        // Base 10 score, scaling log/linear up to 100
        double impact = 10.0 + (totalUniqueCitizens - 1) * 8.5;
        return Math.min(100.0, Math.round(impact * 10.0) / 10.0);
    }

    public Double calculatePriorityScore(IssueCluster cluster, Double evidenceConfidence) {
        double severityVal = severityAssessmentService.getSeverityValue(cluster.getSeverity());
        double impactVal = calculateCitizenImpact(
                cluster.getReportCount() != null ? cluster.getReportCount() : 1,
                cluster.getSupporterCount() != null ? cluster.getSupporterCount() : 0
        );

        double locationRiskVal = cluster.getLocationRiskScore() != null ? cluster.getLocationRiskScore() : 0.0;
        if (locationRiskVal == 0.0 && cluster.getLatitude() != null && cluster.getLongitude() != null) {
            locationRiskVal = calculateLocationRisk(cluster.getLatitude(), cluster.getLongitude());
            cluster.setLocationRiskScore(locationRiskVal);
        }

        long hoursOld = 0;
        if (cluster.getCreatedAt() != null) {
            hoursOld = Duration.between(cluster.getCreatedAt(), LocalDateTime.now()).toHours();
        }
        double durationVal = Math.min(100.0, hoursOld * 2.0); // 2 points per hour

        double confidenceVal = evidenceConfidence != null ? evidenceConfidence * 100.0 : 90.0;

        // Weighted Priority Formula:
        // Severity * 0.35 + Impact * 0.25 + Location Risk * 0.20 + Duration * 0.10 + Evidence Confidence * 0.10
        double rawPriority = (severityVal * 0.35)
                + (impactVal * 0.25)
                + (locationRiskVal * 0.20)
                + (durationVal * 0.10)
                + (confidenceVal * 0.10);

        return Math.min(100.0, Math.max(0.0, Math.round(rawPriority * 10.0) / 10.0));
    }

    public PriorityLevel getPriorityLevel(Double priorityScore) {
        if (priorityScore == null) return PriorityLevel.MEDIUM;
        if (priorityScore >= 76.0) return PriorityLevel.CRITICAL;
        if (priorityScore >= 56.0) return PriorityLevel.HIGH;
        if (priorityScore >= 31.0) return PriorityLevel.MEDIUM;
        return PriorityLevel.LOW;
    }
}
