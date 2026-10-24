package com.medicare.backend.controller;

import com.medicare.backend.entity.*;
import com.medicare.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository scheduleRepository;

    public DoctorController(DoctorRepository doctorRepository,
                            AppointmentRepository appointmentRepository,
                            DoctorScheduleRepository scheduleRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @GetMapping
    public List<Doctor> getDoctors(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String search) {
        if (departmentId != null) {
            return doctorRepository.findByStatusAndDepartmentId(Doctor.DoctorStatus.APPROVED, departmentId);
        }
        if (search != null && !search.isBlank()) {
            return doctorRepository.findByStatusAndNameContainingIgnoreCase(Doctor.DoctorStatus.APPROVED, search.trim());
        }
        return doctorRepository.findByStatus(Doctor.DoctorStatus.APPROVED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/appointments")
    public List<Appointment> getDoctorAppointments(@PathVariable Long id) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(id);
    }

    @GetMapping("/{id}/requests")
    public List<Appointment> getDoctorPendingRequests(@PathVariable Long id) {
        return appointmentRepository.findByDoctorIdAndStatusOrderByAppointmentDateDescAppointmentTimeDesc(id, Appointment.AppointmentStatus.PENDING);
    }

    @GetMapping("/{id}/patients")
    public List<Patient> getDoctorPatients(@PathVariable Long id) {
        return appointmentRepository.findDistinctPatientsByDoctorId(id);
    }

    @GetMapping("/{id}/schedule")
    public List<DoctorSchedule> getDoctorSchedule(@PathVariable Long id) {
        return scheduleRepository.findByDoctorId(id);
    }

    @PostMapping("/{id}/schedule")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> saveDoctorSchedule(@PathVariable Long id, @RequestBody List<Map<String, String>> schedules) {
        Doctor doctor = doctorRepository.findById(id).orElse(null);
        if (doctor == null) {
            return ResponseEntity.notFound().build();
        }
        scheduleRepository.deleteByDoctorId(id);
        for (Map<String, String> entry : schedules) {
            try {
                String dayStr = entry.get("dayOfWeek");
                String startStr = entry.get("startTime");
                String endStr = entry.get("endTime");
                if (dayStr == null || startStr == null || endStr == null) continue;
                DoctorSchedule s = new DoctorSchedule();
                s.setDoctor(doctor);
                s.setDayOfWeek(DoctorSchedule.DayOfWeek.valueOf(dayStr.toUpperCase()));
                s.setStartTime(java.time.LocalTime.parse(startStr));
                s.setEndTime(java.time.LocalTime.parse(endStr));
                scheduleRepository.save(s);
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(scheduleRepository.findByDoctorId(id));
    }

    @GetMapping("/{id}/stats")
    public Map<String, Object> getDoctorStats(@PathVariable Long id) {
        List<Appointment> allAppointments = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(id);
        LocalDate today = LocalDate.now();

        long todayAppointments = allAppointments.stream()
            .filter(a -> today.equals(a.getAppointmentDate()))
            .count();

        long pendingRequests = allAppointments.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.PENDING)
            .count();

        long completedAppointments = allAppointments.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.COMPLETED)
            .count();

        long totalPatients = appointmentRepository.findDistinctPatientsByDoctorId(id).size();

        return Map.of(
            "todayAppointments", todayAppointments,
            "pendingRequests", pendingRequests,
            "totalPatients", totalPatients,
            "completed", completedAppointments
        );
    }
}
