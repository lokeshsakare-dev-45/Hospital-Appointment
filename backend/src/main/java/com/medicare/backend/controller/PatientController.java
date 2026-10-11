package com.medicare.backend.controller;

import com.medicare.backend.entity.Appointment;
import com.medicare.backend.entity.Patient;
import com.medicare.backend.repository.AppointmentRepository;
import com.medicare.backend.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientController(PatientRepository patientRepository,
                             AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/appointments")
    public List<Appointment> getPatientAppointments(@PathVariable Long id) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(id);
    }

    @GetMapping("/{id}/stats")
    public Map<String, Object> getPatientStats(@PathVariable Long id) {
        List<Appointment> all = appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(id);
        LocalDate today = LocalDate.now();

        long upcoming = all.stream()
            .filter(a -> !a.getAppointmentDate().isBefore(today) && (a.getStatus() == Appointment.AppointmentStatus.APPROVED || a.getStatus() == Appointment.AppointmentStatus.PENDING))
            .count();

        long completed = all.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.COMPLETED)
            .count();

        long cancelled = all.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.CANCELLED)
            .count();

        return Map.of(
            "totalAppointments", all.size(),
            "upcomingAppointments", upcoming,
            "completedAppointments", completed,
            "cancelledAppointments", cancelled
        );
    }
}
