package com.civicpulse.service;

import com.civicpulse.dto.AdminDtos.*;
import com.civicpulse.dto.AuthDtos.UserDto;
import com.civicpulse.dto.DashboardStatsDto;
import com.civicpulse.entity.*;
import com.civicpulse.exception.DuplicateResourceException;
import com.civicpulse.exception.ResourceNotFoundException;
import com.civicpulse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final IssueCategoryRepository issueCategoryRepository;
    private final CategoryDepartmentMappingRepository mappingRepository;
    private final ZoneRepository zoneRepository;
    private final ReportRepository reportRepository;
    private final IssueClusterRepository issueClusterRepository;
    private final SupportVoteRepository supportVoteRepository;
    private final FraudFlagRepository fraudFlagRepository;
    private final AuthService authService;

    public DashboardStatsDto getDashboardStats() {
        Long totalReports = reportRepository.count();
        Long totalClusters = issueClusterRepository.count();
        Long openIssues = issueClusterRepository.countOpenIssues();
        Long inProgressIssues = issueClusterRepository.countInProgressIssues();
        Long resolvedIssues = issueClusterRepository.countResolvedIssues();
        Long criticalIssues = issueClusterRepository.countCriticalIssues();

        Long totalUsers = userRepository.count();
        Long totalCitizens = (long) userRepository.findByRole(Role.CITIZEN).size();
        Long totalAuthorities = (long) userRepository.findByRole(Role.AUTHORITY).size();
        Long suspiciousCount = fraudFlagRepository.countByIsResolvedFalse();

        Map<String, Long> catBreakdown = new HashMap<>();
        for (MainCategory mc : MainCategory.values()) {
            List<IssueCluster> clusters = issueClusterRepository.findByMainCategoryOrderByPriorityScoreDesc(mc);
            catBreakdown.put(mc.name(), (long) clusters.size());
        }

        Map<String, Long> statusBreakdown = new HashMap<>();
        for (IssueStatus st : IssueStatus.values()) {
            statusBreakdown.put(st.name(), issueClusterRepository.countByStatus(st));
        }

        return DashboardStatsDto.builder()
                .totalReports(totalReports)
                .totalClusters(totalClusters)
                .openIssues(openIssues)
                .inProgressIssues(inProgressIssues)
                .resolvedIssues(resolvedIssues)
                .criticalIssues(criticalIssues)
                .totalUsers(totalUsers)
                .totalCitizens(totalCitizens)
                .totalAuthorities(totalAuthorities)
                .suspiciousFlagsCount(suspiciousCount)
                .categoryBreakdown(catBreakdown)
                .statusBreakdown(statusBreakdown)
                .build();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(authService::mapToUserDto)
                .collect(Collectors.toList());
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Transactional
    public Department createDepartment(DepartmentCreateRequest req) {
        if (departmentRepository.findByCode(req.getCode()).isPresent()) {
            throw new DuplicateResourceException("Department with code " + req.getCode() + " already exists");
        }
        Department dept = Department.builder()
                .name(req.getName())
                .code(req.getCode().toUpperCase())
                .contactEmail(req.getContactEmail())
                .contactPhone(req.getContactPhone())
                .description(req.getDescription())
                .build();
        return departmentRepository.save(dept);
    }

    public List<IssueCategory> getAllCategories() {
        return issueCategoryRepository.findAll();
    }

    @Transactional
    public IssueCategory createCategory(CategoryCreateRequest req) {
        if (issueCategoryRepository.findByCode(req.getCode()).isPresent()) {
            throw new DuplicateResourceException("Category with code " + req.getCode() + " already exists");
        }
        IssueCategory cat = IssueCategory.builder()
                .code(req.getCode().toUpperCase())
                .name(req.getName())
                .mainCategory(req.getMainCategory())
                .defaultSeverity(req.getDefaultSeverity() != null ? req.getDefaultSeverity() : SeverityLevel.MEDIUM)
                .description(req.getDescription())
                .build();
        cat = issueCategoryRepository.save(cat);

        if (req.getDefaultDepartmentId() != null) {
            CategoryDepartmentMapping mapping = CategoryDepartmentMapping.builder()
                    .categoryCode(cat.getCode())
                    .departmentId(req.getDefaultDepartmentId())
                    .build();
            mappingRepository.save(mapping);
        }
        return cat;
    }

    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    @Transactional
    public Zone createZone(ZoneCreateRequest req) {
        Zone zone = Zone.builder()
                .name(req.getName())
                .code(req.getCode().toUpperCase())
                .riskMultiplier(req.getRiskMultiplier() != null ? req.getRiskMultiplier() : java.math.BigDecimal.ONE)
                .description(req.getDescription())
                .build();
        return zoneRepository.save(zone);
    }

    public List<FraudFlagDto> getFraudFlags() {
        return fraudFlagRepository.findAll().stream().map(flag -> {
            String uName = userRepository.findById(flag.getUserId()).map(User::getName).orElse("Unknown");
            String uEmail = userRepository.findById(flag.getUserId()).map(User::getEmail).orElse("Unknown");
            return FraudFlagDto.builder()
                    .id(flag.getId())
                    .reportId(flag.getReportId())
                    .userId(flag.getUserId())
                    .userName(uName)
                    .userEmail(uEmail)
                    .reason(flag.getReason())
                    .riskScore(flag.getRiskScore())
                    .isResolved(flag.getIsResolved())
                    .adminActionTaken(flag.getAdminActionTaken())
                    .createdAt(flag.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void resolveFraudFlag(Long flagId, String action, User adminUser) {
        FraudFlag flag = fraudFlagRepository.findById(flagId)
                .orElseThrow(() -> new ResourceNotFoundException("Fraud flag not found with id: " + flagId));

        flag.setIsResolved(true);
        flag.setReviewedByAdminId(adminUser.getId());
        flag.setAdminActionTaken(action != null ? action : "Reviewed & Dismissed by Admin");
        fraudFlagRepository.save(flag);
    }
}
