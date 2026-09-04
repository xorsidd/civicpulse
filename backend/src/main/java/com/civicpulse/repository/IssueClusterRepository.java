package com.civicpulse.repository;

import com.civicpulse.entity.IssueCluster;
import com.civicpulse.entity.IssueStatus;
import com.civicpulse.entity.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueClusterRepository extends JpaRepository<IssueCluster, Long>, JpaSpecificationExecutor<IssueCluster> {
    Optional<IssueCluster> findByClusterCode(String clusterCode);
    List<IssueCluster> findByStatusOrderByPriorityScoreDesc(IssueStatus status);
    List<IssueCluster> findAllByOrderByPriorityScoreDesc();
    List<IssueCluster> findByDepartmentIdOrderByPriorityScoreDesc(Long departmentId);
    List<IssueCluster> findByMainCategoryOrderByPriorityScoreDesc(MainCategory mainCategory);
    
    @Query("SELECT ic FROM IssueCluster ic WHERE ic.status IN :statuses ORDER BY ic.priorityScore DESC")
    List<IssueCluster> findByStatusInOrderByPriorityScoreDesc(@Param("statuses") List<IssueStatus> statuses);

    Long countByStatus(IssueStatus status);

    @Query("SELECT COUNT(ic) FROM IssueCluster ic WHERE ic.priorityScore >= 76.0 AND ic.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED', 'INVALID')")
    Long countCriticalIssues();

    @Query("SELECT COUNT(ic) FROM IssueCluster ic WHERE ic.status IN ('REPORTED', 'AI_VERIFIED', 'ASSIGNED', 'REOPENED')")
    Long countOpenIssues();

    @Query("SELECT COUNT(ic) FROM IssueCluster ic WHERE ic.status = 'IN_PROGRESS'")
    Long countInProgressIssues();

    @Query("SELECT COUNT(ic) FROM IssueCluster ic WHERE ic.status IN ('RESOLVED', 'CITIZEN_VERIFIED', 'CLOSED')")
    Long countResolvedIssues();
}
