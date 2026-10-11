package com.medicare.backend.controller;

import com.medicare.backend.dto.*;
import com.medicare.backend.entity.*;
import com.medicare.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AdminRepository adminRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(PatientRepository patientRepository,
                          DoctorRepository doctorRepository,
                          AdminRepository adminRepository,
                          DepartmentRepository departmentRepository,
                          PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.adminRepository = adminRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private boolean checkPassword(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) return false;
        if (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$") || encodedPassword.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        }
        return rawPassword.equals(encodedPassword);
    }

    // 1. Patient Login
    @PostMapping("/patient/login")
    public ResponseEntity<?> patientLogin(@RequestBody LoginRequest request) {
        String id = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        Patient patient = patientRepository.findByEmailOrMobile(id, id).orElse(null);

        if (patient == null || !checkPassword(request.getPassword(), patient.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email/mobile or password"));
        }

        LoginResponse response = new LoginResponse(
            patient.getId(),
            patient.getName(),
            patient.getEmail(),
            "patient",
            "ACTIVE",
            UUID.randomUUID().toString(),
            "Login successful"
        );
        return ResponseEntity.ok(response);
    }

    // 2. Patient Register
    @PostMapping("/patient/register")
    public ResponseEntity<?> patientRegister(@Valid @RequestBody PatientRegisterRequest request) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Email is already registered"));
        }
        if (patientRepository.existsByMobile(request.getMobile())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Mobile number is already registered"));
        }

        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setMobile(request.getMobile());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));

        Patient saved = patientRepository.save(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "id", saved.getId(),
            "name", saved.getName(),
            "email", saved.getEmail(),
            "message", "Patient registered successfully"
        ));
    }

    // 3. Doctor Login
    @PostMapping("/doctor/login")
    public ResponseEntity<?> doctorLogin(@RequestBody LoginRequest request) {
        String id = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        Doctor doctor = doctorRepository.findByEmail(id).orElse(null);

        if (doctor == null || !checkPassword(request.getPassword(), doctor.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid doctor email or password"));
        }

        if (doctor.getStatus() == Doctor.DoctorStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Your account is pending admin approval"));
        }

        if (doctor.getStatus() == Doctor.DoctorStatus.REJECTED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Your account registration was rejected by administrator"));
        }

        LoginResponse response = new LoginResponse(
            doctor.getId(),
            doctor.getName(),
            doctor.getEmail(),
            "doctor",
            doctor.getStatus().name(),
            UUID.randomUUID().toString(),
            "Login successful"
        );
        return ResponseEntity.ok(response);
    }

    // 4. Doctor Register
    @PostMapping("/doctor/register")
    public ResponseEntity<?> doctorRegister(@Valid @RequestBody DoctorRegisterRequest request) {
        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Email is already registered"));
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        if (department == null && request.getDepartmentName() != null && !request.getDepartmentName().isBlank()) {
            department = departmentRepository.findByNameIgnoreCase(request.getDepartmentName().trim())
                .orElseGet(() -> {
                    Department d = new Department();
                    d.setName(request.getDepartmentName().trim());
                    return departmentRepository.save(d);
                });
        }
        if (department == null) {
            department = departmentRepository.findByNameIgnoreCase("General Medicine")
                .orElseGet(() -> {
                    Department d = new Department();
                    d.setName("General Medicine");
                    return departmentRepository.save(d);
                });
        }

        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setSpecialization(request.getSpecialization());
        if (request.getQualification() != null && !request.getQualification().isBlank()) {
            doctor.setQualification(request.getQualification());
        }
        doctor.setExperienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 1);
        doctor.setDepartment(department);
        doctor.setStatus(Doctor.DoctorStatus.PENDING);

        Doctor saved = doctorRepository.save(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "id", saved.getId(),
            "name", saved.getName(),
            "status", saved.getStatus().name(),
            "message", "Doctor registration submitted. Awaiting admin approval."
        ));
    }

    // 5. Reset Password (patient or doctor by email)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email") != null ? body.get("email").trim() : "";
        String newPassword = body.get("newPassword") != null ? body.get("newPassword").trim() : "";

        if (email.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and new password are required"));
        }
        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }

        String encoded = passwordEncoder.encode(newPassword);

        // Try patient
        Patient patient = patientRepository.findByEmail(email).orElse(null);
        if (patient != null) {
            patient.setPassword(encoded);
            patientRepository.save(patient);
            return ResponseEntity.ok(Map.of("message", "Password reset successful", "role", "patient"));
        }

        // Try doctor
        Doctor doctor = doctorRepository.findByEmail(email).orElse(null);
        if (doctor != null) {
            doctor.setPassword(encoded);
            doctorRepository.save(doctor);
            return ResponseEntity.ok(Map.of("message", "Password reset successful", "role", "doctor"));
        }

        // Try admin
        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            admin.setPassword(encoded);
            adminRepository.save(admin);
            return ResponseEntity.ok(Map.of("message", "Password reset successful", "role", "admin"));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("message", "No account found with this email address"));
    }

    // 6. Admin Login
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        String id = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        Admin admin = adminRepository.findByEmail(id).orElse(null);

        // Fallback for username "admin"
        if (admin == null && ("admin".equalsIgnoreCase(id) || "admin@medicare.com".equalsIgnoreCase(id))) {
            admin = adminRepository.findAll().stream().findFirst().orElse(null);
        }

        if (admin == null || !checkPassword(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid admin credentials"));
        }

        LoginResponse response = new LoginResponse(
            admin.getId(),
            admin.getName(),
            admin.getEmail(),
            "admin",
            "ACTIVE",
            UUID.randomUUID().toString(),
            "Login successful"
        );
        return ResponseEntity.ok(response);
    }
}
