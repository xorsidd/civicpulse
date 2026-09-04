package com.civicpulse.repository;

import com.civicpulse.entity.IssueCategory;
import com.civicpulse.entity.MainCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueCategoryRepository extends JpaRepository<IssueCategory, Long> {
    Optional<IssueCategory> findByCode(String code);
    List<IssueCategory> findByMainCategory(MainCategory mainCategory);
}
