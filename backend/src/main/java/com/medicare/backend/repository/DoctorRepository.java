package com.medicare.backend.repository;

import com.medicare.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    List<Doctor> findByStatus(Doctor.DoctorStatus status);
    List<Doctor> findByStatusAndDepartmentId(Doctor.DoctorStatus status, Long departmentId);
    List<Doctor> findByStatusAndNameContainingIgnoreCase(Doctor.DoctorStatus status, String name);
    long countByStatus(Doctor.DoctorStatus status);
}
