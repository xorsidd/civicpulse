package com.civicpulse.repository;

import com.civicpulse.entity.ResolutionEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResolutionEvidenceRepository extends JpaRepository<ResolutionEvidence, Long> {
    Optional<ResolutionEvidence> findFirstByClusterIdOrderByResolvedAtDesc(Long clusterId);
    List<ResolutionEvidence> findByClusterIdOrderByResolvedAtDesc(Long clusterId);
}
