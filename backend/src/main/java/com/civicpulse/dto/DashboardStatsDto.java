package com.civicpulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Long totalReports;
    private Long totalClusters;
    private Long openIssues;
    private Long inProgressIssues;
    private Long resolvedIssues;
    private Long criticalIssues;
    private Long supportedIssues;
    private Long totalUsers;
    private Long totalCitizens;
    private Long totalAuthorities;
    private Long suspiciousFlagsCount;
    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> statusBreakdown;
}
