package com.civicpulse.repository;

import com.civicpulse.entity.AiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    Optional<AiAnalysis> findByReportId(Long reportId);
}
