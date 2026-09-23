export type Role = 'patient' | 'doctor' | 'receptionist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  department?: string;
  specialization?: string;
  mrn?: string; // Medical Record Number for patients
  clearance?: string; // for admin / doctor
  staffId?: string;
}

export interface Doctor {
  id: string;
  staffId: string;
  name: string;
  title: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  room: string;
  wing: string;
  avatar: string;
  dutyStatus: 'On Duty' | 'In Procedure' | 'On Break' | 'Off Duty';
  availableDays: string[];
  timeSlots: string[];
  bio: string;
  npi: string;
  clearance: string;
}

export interface Department {
  id: string;
  name: string;
  wing: string;
  code: string;
  iconName: string;
  headDoctor: string;
  activeDoctors: number;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number;
  description: string;
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked In'
  | 'In Progress'
  | 'In Exam'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export type AppointmentType = 'In-Person' | 'Telehealth' | 'Walk-In' | 'Emergency';

export interface Appointment {
  id: string; // e.g. APT-2026-8941
  token?: string; // e.g. TK-101
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  department: string;
  room: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 09:30 AM
  type: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: string;
  queueWaitDuration?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider?: string;
  insurancePolicyId?: string;
  registeredDate: string;
  recentVitals?: {
    heartRate: number;
    bloodPressure: string;
    spo2: number;
    temperature: string;
    status: 'Normal' | 'Elevated' | 'Critical';
  };
}

export interface QueueItem {
  token: string;
  appointmentId: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  patientGender: string;
  guardian?: string;
  doctorName: string;
  doctorDepartment: string;
  type: 'Walk-In' | 'Scheduled' | 'Emergency';
  waitDuration: string;
  status: 'Checked In' | 'Triage Done' | 'Called to Room' | 'In Exam' | 'Completed';
  room?: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
}

export interface ClinicalAlert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  patientName: string;
  patientMrn: string;
  bed?: string;
  timeAgo: string;
  description: string;
  actionLabel?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Critical';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'appointment' | 'system' | 'clinical' | 'reminder';
}
