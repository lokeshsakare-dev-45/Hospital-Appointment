import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
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
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/patient/login" element={<MainLayout><PatientLogin /></MainLayout>} />
        <Route path="/doctor/login" element={<MainLayout><DoctorLogin /></MainLayout>} />
        <Route path="/register/patient" element={<MainLayout><PatientRegistration /></MainLayout>} />
        <Route path="/register/doctor" element={<MainLayout><DoctorRegistration /></MainLayout>} />
        <Route path="/admin/login" element={<MainLayout><AdminLogin /></MainLayout>} />
        
        {/* Public Browsing Routes */}
        <Route path="/find-doctor" element={<MainLayout><FindDoctor /></MainLayout>} />
        <Route path="/doctor-profile" element={<MainLayout><DoctorProfile /></MainLayout>} />
        <Route path="/book-appointment" element={<MainLayout><BookAppointment /></MainLayout>} />
        
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<AppLayout role="patient"><PatientDashboard /></AppLayout>} />
        <Route path="/patient/my-appointments" element={<AppLayout role="patient"><MyAppointments /></AppLayout>} />
        <Route path="/patient/appointment-history" element={<AppLayout role="patient"><AppointmentHistory /></AppLayout>} />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<AppLayout role="doctor"><DoctorDashboard /></AppLayout>} />
        <Route path="/doctor/appointment-requests" element={<AppLayout role="doctor"><DoctorAppointmentRequests /></AppLayout>} />
        <Route path="/doctor/my-appointments" element={<AppLayout role="doctor"><DoctorMyAppointments /></AppLayout>} />
        <Route path="/doctor/patients" element={<AppLayout role="doctor"><DoctorPatients /></AppLayout>} />
        <Route path="/doctor/schedule" element={<AppLayout role="doctor"><DoctorSchedule /></AppLayout>} />
        <Route path="/doctor/profile" element={<AppLayout role="doctor"><DoctorProfileDocView /></AppLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AppLayout role="admin"><AdminDashboard /></AppLayout>} />
        <Route path="/admin/doctors" element={<AppLayout role="admin"><AdminManageDoctors /></AppLayout>} />
        <Route path="/admin/patients" element={<AppLayout role="admin"><AdminManagePatients /></AppLayout>} />
        <Route path="/admin/appointments" element={<AppLayout role="admin"><AdminAllAppointments /></AppLayout>} />
        <Route path="/admin/departments" element={<AppLayout role="admin"><AdminDepartments /></AppLayout>} />
        <Route path="/admin/reports" element={<AppLayout role="admin"><AdminReports /></AppLayout>} />
        <Route path="/admin/settings" element={<AppLayout role="admin"><AdminSettings /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
