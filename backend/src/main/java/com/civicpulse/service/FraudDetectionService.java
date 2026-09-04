package com.civicpulse.service;

import com.civicpulse.entity.FraudFlag;
import com.civicpulse.entity.Report;
import com.civicpulse.repository.FraudFlagRepository;
import com.civicpulse.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FraudDetectionService {

    private final ReportRepository reportRepository;
    private final FraudFlagRepository fraudFlagRepository;

    public void checkReportForFraud(Report report, Boolean isAiValid) {
        if (report == null || report.getUserId() == null) return;

        LocalDateTime fiveMinsAgo = LocalDateTime.now().minusMinutes(5);
        List<Report> recentUserReports = reportRepository.findRecentReportsByUser(report.getUserId(), fiveMinsAgo);

        // Signal 1: Too many reports in a short time frame (>3 in 5 mins)
        if (recentUserReports.size() >= 3) {
            flagSuspiciousActivity(report, "Rapid rate limit exceeded: " + recentUserReports.size() + " reports submitted in 5 minutes", 85.0);
        }

        // Signal 2: Non-civic invalid image flag
        if (Boolean.FALSE.equals(isAiValid)) {
            flagSuspiciousActivity(report, "Non-civic or invalid image content submitted", 60.0);
        }
    }

    private void flagSuspiciousActivity(Report report, String reason, Double riskScore) {
        log.warn("Flagging report {} by user {} as suspicious: {}", report.getId(), report.getUserId(), reason);
        FraudFlag flag = FraudFlag.builder()
                .reportId(report.getId())
                .userId(report.getUserId())
                .reason(reason)
                .riskScore(riskScore)
                .isResolved(false)
                .build();
        fraudFlagRepository.save(flag);
    }
}
