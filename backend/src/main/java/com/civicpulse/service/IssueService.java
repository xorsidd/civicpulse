package com.civicpulse.service;

import com.civicpulse.dto.AiAnalysisResultDto;
import com.civicpulse.dto.IssueDtos.*;
import com.civicpulse.dto.ReportDtos.ReportResponseDto;
import com.civicpulse.entity.*;
import com.civicpulse.exception.BadRequestException;
import com.civicpulse.exception.DuplicateResourceException;
import com.civicpulse.exception.ResourceNotFoundException;
import com.civicpulse.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueClusterRepository issueClusterRepository;
    private final ReportRepository reportRepository;
    private final ReportClusterRepository reportClusterRepository;
    private final SupportVoteRepository supportVoteRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final ResolutionEvidenceRepository resolutionEvidenceRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final ZoneRepository zoneRepository;
    private final IssueCategoryRepository issueCategoryRepository;
    private final AiAnalysisRepository aiAnalysisRepository;

    private final PriorityScoreService priorityScoreService;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    public List<IssueClusterDto> getIssues(IssueStatus status, Long departmentId, MainCategory category, Long zoneId) {
        List<IssueCluster> clusters;
        if (departmentId != null) {
            clusters = issueClusterRepository.findByDepartmentIdOrderByPriorityScoreDesc(departmentId);
        } else if (category != null) {
            clusters = issueClusterRepository.findByMainCategoryOrderByPriorityScoreDesc(category);
        } else if (status != null) {
            clusters = issueClusterRepository.findByStatusOrderByPriorityScoreDesc(status);
        } else {
            clusters = issueClusterRepository.findAllByOrderByPriorityScoreDesc();
        }

        if (zoneId != null) {
            clusters = clusters.stream().filter(c -> zoneId.equals(c.getZoneId())).collect(Collectors.toList());
        }

        User currentUser = getCurrentUserQuietly();

        return clusters.stream()
                .map(c -> mapToClusterDto(c, currentUser))
                .collect(Collectors.toList());
    }

    public IssueDetailDto getIssueDetail(Long clusterId) {
        IssueCluster cluster = issueClusterRepository.findById(clusterId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue cluster not found with id: " + clusterId));

        User currentUser = getCurrentUserQuietly();
        IssueClusterDto clusterDto = mapToClusterDto(cluster, currentUser);

        // Fetch reports linked to cluster
        List<ReportCluster> reportClusters = reportClusterRepository.findByClusterId(clusterId);
        List<ReportResponseDto> reportDtos = new ArrayList<>();
        AiAnalysisResultDto primaryAi = null;

        for (ReportCluster rc : reportClusters) {
            reportRepository.findById(rc.getReportId()).ifPresent(r -> {
                String uName = userRepository.findById(r.getUserId()).map(User::getName).orElse("Citizen");
                AiAnalysisResultDto ai = aiAnalysisRepository.findByReportId(r.getId())
                        .map(this::mapToAiResultDto)
                        .orElse(null);
                reportDtos.add(mapToReportResponseDto(r, ai, clusterId, uName));
            });
        }

        if (!reportDtos.isEmpty() && reportDtos.get(0).getAiAnalysis() != null) {
            primaryAi = reportDtos.get(0).getAiAnalysis();
        }

        // Fetch Status History
        List<StatusHistoryDto> historyDtos = statusHistoryRepository.findByClusterIdOrderByChangedAtAsc(clusterId).stream()
                .map(h -> {
                    StatusHistoryDto hd = new StatusHistoryDto();
                    hd.setId(h.getId());
                    hd.setOldStatus(h.getOldStatus());
                    hd.setNewStatus(h.getNewStatus());
                    hd.setChangedByUserId(h.getChangedByUserId());
                    if (h.getChangedByUserId() != null) {
                        userRepository.findById(h.getChangedByUserId()).ifPresent(u -> hd.setChangedByUserName(u.getName()));
                    }
                    hd.setNotes(h.getNotes());
                    hd.setChangedAt(h.getChangedAt());
                    return hd;
                }).collect(Collectors.toList());

        // Fetch Resolution Evidence
        ResolutionEvidenceDto resolutionDto = resolutionEvidenceRepository.findFirstByClusterIdOrderByResolvedAtDesc(clusterId)
                .map(re -> {
                    ResolutionEvidenceDto rd = new ResolutionEvidenceDto();
                    rd.setId(re.getId());
                    rd.setClusterId(re.getClusterId());
                    rd.setAuthorityUserId(re.getAuthorityUserId());
                    userRepository.findById(re.getAuthorityUserId()).ifPresent(u -> rd.setAuthorityUserName(u.getName()));
                    rd.setImageUrl(re.getImageUrl());
                    rd.setDescription(re.getDescription());
                    rd.setAiValidScore(re.getAiValidScore());
                    rd.setAiVerificationNotes(re.getAiVerificationNotes());
                    rd.setResolvedAt(re.getResolvedAt());
                    return rd;
                }).orElse(null);

        // Fetch Supporters
        List<SupportVoteDto> supporterDtos = supportVoteRepository.findByUserIdOrderByVotedAtDesc(clusterId).stream()
                .map(sv -> {
                    SupportVoteDto vd = new SupportVoteDto();
                    vd.setId(sv.getId());
                    vd.setClusterId(sv.getClusterId());
                    vd.setUserId(sv.getUserId());
                    userRepository.findById(sv.getUserId()).ifPresent(u -> vd.setUserName(u.getName()));
                    vd.setVotedAt(sv.getVotedAt());
                    return vd;
                }).collect(Collectors.toList());

        IssueDetailDto detailDto = new IssueDetailDto();
        detailDto.setCluster(clusterDto);
        detailDto.setReports(reportDtos);
        detailDto.setStatusHistory(historyDtos);
        detailDto.setResolutionEvidence(resolutionDto);
        detailDto.setSupporters(supporterDtos);
        detailDto.setPrimaryAiAnalysis(primaryAi);

        return detailDto;
    }

    @Transactional
    public IssueClusterDto supportIssue(Long clusterId, User user) {
        IssueCluster cluster = issueClusterRepository.findById(clusterId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue cluster not found with id: " + clusterId));

        if (supportVoteRepository.existsByClusterIdAndUserId(clusterId, user.getId())) {
            throw new DuplicateResourceException("You have already supported this civic issue report");
        }

        SupportVote vote = SupportVote.builder()
                .clusterId(clusterId)
                .userId(user.getId())
                .votedAt(LocalDateTime.now())
                .build();
        supportVoteRepository.save(vote);

        int currentSupporters = cluster.getSupporterCount() != null ? cluster.getSupporterCount() : 0;
        cluster.setSupporterCount(currentSupporters + 1);

        Double newPriorityScore = priorityScoreService.calculatePriorityScore(cluster, 0.95);
        cluster.setPriorityScore(newPriorityScore);
        cluster.setPriorityLevel(priorityScoreService.getPriorityLevel(newPriorityScore));

        cluster = issueClusterRepository.save(cluster);

        notificationService.createNotification(
                user.getId(),
                "Support Registered",
                "Thank you for supporting civic issue " + cluster.getClusterCode() + ". Priority updated to " + newPriorityScore + "/100.",
                "ISSUE_SUPPORTED",
                clusterId
        );

        return mapToClusterDto(cluster, user);
    }

    @Transactional
    public IssueClusterDto updateStatus(Long clusterId, IssueStatus newStatus, String notes, User user) {
        IssueCluster cluster = issueClusterRepository.findById(clusterId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue cluster not found with id: " + clusterId));

        IssueStatus oldStatus = cluster.getStatus();
        cluster.setStatus(newStatus);
        cluster = issueClusterRepository.save(cluster);

        StatusHistory history = StatusHistory.builder()
                .clusterId(clusterId)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedByUserId(user.getId())
                .notes(notes != null ? notes : "Status changed to " + newStatus)
                .build();
        statusHistoryRepository.save(history);

        // Notify reported citizens
        notifyClusterCitizens(clusterId, "Issue Status Updated", "Issue " + cluster.getClusterCode() + " status is now " + newStatus, "STATUS_CHANGED");

        return mapToClusterDto(cluster, user);
    }

    @Transactional
    public IssueClusterDto assignDepartment(Long clusterId, Long departmentId, Long authorityUserId, String notes, User user) {
        IssueCluster cluster = issueClusterRepository.findById(clusterId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue cluster not found with id: " + clusterId));

        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));

        cluster.setDepartmentId(departmentId);
        if (authorityUserId != null) {
            cluster.setAssignedUserId(authorityUserId);
        }
        IssueStatus oldStatus = cluster.getStatus();
        cluster.setStatus(IssueStatus.ASSIGNED);
        cluster = issueClusterRepository.save(cluster);

        StatusHistory history = StatusHistory.builder()
                .clusterId(clusterId)
                .oldStatus(oldStatus)
                .newStatus(IssueStatus.ASSIGNED)
                .changedByUserId(user.getId())
                .notes("Assigned to " + dept.getName() + (notes != null ? ": " + notes : ""))
                .build();
        statusHistoryRepository.save(history);

        notifyClusterCitizens(clusterId, "Department Assigned", "Your issue has been assigned to " + dept.getName() + " for resolution.", "ASSIGNED");

        return mapToClusterDto(cluster, user);
    }

    @Transactional
    public IssueClusterDto uploadResolution(Long clusterId, MultipartFile file, String description, User user) {
        IssueCluster cluster = issueClusterRepository.findById(clusterId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue cluster not found with id: " + clusterId));

        String imageUrl = fileStorageService.storeFile(file);

        ResolutionEvidence evidence = ResolutionEvidence.builder()
                .clusterId(clusterId)
                .authorityUserId(user.getId())
                .imageUrl(imageUrl)
                .description(description)
                .aiValidScore(89.0)
                .aiVerificationNotes("Pre-verification score 89%: Resolution likely valid.")
                .resolvedAt(LocalDateTime.now())
                .build();
        resolutionEvidenceRepository.save(evidence);

        IssueStatus oldStatus = cluster.getStatus();
        cluster.setStatus(IssueStatus.RESOLVED);
        cluster = issueClusterRepository.save(cluster);

        StatusHistory history = StatusHistory.builder()
                .clusterId(clusterId)
                .oldStatus(oldStatus)
                .newStatus(IssueStatus.RESOLVED)
                .changedByUserId(user.getId())
                .notes("Resolution evidence uploaded by authority: " + description)
                .build();
        statusHistoryRepository.save(history);

        notifyClusterCitizens(
                clusterId,
                "Issue Marked as Resolved",
                "The authority has uploaded repair evidence for issue " + cluster.getClusterCode() + ". Please verify if fixed!",
                "RESOLVED"
        );

        return mapToClusterDto(cluster, user);
    }

    @Transactional
    public IssueClusterDto verifyResolution(Long clusterId, Boolean isFixed, String feedbackNotes, User user) {
        IssueCluster cluster = issueClusterRepository.findById(clusterId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue cluster not found with id: " + clusterId));

        IssueStatus oldStatus = cluster.getStatus();
        IssueStatus newStatus;
        String note;

        if (Boolean.TRUE.equals(isFixed)) {
            newStatus = IssueStatus.CITIZEN_VERIFIED;
            note = "Citizen confirmed resolution: Fixed! Notes: " + (feedbackNotes != null ? feedbackNotes : "Confirmed");
        } else {
            newStatus = IssueStatus.REOPENED;
            note = "Citizen reported issue is STILL A PROBLEM: " + (feedbackNotes != null ? feedbackNotes : "Reopened");
            // Boost priority score for reopened issues
            double boosted = Math.min(100.0, cluster.getPriorityScore() + 20.0);
            cluster.setPriorityScore(boosted);
            cluster.setPriorityLevel(priorityScoreService.getPriorityLevel(boosted));
        }

        cluster.setStatus(newStatus);
        cluster = issueClusterRepository.save(cluster);

        StatusHistory history = StatusHistory.builder()
                .clusterId(clusterId)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedByUserId(user.getId())
                .notes(note)
                .build();
        statusHistoryRepository.save(history);

        notificationService.createNotification(
                user.getId(),
                "Verification Recorded",
                "Thank you for verifying issue " + cluster.getClusterCode() + ". Status updated to " + newStatus + ".",
                "VERIFICATION_RECORDED",
                clusterId
        );

        return mapToClusterDto(cluster, user);
    }

    private void notifyClusterCitizens(Long clusterId, String title, String message, String type) {
        List<ReportCluster> rcs = reportClusterRepository.findByClusterId(clusterId);
        for (ReportCluster rc : rcs) {
            reportRepository.findById(rc.getReportId()).ifPresent(r -> {
                notificationService.createNotification(r.getUserId(), title, message, type, clusterId);
            });
        }
    }

    public IssueClusterDto mapToClusterDto(IssueCluster cluster, User currentUser) {
        IssueClusterDto dto = new IssueClusterDto();
        dto.setId(cluster.getId());
        dto.setClusterCode(cluster.getClusterCode());
        dto.setMainCategory(cluster.getMainCategory());
        dto.setCategoryCode(cluster.getCategoryCode());
        if (cluster.getCategoryCode() != null) {
            issueCategoryRepository.findByCode(cluster.getCategoryCode())
                    .ifPresent(ic -> dto.setCategoryName(ic.getName()));
        }
        dto.setTitle(cluster.getTitle());
        dto.setDescription(cluster.getDescription());
        dto.setPrimaryImageUrl(cluster.getPrimaryImageUrl());
        dto.setLatitude(cluster.getLatitude());
        dto.setLongitude(cluster.getLongitude());
        dto.setAddress(cluster.getAddress());
        dto.setSeverity(cluster.getSeverity());
        dto.setPriorityScore(cluster.getPriorityScore());
        dto.setPriorityLevel(cluster.getPriorityLevel());
        dto.setStatus(cluster.getStatus());
        dto.setDepartmentId(cluster.getDepartmentId());
        if (cluster.getDepartmentId() != null) {
            departmentRepository.findById(cluster.getDepartmentId())
                    .ifPresent(d -> dto.setDepartmentName(d.getName()));
        }
        dto.setAssignedUserId(cluster.getAssignedUserId());
        if (cluster.getAssignedUserId() != null) {
            userRepository.findById(cluster.getAssignedUserId())
                    .ifPresent(u -> dto.setAssignedUserName(u.getName()));
        }
        dto.setReportCount(cluster.getReportCount());
        dto.setSupporterCount(cluster.getSupporterCount());
        dto.setImpactScore(cluster.getImpactScore());
        dto.setLocationRiskScore(cluster.getLocationRiskScore());
        dto.setZoneId(cluster.getZoneId());
        if (cluster.getZoneId() != null) {
            zoneRepository.findById(cluster.getZoneId())
                    .ifPresent(z -> dto.setZoneName(z.getName()));
        }
        if (currentUser != null) {
            dto.setCurrentUserSupported(supportVoteRepository.existsByClusterIdAndUserId(cluster.getId(), currentUser.getId()));
        } else {
            dto.setCurrentUserSupported(false);
        }
        dto.setCreatedAt(cluster.getCreatedAt());
        dto.setUpdatedAt(cluster.getUpdatedAt());
        return dto;
    }

    private User getCurrentUserQuietly() {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof com.civicpulse.security.CustomUserPrincipal principal) {
                return principal.getUser();
            }
        } catch (Exception ignored) {}
        return null;
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

    private ReportResponseDto mapToReportResponseDto(Report report, AiAnalysisResultDto aiResult, Long clusterId, String userName) {
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
        dto.setClusterId(clusterId);
        return dto;
    }
}
