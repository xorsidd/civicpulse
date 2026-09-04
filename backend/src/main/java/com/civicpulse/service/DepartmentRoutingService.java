package com.civicpulse.service;

import com.civicpulse.entity.CategoryDepartmentMapping;
import com.civicpulse.entity.Department;
import com.civicpulse.repository.CategoryDepartmentMappingRepository;
import com.civicpulse.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DepartmentRoutingService {

    private final CategoryDepartmentMappingRepository mappingRepository;
    private final DepartmentRepository departmentRepository;

    public Long resolveDepartmentId(String categoryCode) {
        if (categoryCode == null) return null;

        Optional<CategoryDepartmentMapping> mapping = mappingRepository.findByCategoryCode(categoryCode);
        if (mapping.isPresent()) {
            return mapping.get().getDepartmentId();
        }

        // Fallback heuristics
        String codeUpper = categoryCode.toUpperCase();
        String deptCode = "ROADS";
        if (codeUpper.contains("GARBAGE") || codeUpper.contains("WASTE") || codeUpper.contains("BIN") || codeUpper.contains("DUMP")) {
            deptCode = "SANITATION";
        } else if (codeUpper.contains("STREETLIGHT") || codeUpper.contains("WIRE") || codeUpper.contains("ELECTRIC")) {
            deptCode = "ELECTRICAL";
        } else if (codeUpper.contains("WATER") || codeUpper.contains("LEAK") || codeUpper.contains("PIPE")) {
            deptCode = "WATER";
        } else if (codeUpper.contains("DRAIN") || codeUpper.contains("SEWAGE") || codeUpper.contains("GUTTER")) {
            deptCode = "DRAINAGE";
        } else if (codeUpper.contains("BENCH") || codeUpper.contains("FOOTPATH") || codeUpper.contains("INFRASTRUCTURE")) {
            deptCode = "PUBLIC_INFRA";
        }

        Optional<Department> dept = departmentRepository.findByCode(deptCode);
        return dept.map(Department::getId).orElse(null);
    }
}
