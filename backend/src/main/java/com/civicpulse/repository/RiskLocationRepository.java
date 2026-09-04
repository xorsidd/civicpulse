package com.civicpulse.repository;

import com.civicpulse.entity.RiskLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RiskLocationRepository extends JpaRepository<RiskLocation, Long> {
}
