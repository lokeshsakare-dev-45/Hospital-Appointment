package com.medicare.backend.repository;

import com.medicare.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId);
    List<Appointment> findByDoctorIdAndStatusOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId, Appointment.AppointmentStatus status);
    List<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc();

    long countByStatus(Appointment.AppointmentStatus status);
    long countByDoctorId(Long doctorId);
    long countByDoctorIdAndStatus(Long doctorId, Appointment.AppointmentStatus status);

    @Query("SELECT DISTINCT a.patient FROM Appointment a WHERE a.doctor.id = :doctorId")
    List<com.medicare.backend.entity.Patient> findDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);
}
