import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Search, Calendar, Clock, User, LogOut, Users, Settings, FileText, CheckSquare, Stethoscope } from 'lucide-react';

export default function Sidebar({ role }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const patientLinks = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/find-doctor', icon: Search, label: 'Find Doctors' },
    { to: '/patient/my-appointments', icon: Calendar, label: 'My Appointments' },
    { to: '/patient/appointment-history', icon: Clock, label: 'Appointment History' },
    { to: '/patient/dashboard', icon: User, label: 'My Profile' },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor/appointment-requests', icon: CheckSquare, label: 'Appointment Requests' },
    { to: '/doctor/my-appointments', icon: Calendar, label: 'My Appointments' },
    { to: '/doctor/patients', icon: Users, label: 'Patients' },
    { to: '/doctor/schedule', icon: Clock, label: 'My Schedule' },
    { to: '/doctor/profile', icon: User, label: 'My Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
    { to: '/admin/patients', icon: Users, label: 'Patients' },
    { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/admin/departments', icon: FileText, label: 'Departments' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  let links = [];
  let title = 'MediCare';
  if (role === 'patient') { links = patientLinks; title = 'MediCare'; }
  if (role === 'doctor') { links = doctorLinks; title = 'MediCare'; }
  if (role === 'admin') { links = adminLinks; title = 'MediCare Admin'; }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Activity size={24} />
        {title}
      </div>
      <div className="sidebar-nav">
        {links.map((link, idx) => (
          <Link key={idx} to={link.to} className={currentPath === link.to ? 'active' : ''}>
            <link.icon size={20} />
            {link.label}
          </Link>
        ))}
        <Link to="/" onClick={handleLogout} style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
