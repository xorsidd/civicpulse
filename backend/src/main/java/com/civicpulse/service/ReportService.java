package com.civicpulse.service;

import com.civicpulse.dto.AiAnalysisResultDto;
import com.civicpulse.dto.DuplicateCheckResultDto;
import com.civicpulse.dto.ReportDtos.*;
import com.civicpulse.entity.*;
import com.civicpulse.exception.ResourceNotFoundException;
import com.civicpulse.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final AiAnalysisRepository aiAnalysisRepository;
    private final IssueClusterRepository issueClusterRepository;
    private final ReportClusterRepository reportClusterRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    
    private final FileStorageService fileStorageService;
    private final AiAnalysisService aiAnalysisService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final SeverityAssessmentService severityAssessmentService;
    private final PriorityScoreService priorityScoreService;
    private final DepartmentRoutingService departmentRoutingService;
    private final FraudDetectionService fraudDetectionService;
    private final NotificationService notificationService;

    @Transactional
    public ReportResponseDto createReport(MultipartFile file, BigDecimal latitude, BigDecimal longitude, String description, String address, User user) {
        log.info("Creating new citizen report for user: {}", user.getEmail());

        // 1. Save uploaded image
        String imageUrl = fileStorageService.storeFile(file);

        // 2. Create Report Entity
        Report report = Report.builder()
                .userId(user.getId())
                .imageUrl(imageUrl)
                .description(description)
                .latitude(latitude)
                .longitude(longitude)
                .address(address != null ? address : "Coordinates: " + latitude + ", " + longitude)
                .status(IssueStatus.REPORTED)
                .build();
        report = reportRepository.save(report);

        // 3. AI Vision Analysis
        AiAnalysisResultDto aiResult = aiAnalysisService.analyzeImage(file, description);

        AiAnalysis aiAnalysis = AiAnalysis.builder()
                .reportId(report.getId())
                .validCivicIssue(aiResult.getValidCivicIssue())
                .detectedCategory(aiResult.getCategory())
                .confidence(aiResult.getConfidence())
                .severity(aiResult.getSeverity())
                .visibleHazard(aiResult.getVisibleHazard())
                .estimatedDamage(aiResult.getEstimatedDamage())
                .rejectionReason(aiResult.getReason())
                .rawJsonResponse("{\"validCivicIssue\":" + aiResult.getValidCivicIssue() + ",\"category\":\"" + aiResult.getCategory() + "\",\"confidence\":" + aiResult.getConfidence() + "}")
                .build();
        aiAnalysisRepository.save(aiAnalysis);

        // 4. Fraud Detection Check
        fraudDetectionService.checkReportForFraud(report, aiResult.getValidCivicIssue());

        // 5. Duplicate Detection Check
        DuplicateCheckResultDto dupCheck = duplicateDetectionService.checkForDuplicate(
                latitude, longitude, aiResult.getCategory(), description, imageUrl
        );

        // If duplicate detected or valid issue, create or link cluster
        Long clusterId = null;
        if (Boolean.TRUE.equals(dupCheck.getDuplicateDetected()) && dupCheck.getExistingClusterId() != null) {
            clusterId = dupCheck.getExistingClusterId();
            // Automatically link to existing cluster if confirmed
            linkReportToCluster(report.getId(), clusterId, dupCheck.getOverallSimilarityScore());
        } else if (Boolean.TRUE.equals(aiResult.getValidCivicIssue())) {
            // Create New Issue Cluster
            IssueCluster cluster = createNewClusterForReport(report, aiResult);
            clusterId = cluster.getId();
            dupCheck.setMatchedCluster(null);
        }

        notificationService.createNotification(
                user.getId(),
                "Report Submitted Successfully",
                "Your civic report #" + report.getId() + " has been processed by AI vision analysis.",
                "REPORT_SUBMITTED",
                clusterId
        );

        return mapToReportResponseDto(report, aiResult, dupCheck, clusterId, user.getName());
    }

    @Transactional
    public IssueCluster createNewClusterForReport(Report report, AiAnalysisResultDto aiResult) {
        String catCode = aiResult.getCategory() != null ? aiResult.getCategory() : "POTHOLE";
        MainCategory mainCat = parseMainCategory(catCode);
        SeverityLevel severity = severityAssessmentService.calculateSeverity(mainCat, catCode, aiResult);

        Long deptId = departmentRoutingService.resolveDepartmentId(catCode);
        String title = formatClusterTitle(catCode, report.getAddress());
        String code = "C-" + (1000 + issueClusterRepository.count() + 1);

        Double locationRisk = priorityScoreService.calculateLocationRisk(report.getLatitude(), report.getLongitude());

        IssueCluster cluster = IssueCluster.builder()
                .clusterCode(code)
                .mainCategory(mainCat)
                .categoryCode(catCode)
                .title(title)
                .description(report.getDescription() != null ? report.getDescription() : title)
                .primaryImageUrl(report.getImageUrl())
                .latitude(report.getLatitude())
                .longitude(report.getLongitude())
                .address(report.getAddress())
                .severity(severity)
                .priorityScore(50.0) // placeholder
                .priorityLevel(priorityScoreService.getPriorityLevel(50.0))
                .status(IssueStatus.AI_VERIFIED)
                .departmentId(deptId)
                .reportCount(1)
                .supporterCount(0)
                .impactScore(10.0)
                .locationRiskScore(locationRisk)
                .build();

        Double priorityScore = priorityScoreService.calculatePriorityScore(cluster, aiResult.getConfidence());
        cluster.setPriorityScore(priorityScore);
        cluster.setPriorityLevel(priorityScoreService.getPriorityLevel(priorityScore));

        cluster = issueClusterRepository.save(cluster);

        // Link report
        linkReportToCluster(report.getId(), cluster.getId(), 100.0);

        // Status history
        StatusHistory history = StatusHistory.builder()
                .clusterId(cluster.getId())
                .oldStatus(IssueStatus.REPORTED)
                .newStatus(IssueStatus.AI_VERIFIED)
                .notes("AI Verified with " + Math.round(aiResult.getConfidence() * 100) + "% confidence. Initial priority score: " + priorityScore)
                .build();
        statusHistoryRepository.save(history);

        return cluster;
    }

    @Transactional
    public void linkReportToCluster(Long reportId, Long clusterId, Double similarity) {
        ReportCluster rc = ReportCluster.builder()
                .reportId(reportId)
                .clusterId(clusterId)
                .similarityScore(similarity != null ? similarity : 100.0)
                .build();
        reportClusterRepository.save(rc);

        issueClusterRepository.findById(clusterId).ifPresent(cluster -> {
            int currentCount = cluster.getReportCount() != null ? cluster.getReportCount() : 1;
            cluster.setReportCount(currentCount + 1);
            Double newPriority = priorityScoreService.calculatePriorityScore(cluster, 0.95);
            cluster.setPriorityScore(newPriority);
            cluster.setPriorityLevel(priorityScoreService.getPriorityLevel(newPriority));
            issueClusterRepository.save(cluster);
        });

        reportRepository.findById(reportId).ifPresent(r -> {
            r.setStatus(IssueStatus.AI_VERIFIED);
            reportRepository.save(r);
        });
    }

    public List<ReportResponseDto> getUserReports(Long userId) {
        String userName = userRepository.findById(userId).map(User::getName).orElse("Citizen");
        return reportRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(r -> {
                    AiAnalysisResultDto ai = aiAnalysisRepository.findByReportId(r.getId())
                            .map(this::mapToAiResultDto)
                            .orElse(null);
                    Long clusterId = reportClusterRepository.findByReportId(r.getId()).stream()
                            .findFirst().map(ReportCluster::getClusterId).orElse(null);
                    return mapToReportResponseDto(r, ai, null, clusterId, userName);
                })
                .collect(Collectors.toList());
    }

    public ReportResponseDto getReportById(Long reportId) {
        Report r = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + reportId));
        String userName = userRepository.findById(r.getUserId()).map(User::getName).orElse("Citizen");
        AiAnalysisResultDto ai = aiAnalysisRepository.findByReportId(r.getId())
                .map(this::mapToAiResultDto)
                .orElse(null);
        Long clusterId = reportClusterRepository.findByReportId(r.getId()).stream()
                .findFirst().map(ReportCluster::getClusterId).orElse(null);
        return mapToReportResponseDto(r, ai, null, clusterId, userName);
    }

    private MainCategory parseMainCategory(String catCode) {
        if (catCode == null) return MainCategory.ROAD;
        String upper = catCode.toUpperCase();
        if (upper.contains("GARBAGE") || upper.contains("WASTE") || upper.contains("BIN")) return MainCategory.WASTE;
        if (upper.contains("WATER") || upper.contains("PIPE") || upper.contains("LEAK")) return MainCategory.WATER;
        if (upper.contains("ELECTRIC") || upper.contains("LIGHT") || upper.contains("WIRE")) return MainCategory.ELECTRICITY;
        if (upper.contains("DRAIN") || upper.contains("SEWAGE")) return MainCategory.DRAINAGE;
        if (upper.contains("BENCH") || upper.contains("INFRASTRUCTURE") || upper.contains("FOOTPATH")) return MainCategory.PUBLIC_INFRASTRUCTURE;
        return MainCategory.ROAD;
    }

    private String formatClusterTitle(String catCode, String address) {
        String base = catCode.replace("_", " ");
        String words = java.util.Arrays.stream(base.split(" "))
                .map(w -> w.substring(0, 1).toUpperCase() + w.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
        if (address != null && !address.isBlank()) {
            return words + " at " + address;
        }
        return words + " reported in public area";
    }

    private AiAnalysisResultDto mapToAiResultDto(AiAnalysis entity) {
        return AiAnalysisResultDto.builder()
                .validCivicIssue(entity.getValidCivicIssue())
                .category(entity.getDetectedCategory())
                .confidence(entity.getConfidence())
                .severity(entity.getSeverity())
                .visibleHazard(entity.getVisibleHazard())
                .estimatedDamage(entity.getEstimatedDamage())
                .reason(entity.getRejectionReason())
                .build();
    }

    private ReportResponseDto mapToReportResponseDto(Report report, AiAnalysisResultDto aiResult, DuplicateCheckResultDto dupCheck, Long clusterId, String userName) {
        ReportResponseDto dto = new ReportResponseDto();
        dto.setId(report.getId());
        dto.setUserId(report.getUserId());
        dto.setUserName(userName);
        dto.setImageUrl(report.getImageUrl());
        dto.setDescription(report.getDescription());
        dto.setLatitude(report.getLatitude());
        dto.setLongitude(report.getLongitude());
        dto.setAddress(report.getAddress());
        dto.setStatus(report.getStatus());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setAiAnalysis(aiResult);
        dto.setDuplicateCheck(dupCheck);
        dto.setClusterId(clusterId);
        return dto;
    }
}
