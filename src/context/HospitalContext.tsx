import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Doctor,
  Department,
  Appointment,
  Patient,
  QueueItem,
  ClinicalAlert,
  AuditLogEntry,
  NotificationItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_QUEUE,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface HospitalContextType {
  currentUser: User | null;
  currentRole: Role;
  login: (emailOrPhone: string, password?: string, overrideRole?: Role) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
  activeView: string;
  setActiveView: (view: string) => void;

  // Data
  doctors: Doctor[];
  departments: Department[];
  appointments: Appointment[];
  patients: Patient[];
  queue: QueueItem[];
  alerts: ClinicalAlert[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];

  // Patient Actions
  bookAppointment: (data: {
    doctorId: string;
    date: string;
    time: string;
    type: 'In-Person' | 'Telehealth';
    chiefComplaint: string;
    notes?: string;
  }) => Appointment;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  cancelAppointment: (appointmentId: string, reason?: string) => void;

  // Doctor Actions
  updateDoctorDutyStatus: (doctorId: string, status: 'On Duty' | 'In Procedure' | 'On Break' | 'Off Duty') => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status'], notes?: string, rx?: string) => void;
  signClinicalAlert: (alertId: string) => void;

  // Receptionist Actions
  registerWalkIn: (patientData: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    doctorId: string;
    chiefComplaint: string;
    isEmergency?: boolean;
  }) => { appointment: Appointment; queueItem: QueueItem };
  updateQueueStatus: (token: string, newStatus: QueueItem['status']) => void;
  registerNewPatient: (newPatient: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>) => Patient;

  // Admin Actions
  toggleDoctorStatus: (doctorId: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id' | 'staffId'>) => void;
  updateDepartmentBeds: (deptId: string, occupiedChange: number) => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication: starts as NULL so the user sees the LOGIN PAGE first!
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');

  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Appointment Confirmed',
      message: 'Consultation with Dr. Sarah Chen, MD confirmed for 10:00 AM.',
      timestamp: '10 mins ago',
      read: false,
      type: 'appointment'
    },
    {
      id: 'notif-2',
      title: 'Telemetry Sync Active',
      message: 'Continuous bedside monitor HL7 v2.8 stream running with 0ms latency.',
      timestamp: '25 mins ago',
      read: false,
      type: 'clinical'
    },
    {
      id: 'notif-3',
      title: 'Schedule Updated',
      message: 'Orthopedics Clinic shift rotation adjusted for upcoming weekend.',
      timestamp: '1 hour ago',
      read: true,
      type: 'reminder'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const currentRole: Role = currentUser?.role || 'patient';

  const login = (emailOrPhone: string, password?: string, overrideRole?: Role): boolean => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    
    // Find matching user or fallback to demo role detection
    let matchedUser = INITIAL_USERS.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '')
    );

    if (!matchedUser && overrideRole) {
      matchedUser = INITIAL_USERS.find((u) => u.role === overrideRole);
    }

    if (!matchedUser) {
      if (cleanInput.includes('doctor')) {
        matchedUser = INITIAL_USERS.find((u) => u.role === 'doctor');
      } else if (cleanInput.includes('reception') || cleanInput.includes('clerk')) {
        matchedUser = INITIAL_USERS.find((u) => u.role === 'receptionist');
      } else if (cleanInput.includes('admin')) {
        matchedUser = INITIAL_USERS.find((u) => u.role === 'admin');
      } else {
        matchedUser = INITIAL_USERS.find((u) => u.role === 'patient');
      }
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setActiveView('dashboard');
      showToast(`Welcome back, ${matchedUser.name} (${matchedUser.role.toUpperCase()})`);

      // Add to audit log
      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        user: matchedUser.name,
        role: matchedUser.role,
        action: 'USER_LOGIN',
        details: `Successful authentication via portal credentials for ${matchedUser.role}`,
        ipAddress: '192.168.4.120',
        status: 'Success'
      };
      setAuditLogs((prev) => [newLog, ...prev]);
      return true;
    }

    return false;
  };

  const logout = () => {
    if (currentUser) {
      const newLog: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        user: currentUser.name,
        role: currentUser.role,
        action: 'USER_LOGOUT',
        details: 'User logged out securely from clinical session',
        ipAddress: '192.168.4.120',
        status: 'Success'
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
    setCurrentUser(null);
    setActiveView('dashboard');
    showToast('You have been logged out securely.');
  };

  const switchRole = (newRole: Role) => {
    const userForRole = INITIAL_USERS.find((u) => u.role === newRole) || INITIAL_USERS[0];
    setCurrentUser(userForRole);
    setActiveView('dashboard');
    showToast(`Switched perspective to ${newRole.toUpperCase()} mode (${userForRole.name})`);
  };

  // Patient: Book Appointment
  const bookAppointment = (data: {
    doctorId: string;
    date: string;
    time: string;
    type: 'In-Person' | 'Telehealth';
    chiefComplaint: string;
    notes?: string;
  }): Appointment => {
    const doc = doctors.find((d) => d.id === data.doctorId) || doctors[0];
    const patientName = currentUser?.name || 'Sarah Miller';
    const patientMrn = currentUser?.mrn || 'MRN-782104';
    const randomId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: randomId,
      patientId: currentUser?.id || 'pt-6',
      patientName,
      patientMrn,
      patientAge: 29,
      patientGender: 'Female',
      patientPhone: currentUser?.phone || '+1 (555) 234-5678',
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialization,
      department: doc.department,
      room: doc.room,
      date: data.date,
      time: data.time,
      type: data.type,
      status: 'Confirmed',
      chiefComplaint: data.chiefComplaint,
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`Appointment booked with ${doc.name} for ${data.date} at ${data.time}`);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        user: patientName,
        role: 'patient',
        action: 'APPOINTMENT_BOOKED',
        details: `Booked #${randomId} with ${doc.name} (${data.type})`,
        ipAddress: '192.168.4.112',
        status: 'Success'
      },
      ...prev
    ]);

    return newAppointment;
  };

  // Patient: Reschedule Appointment
  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, date: newDate, time: newTime, status: 'Confirmed' } : apt
      )
    );
    showToast(`Appointment ${appointmentId} rescheduled to ${newDate} at ${newTime}`);
  };

  // Patient / Receptionist: Cancel Appointment
  const cancelAppointment = (appointmentId: string, reason?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, status: 'Cancelled', notes: reason ? `${apt.notes || ''} [Cancelled: ${reason}]` : apt.notes }
          : apt
      )
    );
    showToast(`Appointment ${appointmentId} has been cancelled`);
  };

  // Doctor: Duty Status
  const updateDoctorDutyStatus = (doctorId: string, status: 'On Duty' | 'In Procedure' | 'On Break' | 'Off Duty') => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, dutyStatus: status } : doc))
    );
    showToast(`Doctor availability changed to: ${status}`);
  };

  // Doctor: Update Status (Exam, EHR, Rx)
  const updateAppointmentStatus = (
    appointmentId: string,
    status: Appointment['status'],
    notes?: string,
    rx?: string
  ) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status,
              notes: notes !== undefined ? notes : apt.notes,
              prescription: rx !== undefined ? rx : apt.prescription
            }
          : apt
      )
    );
    showToast(`Appointment ${appointmentId} status updated to: ${status}`);
  };

  // Doctor: Sign Clinical Alert
  const signClinicalAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showToast('Clinical alert signed off and protocol initiated.');
  };

  // Receptionist: Register Walk-In
  const registerWalkIn = (patientData: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    doctorId: string;
    chiefComplaint: string;
    isEmergency?: boolean;
  }) => {
    const doc = doctors.find((d) => d.id === patientData.doctorId) || doctors[0];
    const tokenNum = 100 + queue.length + 1;
    const token = `TK-${tokenNum}`;
    const mrn = `MRN-${Math.floor(800000 + Math.random() * 199999)}`;
    const aptId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApt: Appointment = {
      id: aptId,
      token,
      patientId: `pt-walkin-${Date.now()}`,
      patientName: patientData.name,
      patientMrn: mrn,
      patientAge: patientData.age,
      patientGender: patientData.gender,
      patientPhone: patientData.phone,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialization,
      department: doc.department,
      room: doc.room,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: patientData.isEmergency ? 'Emergency' : 'Walk-In',
      status: patientData.isEmergency ? 'In Progress' : 'Checked In',
      chiefComplaint: patientData.chiefComplaint,
      createdAt: new Date().toISOString(),
      queueWaitDuration: '00m 00s'
    };

    const newQueueItem: QueueItem = {
      token,
      appointmentId: aptId,
      patientName: patientData.name,
      patientMrn: mrn,
      patientAge: patientData.age,
      patientGender: patientData.gender,
      doctorName: doc.name,
      doctorDepartment: doc.department,
      type: patientData.isEmergency ? 'Emergency' : 'Walk-In',
      waitDuration: '00m 00s',
      status: patientData.isEmergency ? 'Triage Done' : 'Checked In',
      room: doc.room,
      priority: patientData.isEmergency ? 'Emergency' : 'Routine'
    };

    setAppointments((prev) => [newApt, ...prev]);
    setQueue((prev) => [newQueueItem, ...prev]);

    // Add to patients list if not exists
    const newPt: Patient = {
      id: newApt.patientId,
      mrn,
      name: patientData.name,
      age: patientData.age,
      gender: patientData.gender,
      phone: patientData.phone,
      email: `${patientData.name.toLowerCase().replace(/\s+/g, '.')}@patient.metrohealth.org`,
      bloodGroup: 'Unknown',
      allergies: [],
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Guardian/Family',
        phone: patientData.phone
      },
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setPatients((prev) => [newPt, ...prev]);

    showToast(`Issued Token ${token} for ${patientData.name} -> Assigned to ${doc.name}`);
    return { appointment: newApt, queueItem: newQueueItem };
  };

  // Receptionist: Queue update
  const updateQueueStatus = (token: string, newStatus: QueueItem['status']) => {
    setQueue((prev) =>
      prev.map((q) => (q.token === token ? { ...q, status: newStatus } : q))
    );
    showToast(`Token ${token} moved to status: ${newStatus}`);
  };

  // Receptionist: Register New Patient
  const registerNewPatient = (newPatientData: Omit<Patient, 'id' | 'mrn' | 'registeredDate'>): Patient => {
    const mrn = `MRN-${Math.floor(800000 + Math.random() * 199999)}`;
    const fullPatient: Patient = {
      ...newPatientData,
      id: `pt-${Date.now()}`,
      mrn,
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setPatients((prev) => [fullPatient, ...prev]);
    showToast(`Registered patient ${fullPatient.name} with ${mrn}`);
    return fullPatient;
  };

  // Admin: Toggle Doctor active status
  const toggleDoctorStatus = (doctorId: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          const nextStatus = doc.dutyStatus === 'Off Duty' ? 'On Duty' : 'Off Duty';
          return { ...doc, dutyStatus: nextStatus };
        }
        return doc;
      })
    );
    showToast('Doctor credentials & status updated in staff roster.');
  };

  // Admin: Add Doctor
  const addDoctor = (docData: Omit<Doctor, 'id' | 'staffId'>) => {
    const count = doctors.length + 1;
    const newDoc: Doctor = {
      ...docData,
      id: `doc-custom-${Date.now()}`,
      staffId: `DOC-89${count < 10 ? '0' + count : count}`
    };
    setDoctors((prev) => [newDoc, ...prev]);
    showToast(`Added ${newDoc.name} to ${newDoc.department}`);
  };

  // Admin: Update Department Beds
  const updateDepartmentBeds = (deptId: string, occupiedChange: number) => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id === deptId) {
          const newOccupied = Math.max(0, Math.min(dept.totalBeds, dept.occupiedBeds + occupiedChange));
          const newRate = Math.round((newOccupied / dept.totalBeds) * 100);
          return { ...dept, occupiedBeds: newOccupied, occupancyRate: newRate };
        }
        return dept;
      })
    );
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        currentRole,
        login,
        logout,
        switchRole,
        activeView,
        setActiveView,
        doctors,
        departments,
        appointments,
        patients,
        queue,
        alerts,
        auditLogs,
        notifications,
        bookAppointment,
        rescheduleAppointment,
        cancelAppointment,
        updateDoctorDutyStatus,
        updateAppointmentStatus,
        signClinicalAlert,
        registerWalkIn,
        updateQueueStatus,
        registerNewPatient,
        toggleDoctorStatus,
        addDoctor,
        updateDepartmentBeds,
        toastMessage,
        showToast
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
