package com.civicpulse.repository;

import com.civicpulse.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT r FROM Report r WHERE r.createdAt >= :sinceTime AND r.userId = :userId")
    List<Report> findRecentReportsByUser(@Param("userId") Long userId, @Param("sinceTime") LocalDateTime sinceTime);
    
    Long countByUserId(Long userId);
}
