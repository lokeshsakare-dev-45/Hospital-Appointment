package com.medicare.backend.controller;

import com.medicare.backend.dto.AppointmentCreateRequest;
import com.medicare.backend.entity.Appointment;
import com.medicare.backend.entity.Doctor;
import com.medicare.backend.entity.Patient;
import com.medicare.backend.repository.AppointmentRepository;
import com.medicare.backend.repository.DoctorRepository;
import com.medicare.backend.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                 PatientRepository patientRepository,
                                 DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentCreateRequest req) {
        Patient patient = patientRepository.findById(req.getPatientId()).orElse(null);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Patient not found"));
        }

        Doctor doctor = doctorRepository.findById(req.getDoctorId()).orElse(null);
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Doctor not found"));
        }

        LocalTime time = req.getAppointmentTime();
        if (time == null && req.getAppointmentTimeStr() != null && !req.getAppointmentTimeStr().isBlank()) {
            try {
                String str = req.getAppointmentTimeStr().trim().toUpperCase(Locale.ROOT);
                if (str.contains("AM") || str.contains("PM")) {
                    DateTimeFormatter dtf = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);
                    time = LocalTime.parse(str, dtf);
                } else {
                    time = LocalTime.parse(str);
                }
            } catch (Exception e) {
                time = LocalTime.of(10, 0);
            }
        }
        if (time == null) {
            time = LocalTime.of(10, 0);
        }

        Appointment app = new Appointment();
        app.setPatient(patient);
        app.setDoctor(doctor);
        app.setAppointmentDate(req.getAppointmentDate());
        app.setAppointmentTime(time);
        app.setReasonForVisit(req.getReasonForVisit());
        app.setStatus(Appointment.AppointmentStatus.PENDING);

        Appointment saved = appointmentRepository.save(app);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Appointment app = appointmentRepository.findById(id).orElse(null);
        if (app == null) {
            return ResponseEntity.notFound().build();
        }

        String statusStr = body.get("status");
        if (statusStr != null) {
            try {
                Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(statusStr.toUpperCase(Locale.ROOT));
                app.setStatus(status);
                Appointment saved = appointmentRepository.save(app);
                return ResponseEntity.ok(saved);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid appointment status: " + statusStr));
            }
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        Appointment app = appointmentRepository.findById(id).orElse(null);
        if (app == null) {
            return ResponseEntity.notFound().build();
        }
        app.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(app);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
    }
}
