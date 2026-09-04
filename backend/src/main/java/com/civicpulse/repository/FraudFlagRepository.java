package com.civicpulse.repository;

import com.civicpulse.entity.FraudFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FraudFlagRepository extends JpaRepository<FraudFlag, Long> {
    List<FraudFlag> findByIsResolvedFalseOrderByCreatedAtDesc();
    List<FraudFlag> findByUserIdOrderByCreatedAtDesc(Long userId);
    Long countByIsResolvedFalse();
}
