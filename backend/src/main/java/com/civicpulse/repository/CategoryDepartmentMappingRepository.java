package com.civicpulse.repository;

import com.civicpulse.entity.CategoryDepartmentMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryDepartmentMappingRepository extends JpaRepository<CategoryDepartmentMapping, Long> {
    Optional<CategoryDepartmentMapping> findByCategoryCode(String categoryCode);
}
