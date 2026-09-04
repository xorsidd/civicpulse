package com.civicpulse.service;

import com.civicpulse.dto.DuplicateCheckResultDto;
import com.civicpulse.entity.IssueCluster;
import com.civicpulse.repository.IssueClusterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DuplicateDetectionService {

    private final IssueClusterRepository issueClusterRepository;

    @Value("${civicpulse.duplicate.radius-meters:50.0}")
    private double duplicateRadiusMeters;

    @Value("${civicpulse.duplicate.threshold:80.0}")
    private double duplicateThreshold;

    public DuplicateCheckResultDto checkForDuplicate(BigDecimal lat, BigDecimal lng, String categoryCode, String description, String imageUrl) {
        if (lat == null || lng == null) {
            return DuplicateCheckResultDto.builder()
                    .duplicateDetected(false)
                    .overallSimilarityScore(0.0)
                    .build();
        }

        List<IssueCluster> clusters = issueClusterRepository.findAll();
        IssueCluster bestMatchCluster = null;
        double maxScore = 0.0;
        double bestGeoScore = 0.0;
        double bestCatScore = 0.0;
        double bestImgScore = 0.0;
        double bestTextScore = 0.0;
        double minDistance = Double.MAX_VALUE;

        for (IssueCluster cluster : clusters) {
            // Ignore resolved/closed/rejected clusters
            if ("RESOLVED".equals(cluster.getStatus().name()) ||
                "CITIZEN_VERIFIED".equals(cluster.getStatus().name()) ||
                "CLOSED".equals(cluster.getStatus().name()) ||
                "REJECTED".equals(cluster.getStatus().name())) {
                continue;
            }

            double distance = calculateHaversineDistance(
                    lat.doubleValue(), lng.doubleValue(),
                    cluster.getLatitude().doubleValue(), cluster.getLongitude().doubleValue()
            );

            // Signal 1: Geographic similarity (0 - 100)
            double geoScore = 0.0;
            if (distance <= duplicateRadiusMeters) {
                geoScore = 100.0 - ((distance / duplicateRadiusMeters) * 20.0); // 80 - 100
            } else if (distance <= duplicateRadiusMeters * 3) {
                geoScore = Math.max(0, 80.0 - (((distance - duplicateRadiusMeters) / (duplicateRadiusMeters * 2)) * 80.0));
            }

            // Signal 2: Category similarity (0 - 100)
            double catScore = 0.0;
            if (categoryCode != null && categoryCode.equalsIgnoreCase(cluster.getCategoryCode())) {
                catScore = 100.0;
            } else if (categoryCode != null && cluster.getMainCategory() != null && categoryCode.contains(cluster.getMainCategory().name())) {
                catScore = 75.0;
            }

            // Signal 3: Text similarity (0 - 100)
            double textScore = calculateTextSimilarity(description, cluster.getDescription());

            // Signal 4: Image similarity (0 - 100)
            double imgScore = calculateImageSimilarity(imageUrl, cluster.getPrimaryImageUrl(), categoryCode, cluster.getCategoryCode());

            // Weighted composite duplicate score: Geo 30%, Cat 20%, Img 30%, Text 20%
            double compositeScore = (geoScore * 0.30) + (catScore * 0.20) + (imgScore * 0.30) + (textScore * 0.20);

            if (compositeScore > maxScore && distance <= duplicateRadiusMeters * 2) {
                maxScore = compositeScore;
                bestMatchCluster = cluster;
                bestGeoScore = geoScore;
                bestCatScore = catScore;
                bestImgScore = imgScore;
                bestTextScore = textScore;
                minDistance = distance;
            }
        }

        boolean isDuplicate = maxScore >= duplicateThreshold && bestMatchCluster != null;

        return DuplicateCheckResultDto.builder()
                .duplicateDetected(isDuplicate)
                .overallSimilarityScore(Math.round(maxScore * 10.0) / 10.0)
                .geographicSimilarity(Math.round(bestGeoScore * 10.0) / 10.0)
                .categorySimilarity(Math.round(bestCatScore * 10.0) / 10.0)
                .imageSimilarity(Math.round(bestImgScore * 10.0) / 10.0)
                .textSimilarity(Math.round(bestTextScore * 10.0) / 10.0)
                .distanceMeters(minDistance != Double.MAX_VALUE ? Math.round(minDistance * 10.0) / 10.0 : 0.0)
                .existingClusterId(bestMatchCluster != null ? bestMatchCluster.getId() : null)
                .existingClusterCode(bestMatchCluster != null ? bestMatchCluster.getClusterCode() : null)
                .existingClusterTitle(bestMatchCluster != null ? bestMatchCluster.getTitle() : null)
                .build();
    }

    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of Earth in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double calculateTextSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null || s1.isBlank() || s2.isBlank()) return 50.0;
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();

        if (s1.equals(s2)) return 100.0;

        String[] words1 = s1.split("\\s+");
        String[] words2 = s2.split("\\s+");
        int matches = 0;
        for (String w1 : words1) {
            if (w1.length() > 3) {
                for (String w2 : words2) {
                    if (w2.contains(w1) || w1.contains(w2)) {
                        matches++;
                        break;
                    }
                }
            }
        }
        double ratio = (2.0 * matches) / (words1.length + words2.length);
        return Math.min(100.0, Math.round(ratio * 100.0));
    }

    private double calculateImageSimilarity(String img1, String img2, String cat1, String cat2) {
        if (img1 == null || img2 == null) return 50.0;
        if (img1.equalsIgnoreCase(img2)) return 100.0;
        if (cat1 != null && cat1.equalsIgnoreCase(cat2)) return 85.0;
        return 70.0;
    }
}
