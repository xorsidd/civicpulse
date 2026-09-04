package com.civicpulse.config;

import com.civicpulse.entity.*;
import com.civicpulse.repository.*;
import com.civicpulse.service.PriorityScoreService;
import com.civicpulse.service.SeverityAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final IssueCategoryRepository categoryRepository;
    private final CategoryDepartmentMappingRepository mappingRepository;
    private final ZoneRepository zoneRepository;
    private final RiskLocationRepository riskLocationRepository;
    private final ReportRepository reportRepository;
    private final AiAnalysisRepository aiAnalysisRepository;
    private final IssueClusterRepository clusterRepository;
    private final ReportClusterRepository reportClusterRepository;
    private final SupportVoteRepository supportVoteRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final ResolutionEvidenceRepository resolutionEvidenceRepository;
    private final NotificationRepository notificationRepository;
    private final FraudFlagRepository fraudFlagRepository;
    private final PasswordEncoder passwordEncoder;
    private final PriorityScoreService priorityScoreService;
    private final SeverityAssessmentService severityAssessmentService;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding initial CivicPulse demonstration dataset into MySQL...");

        // 1. Seed Departments
        Department roadsDept = departmentRepository.save(Department.builder().name("Roads & Infrastructure Department").code("ROADS").contactEmail("roads@civicpulse.gov").contactPhone("+91-9876543210").description("Maintenance of city roads, pavements, and traffic signage.").build());
        Department sanitationDept = departmentRepository.save(Department.builder().name("Sanitation & Solid Waste Dept").code("SANITATION").contactEmail("sanitation@civicpulse.gov").contactPhone("+91-9876543211").description("Garbage collection, waste bins, and public hygiene.").build());
        Department waterDept = departmentRepository.save(Department.builder().name("Water Supply & Works Department").code("WATER").contactEmail("water@civicpulse.gov").contactPhone("+91-9876543212").description("Drinking water pipelines, leakage, and distribution.").build());
        Department electricalDept = departmentRepository.save(Department.builder().name("Electrical Grid & Lighting Dept").code("ELECTRICAL").contactEmail("electrical@civicpulse.gov").contactPhone("+91-9876543213").description("Streetlights, transformers, and exposed high-voltage wiring.").build());
        Department drainageDept = departmentRepository.save(Department.builder().name("Drainage & Sewage Management Dept").code("DRAINAGE").contactEmail("drainage@civicpulse.gov").contactPhone("+91-9876543214").description("Storm drains, sewage treatment, and waterlogging.").build());
        Department publicInfraDept = departmentRepository.save(Department.builder().name("Public Amenities & Facilities Dept").code("PUBLIC_INFRA").contactEmail("infra@civicpulse.gov").contactPhone("+91-9876543215").description("Parks, benches, footpaths, and civic structures.").build());

        // 2. Seed Categories & Category -> Department Mappings
        seedCategory("POTHOLE", "Pothole", MainCategory.ROAD, SeverityLevel.HIGH, "Crater or asphalt breakdown on road surface.", roadsDept.getId());
        seedCategory("ROAD_DAMAGE", "Road Damage", MainCategory.ROAD, SeverityLevel.HIGH, "Severe structural crack or cave-in on road.", roadsDept.getId());
        seedCategory("BROKEN_PAVEMENT", "Broken Pavement", MainCategory.ROAD, SeverityLevel.MEDIUM, "Damaged sidewalk tiles or curb blocks.", roadsDept.getId());
        seedCategory("MISSING_SIGNAGE", "Missing Road Signage", MainCategory.ROAD, SeverityLevel.MEDIUM, "Missing or fallen traffic direction signs.", roadsDept.getId());

        seedCategory("GARBAGE_ACCUMULATION", "Garbage Accumulation", MainCategory.WASTE, SeverityLevel.MEDIUM, "Large pile of uncollected solid waste.", sanitationDept.getId());
        seedCategory("OVERFLOWING_BIN", "Overflowing Bin", MainCategory.WASTE, SeverityLevel.MEDIUM, "Garbage container overflowing onto street.", sanitationDept.getId());
        seedCategory("ILLEGAL_DUMPING", "Illegal Dumping", MainCategory.WASTE, SeverityLevel.HIGH, "Unauthorized dumping of hazardous or construction waste.", sanitationDept.getId());

        seedCategory("WATER_LEAKAGE", "Water Leakage", MainCategory.WATER, SeverityLevel.HIGH, "Main pipeline leak spraying clean water.", waterDept.getId());
        seedCategory("PIPELINE_DAMAGE", "Pipeline Damage", MainCategory.WATER, SeverityLevel.HIGH, "Bust main water supply line.", waterDept.getId());
        seedCategory("WATERLOGGING", "Waterlogging", MainCategory.WATER, SeverityLevel.HIGH, "Severe water accumulation blocking access.", waterDept.getId());

        seedCategory("BROKEN_STREETLIGHT", "Broken Streetlight", MainCategory.ELECTRICITY, SeverityLevel.MEDIUM, "Non-functioning streetlight fixture in dark area.", electricalDept.getId());
        seedCategory("EXPOSED_ELECTRICAL_WIRE", "Exposed Electrical Wire", MainCategory.ELECTRICITY, SeverityLevel.CRITICAL, "Live dangling electrical wire near pedestrian path.", electricalDept.getId());
        seedCategory("ELECTRICAL_INFRA_DAMAGE", "Electrical Infrastructure Damage", MainCategory.ELECTRICITY, SeverityLevel.CRITICAL, "Damaged transformer box or electrical pole.", electricalDept.getId());

        seedCategory("OPEN_DRAIN", "Open Drain", MainCategory.DRAINAGE, SeverityLevel.HIGH, "Missing drain cover creating deep fall hazard.", drainageDept.getId());
        seedCategory("BLOCKED_DRAIN", "Blocked Drain", MainCategory.DRAINAGE, SeverityLevel.HIGH, "Clogged drain inlet causing stagnant water.", drainageDept.getId());
        seedCategory("SEWAGE_OVERFLOW", "Sewage Overflow", MainCategory.DRAINAGE, SeverityLevel.CRITICAL, "Foul sewage spilling onto public street.", drainageDept.getId());

        seedCategory("BROKEN_BENCH", "Broken Bench", MainCategory.PUBLIC_INFRASTRUCTURE, SeverityLevel.LOW, "Damaged seating bench in public park.", publicInfraDept.getId());
        seedCategory("DAMAGED_FOOTPATH", "Damaged Footpath", MainCategory.PUBLIC_INFRASTRUCTURE, SeverityLevel.MEDIUM, "Unsafe pedestrian walkway conditions.", publicInfraDept.getId());
        seedCategory("BROKEN_PUBLIC_FACILITY", "Broken Public Facility", MainCategory.PUBLIC_INFRASTRUCTURE, SeverityLevel.MEDIUM, "Damaged public restroom or drinking fountain.", publicInfraDept.getId());

        // 3. Seed Zones
        Zone zone1 = zoneRepository.save(Zone.builder().name("Zone 1 - Central Academic").code("ZONE-1").riskMultiplier(new BigDecimal("1.2")).description("High density student and university precinct.").build());
        Zone zone2 = zoneRepository.save(Zone.builder().name("Zone 2 - East Industrial").code("ZONE-2").riskMultiplier(new BigDecimal("1.1")).description("Heavy transport and warehouse corridor.").build());
        Zone zone3 = zoneRepository.save(Zone.builder().name("Zone 3 - South Medical & Tech").code("ZONE-3").riskMultiplier(new BigDecimal("1.3")).description("Hospitals and IT technology park.").build());
        Zone zone4 = zoneRepository.save(Zone.builder().name("Zone 4 - West Commercial").code("ZONE-4").riskMultiplier(new BigDecimal("1.0")).description("Shopping centers and market areas.").build());

        // 4. Seed Risk Locations
        riskLocationRepository.save(RiskLocation.builder().name("University Gate Campus").type("UNIVERSITY").latitude(new BigDecimal("22.3225000")).longitude(new BigDecimal("73.1870000")).radiusMeters(300.0).riskWeight(30.0).build());
        riskLocationRepository.save(RiskLocation.builder().name("City General Hospital").type("HOSPITAL").latitude(new BigDecimal("22.3150000")).longitude(new BigDecimal("73.1750000")).radiusMeters(400.0).riskWeight(35.0).build());
        riskLocationRepository.save(RiskLocation.builder().name("Central High School").type("SCHOOL").latitude(new BigDecimal("22.3300000")).longitude(new BigDecimal("73.1900000")).radiusMeters(250.0).riskWeight(30.0).build());
        riskLocationRepository.save(RiskLocation.builder().name("Railway Station Square").type("RAILWAY_STATION").latitude(new BigDecimal("22.3080000")).longitude(new BigDecimal("73.1820000")).radiusMeters(500.0).riskWeight(40.0).build());
        riskLocationRepository.save(RiskLocation.builder().name("Major Highway Intersection").type("INTERSECTION").latitude(new BigDecimal("22.3000000")).longitude(new BigDecimal("73.1650000")).radiusMeters(300.0).riskWeight(35.0).build());

        // 5. Seed Users
        String encodedPass = passwordEncoder.encode("Admin@123");
        User admin = userRepository.save(User.builder().name("System Administrator").email("admin@civicpulse.gov").password(encodedPass).role(Role.ADMIN).phoneNumber("+91-9000000000").build());

        String authPass = passwordEncoder.encode("Auth@123");
        User roadsAuth = userRepository.save(User.builder().name("Officer Rajesh Kumar").email("roads.auth@civicpulse.gov").password(authPass).role(Role.AUTHORITY).departmentId(roadsDept.getId()).phoneNumber("+91-9111111111").build());
        User sanitationAuth = userRepository.save(User.builder().name("Officer Priya Sharma").email("sanitation.auth@civicpulse.gov").password(authPass).role(Role.AUTHORITY).departmentId(sanitationDept.getId()).phoneNumber("+91-9222222222").build());
        User electricalAuth = userRepository.save(User.builder().name("Officer Suresh Patel").email("electrical.auth@civicpulse.gov").password(authPass).role(Role.AUTHORITY).departmentId(electricalDept.getId()).phoneNumber("+91-9333333333").build());

        String citPass = passwordEncoder.encode("Citizen@123");
        User c1 = userRepository.save(User.builder().name("Aarav Mehta").email("citizen1@gmail.com").password(citPass).role(Role.CITIZEN).phoneNumber("+91-9888888801").build());
        User c2 = userRepository.save(User.builder().name("Ananya Verma").email("citizen2@gmail.com").password(citPass).role(Role.CITIZEN).phoneNumber("+91-9888888802").build());
        User c3 = userRepository.save(User.builder().name("Rohan Gupta").email("citizen3@gmail.com").password(citPass).role(Role.CITIZEN).phoneNumber("+91-9888888803").build());
        User c4 = userRepository.save(User.builder().name("Sneha Iyer").email("citizen4@gmail.com").password(citPass).role(Role.CITIZEN).phoneNumber("+91-9888888804").build());
        User c5 = userRepository.save(User.builder().name("Vikram Singh").email("citizen5@gmail.com").password(citPass).role(Role.CITIZEN).phoneNumber("+91-9888888805").build());

        // 6. Seed Sample Realistic Reports & Clusters
        createSampleCluster(
                "C-101",
                MainCategory.ELECTRICITY,
                "EXPOSED_ELECTRICAL_WIRE",
                "Exposed Live High-Voltage Cable Near School",
                "Dangling live power cable hanging near central school entrance. Severe electrocution hazard.",
                "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80",
                new BigDecimal("22.3302000"),
                new BigDecimal("73.1901000"),
                "Near Central High School Main Gate, Ring Road",
                SeverityLevel.CRITICAL,
                IssueStatus.ASSIGNED,
                electricalDept.getId(),
                electricalAuth.getId(),
                zone1.getId(),
                c1,
                List.of(c2, c3, c4, c5),
                98.5
        );

        createSampleCluster(
                "C-102",
                MainCategory.ROAD,
                "POTHOLE",
                "Large Deep Pothole Near University Gate",
                "Dangerous 4-foot wide pothole crater near University Gate. Two two-wheelers skidded today.",
                "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
                new BigDecimal("22.3226000"),
                new BigDecimal("73.1872000"),
                "Main University Gate, Station Road",
                SeverityLevel.HIGH,
                IssueStatus.IN_PROGRESS,
                roadsDept.getId(),
                roadsAuth.getId(),
                zone1.getId(),
                c2,
                List.of(c1, c3, c4),
                91.0
        );

        createSampleCluster(
                "C-103",
                MainCategory.DRAINAGE,
                "SEWAGE_OVERFLOW",
                "Toxic Sewage Overflow Blocking Hospital Entry",
                "Raw sewage leaking out of main manhole right in front of City General Hospital emergency ward.",
                "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80",
                new BigDecimal("22.3152000"),
                new BigDecimal("73.1751000"),
                "Hospital Road, East Wing Exit",
                SeverityLevel.CRITICAL,
                IssueStatus.REPORTED,
                drainageDept.getId(),
                null,
                zone3.getId(),
                c3,
                List.of(c1, c2, c5),
                95.2
        );

        createSampleCluster(
                "C-104",
                MainCategory.WASTE,
                "GARBAGE_ACCUMULATION",
                "Massive Uncollected Waste Pile at Market Corner",
                "Over 2 tons of garbage piled up near vegetable market for 4 days. Foul smell and stray animal menace.",
                "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
                new BigDecimal("22.3085000"),
                new BigDecimal("73.1825000"),
                "Vegetable Market Square, Railway Station Ward",
                SeverityLevel.MEDIUM,
                IssueStatus.IN_PROGRESS,
                sanitationDept.getId(),
                sanitationAuth.getId(),
                zone4.getId(),
                c4,
                List.of(c1, c5),
                78.4
        );

        createSampleCluster(
                "C-105",
                MainCategory.WATER,
                "WATER_LEAKAGE",
                "Clean Water Main Pipeline Leak Spraying Water",
                "High pressure water pipeline burst wasting thousands of liters of clean drinking water.",
                "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80",
                new BigDecimal("22.3005000"),
                new BigDecimal("73.1655000"),
                "Highway Junction 4, West Bypass",
                SeverityLevel.HIGH,
                IssueStatus.RESOLVED,
                waterDept.getId(),
                null,
                zone2.getId(),
                c5,
                List.of(c2, c3),
                64.5
        );

        createSampleCluster(
                "C-106",
                MainCategory.ELECTRICITY,
                "BROKEN_STREETLIGHT",
                "Multiple Broken Streetlights on Residential Street",
                "Entire 200m stretch of residential street pitch dark due to non-functioning LED fixtures.",
                "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
                new BigDecimal("22.3100000"),
                new BigDecimal("73.1800000"),
                "Green Park Colony, Street 3",
                SeverityLevel.MEDIUM,
                IssueStatus.CITIZEN_VERIFIED,
                electricalDept.getId(),
                electricalAuth.getId(),
                zone1.getId(),
                c1,
                List.of(c4),
                42.0
        );

        // Seed a Resolution Evidence for C-105
        resolutionEvidenceRepository.save(ResolutionEvidence.builder()
                .clusterId(5L)
                .authorityUserId(roadsAuth.getId())
                .imageUrl("https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80")
                .description("Pipeline repaired, clamp sealed, and roadway restored cleanly.")
                .aiValidScore(92.0)
                .aiVerificationNotes("Resolution evidence verified: Leak sealed, area dry.")
                .build());

        // Seed Fraud Flag sample
        fraudFlagRepository.save(FraudFlag.builder()
                .userId(c5.getId())
                .reason("Submitted 4 duplicate reports within 2 minutes")
                .riskScore(88.0)
                .isResolved(false)
                .build());

        log.info("Database seeding completed successfully!");
    }

    private void seedCategory(String code, String name, MainCategory mainCategory, SeverityLevel defaultSeverity, String desc, Long deptId) {
        IssueCategory cat = categoryRepository.save(IssueCategory.builder()
                .code(code)
                .name(name)
                .mainCategory(mainCategory)
                .defaultSeverity(defaultSeverity)
                .description(desc)
                .build());
        mappingRepository.save(CategoryDepartmentMapping.builder()
                .categoryCode(code)
                .departmentId(deptId)
                .build());
    }

    private void createSampleCluster(String code, MainCategory mainCategory, String catCode, String title, String desc, String img, BigDecimal lat, BigDecimal lng, String addr, SeverityLevel severity, IssueStatus status, Long deptId, Long assignedUserId, Long zoneId, User reporter, List<User> supporters, Double pScore) {
        Report report = reportRepository.save(Report.builder()
                .userId(reporter.getId())
                .imageUrl(img)
                .description(desc)
                .latitude(lat)
                .longitude(lng)
                .address(addr)
                .status(status)
                .build());

        aiAnalysisRepository.save(AiAnalysis.builder()
                .reportId(report.getId())
                .validCivicIssue(true)
                .detectedCategory(catCode)
                .confidence(0.96)
                .severity(severity)
                .visibleHazard(severity == SeverityLevel.CRITICAL || severity == SeverityLevel.HIGH)
                .estimatedDamage("LARGE")
                .rawJsonResponse("{\"validCivicIssue\":true}")
                .build());

        IssueCluster cluster = clusterRepository.save(IssueCluster.builder()
                .clusterCode(code)
                .mainCategory(mainCategory)
                .categoryCode(catCode)
                .title(title)
                .description(desc)
                .primaryImageUrl(img)
                .latitude(lat)
                .longitude(lng)
                .address(addr)
                .severity(severity)
                .priorityScore(pScore)
                .priorityLevel(priorityScoreService.getPriorityLevel(pScore))
                .status(status)
                .departmentId(deptId)
                .assignedUserId(assignedUserId)
                .zoneId(zoneId)
                .reportCount(1)
                .supporterCount(supporters.size())
                .impactScore(priorityScoreService.calculateCitizenImpact(1, supporters.size()))
                .locationRiskScore(priorityScoreService.calculateLocationRisk(lat, lng))
                .build());

        reportClusterRepository.save(ReportCluster.builder()
                .reportId(report.getId())
                .clusterId(cluster.getId())
                .similarityScore(100.0)
                .build());

        for (User s : supporters) {
            supportVoteRepository.save(SupportVote.builder()
                    .clusterId(cluster.getId())
                    .userId(s.getId())
                    .build());
        }

        statusHistoryRepository.save(StatusHistory.builder()
                .clusterId(cluster.getId())
                .oldStatus(IssueStatus.REPORTED)
                .newStatus(status)
                .notes("Cluster initialized in state " + status + " with Priority Score " + pScore)
                .build());

        notificationRepository.save(Notification.builder()
                .userId(reporter.getId())
                .title("Report Status: " + status)
                .message("Your report for '" + title + "' is now " + status + ".")
                .type("STATUS_CHANGED")
                .clusterId(cluster.getId())
                .isRead(false)
                .build());
    }
}
