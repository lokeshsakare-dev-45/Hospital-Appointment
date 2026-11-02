import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import PatientLogin from './pages/PatientLogin';
import DoctorLogin from './pages/DoctorLogin';
import PatientRegistration from './pages/PatientRegistration';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientDashboard from './pages/PatientDashboard';
import FindDoctor from './pages/FindDoctor';
import DoctorProfile from './pages/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AppointmentHistory from './pages/AppointmentHistory';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointmentRequests from './pages/DoctorAppointmentRequests';
import DoctorMyAppointments from './pages/DoctorMyAppointments';
import DoctorPatients from './pages/DoctorPatients';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorProfileDocView from './pages/DoctorProfileDocView';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageDoctors from './pages/AdminManageDoctors';
import AdminManagePatients from './pages/AdminManagePatients';
import AdminAllAppointments from './pages/AdminAllAppointments';
import AdminDepartments from './pages/AdminDepartments';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';

function AppLayout({ children, role }) {
  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content" style={{ padding: 0 }}>
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Browsing Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/find-doctor" element={<MainLayout><FindDoctor /></MainLayout>} />
        <Route path="/doctor-profile" element={<MainLayout><DoctorProfile /></MainLayout>} />
        <Route path="/book-appointment" element={<MainLayout><BookAppointment /></MainLayout>} />

        {/* Authentication Routes */}
        <Route path="/patient/login" element={<MainLayout><PatientLogin /></MainLayout>} />
        <Route path="/doctor/login" element={<MainLayout><DoctorLogin /></MainLayout>} />
        <Route path="/admin/login" element={<MainLayout><AdminLogin /></MainLayout>} />
        <Route path="/login" element={<Navigate to="/patient/login" replace />} />

        {/* Registration Routes */}
        <Route path="/register/patient" element={<MainLayout><PatientRegistration /></MainLayout>} />
        <Route path="/register/doctor" element={<MainLayout><DoctorRegistration /></MainLayout>} />

        {/* Protected Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout role="patient"><PatientDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/my-appointments"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout role="patient"><MyAppointments /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointment-history"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout role="patient"><AppointmentHistory /></AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout role="doctor"><DoctorDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointment-requests"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout role="doctor"><DoctorAppointmentRequests /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/my-appointments"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout role="doctor"><DoctorMyAppointments /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout role="doctor"><DoctorPatients /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout role="doctor"><DoctorSchedule /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRole="doctor">
              <AppLayout role="doctor"><DoctorProfileDocView /></AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminManageDoctors /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminManagePatients /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminAllAppointments /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminDepartments /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminReports /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AppLayout role="admin"><AdminSettings /></AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
