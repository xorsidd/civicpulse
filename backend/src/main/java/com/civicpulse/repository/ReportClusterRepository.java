package com.civicpulse.repository;

import com.civicpulse.entity.ReportCluster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportClusterRepository extends JpaRepository<ReportCluster, Long> {
    List<ReportCluster> findByClusterId(Long clusterId);
    List<ReportCluster> findByReportId(Long reportId);
    Optional<ReportCluster> findByReportIdAndClusterId(Long reportId, Long clusterId);
}
