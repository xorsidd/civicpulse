package com.civicpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateCheckResultDto {
    private Boolean duplicateDetected;
    private Double overallSimilarityScore;
    private Double geographicSimilarity;
    private Double categorySimilarity;
    private Double imageSimilarity;
    private Double textSimilarity;
    private Double distanceMeters;
    private Long existingClusterId;
    private String existingClusterCode;
    private String existingClusterTitle;
    private IssueDtos.IssueClusterDto matchedCluster;
}
