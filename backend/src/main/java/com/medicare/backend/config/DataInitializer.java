package com.medicare.backend.config;

import com.medicare.backend.entity.*;
import com.medicare.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository scheduleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository,
                           DepartmentRepository departmentRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           AppointmentRepository appointmentRepository,
                           DoctorScheduleRepository scheduleRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.scheduleRepository = scheduleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Admin
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setName("System Admin");
            admin.setEmail("admin@medicare.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminRepository.save(admin);
        }

        // 2. Seed Departments
        Department cardio = departmentRepository.findByNameIgnoreCase("Cardiology")
            .orElseGet(() -> {
                Department d = new Department();
                d.setName("Cardiology");
                d.setDescription("Comprehensive cardiac and heart care");
                return departmentRepository.save(d);
            });

        Department general = departmentRepository.findByNameIgnoreCase("General Medicine")
            .orElseGet(() -> {
                Department d = new Department();
                d.setName("General Medicine");
                d.setDescription("General adult healthcare and prevention");
                return departmentRepository.save(d);
            });

        Department ortho = departmentRepository.findByNameIgnoreCase("Orthopedics")
            .orElseGet(() -> {
                Department d = new Department();
                d.setName("Orthopedics");
                d.setDescription("Bone, joint, and musculoskeletal care");
                return departmentRepository.save(d);
            });

        departmentRepository.findByNameIgnoreCase("Neurology")
            .orElseGet(() -> {
                Department d = new Department();
                d.setName("Neurology");
                d.setDescription("Nervous system and neurological health");
                return departmentRepository.save(d);
            });

        // 3. Seed Doctors
        Doctor rahul = doctorRepository.findByEmail("rahul@medicare.com").orElse(null);
        if (rahul == null && doctorRepository.count() == 0) {
            rahul = new Doctor();
            rahul.setName("Dr. Rahul Sharma");
            rahul.setEmail("rahul@medicare.com");
            rahul.setPassword(passwordEncoder.encode("password123"));
            rahul.setSpecialization("Cardiologist");
            rahul.setExperienceYears(8);
            rahul.setDepartment(cardio);
            rahul.setStatus(Doctor.DoctorStatus.APPROVED);
            rahul = doctorRepository.save(rahul);

            DoctorSchedule s1 = new DoctorSchedule();
            s1.setDoctor(rahul);
            s1.setDayOfWeek(DoctorSchedule.DayOfWeek.MONDAY);
            s1.setStartTime(LocalTime.of(9, 0));
            s1.setEndTime(LocalTime.of(17, 0));
            scheduleRepository.save(s1);

            Doctor priya = new Doctor();
            priya.setName("Dr. Priya Deshmukh");
            priya.setEmail("priya@medicare.com");
            priya.setPassword(passwordEncoder.encode("password123"));
            priya.setSpecialization("General Physician");
            priya.setExperienceYears(6);
            priya.setDepartment(general);
            priya.setStatus(Doctor.DoctorStatus.APPROVED);
            doctorRepository.save(priya);

            Doctor amit = new Doctor();
            amit.setName("Dr. Amit Patil");
            amit.setEmail("amit@medicare.com");
            amit.setPassword(passwordEncoder.encode("password123"));
            amit.setSpecialization("Orthopedic Surgeon");
            amit.setExperienceYears(12);
            amit.setDepartment(ortho);
            amit.setStatus(Doctor.DoctorStatus.APPROVED);
            doctorRepository.save(amit);
        }

        // 4. Seed Patient
        Patient john = patientRepository.findByEmail("patient@medicare.com").orElse(null);
        if (john == null && patientRepository.count() == 0) {
            john = new Patient();
            john.setName("Amit Sharma");
            john.setEmail("patient@medicare.com");
            john.setMobile("9876543210");
            john.setPassword(passwordEncoder.encode("password123"));
            john = patientRepository.save(john);

            // Seed initial sample appointment
            if (rahul != null && appointmentRepository.count() == 0) {
                Appointment app = new Appointment();
                app.setPatient(john);
                app.setDoctor(rahul);
                app.setAppointmentDate(LocalDate.now().plusDays(1));
                app.setAppointmentTime(LocalTime.of(10, 30));
                app.setReasonForVisit("Chest pain evaluation");
                app.setStatus(Appointment.AppointmentStatus.PENDING);
                appointmentRepository.save(app);
            }
        }
    }
}
