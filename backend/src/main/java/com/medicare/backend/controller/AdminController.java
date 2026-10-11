package com.medicare.backend.controller;

import com.medicare.backend.entity.Appointment;
import com.medicare.backend.entity.Doctor;
import com.medicare.backend.entity.Patient;
import com.medicare.backend.repository.AppointmentRepository;
import com.medicare.backend.repository.DoctorRepository;
import com.medicare.backend.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminController(DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        long totalDoctors = doctorRepository.count();
        long activeDoctors = doctorRepository.countByStatus(Doctor.DoctorStatus.APPROVED);
        long pendingDoctors = doctorRepository.countByStatus(Doctor.DoctorStatus.PENDING);
        long totalPatients = patientRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pendingAppointments = appointmentRepository.countByStatus(Appointment.AppointmentStatus.PENDING);
        long approvedAppointments = appointmentRepository.countByStatus(Appointment.AppointmentStatus.APPROVED);

        return Map.of(
            "totalDoctors", totalDoctors,
            "activeDoctors", activeDoctors,
            "pendingDoctors", pendingDoctors,
            "totalPatients", totalPatients,
            "totalAppointments", totalAppointments,
            "pendingAppointments", pendingAppointments,
            "approvedAppointments", approvedAppointments
        );
    }

    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @PutMapping("/doctors/{id}/status")
    public ResponseEntity<?> updateDoctorStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }

        String statusStr = body.get("status");
        if (statusStr != null) {
            try {
                Doctor.DoctorStatus status = Doctor.DoctorStatus.valueOf(statusStr.toUpperCase(Locale.ROOT));
                doctor.setStatus(status);
                Doctor saved = doctorRepository.save(doctor);
                return ResponseEntity.ok(saved);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid doctor status: " + statusStr));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
    }

    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc();
    }
}
