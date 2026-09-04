package com.civicpulse.repository;

import com.civicpulse.entity.SupportVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupportVoteRepository extends JpaRepository<SupportVote, Long> {
    Boolean existsByClusterIdAndUserId(Long clusterId, Long userId);
    Optional<SupportVote> findByClusterIdAndUserId(Long clusterId, Long userId);
    Long countByClusterId(Long clusterId);
    List<SupportVote> findByUserIdOrderByVotedAtDesc(Long userId);
}
