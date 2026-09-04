package com.civicpulse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category_department_mapping", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"category_code", "department_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDepartmentMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_code", nullable = false)
    private String categoryCode;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;
}
