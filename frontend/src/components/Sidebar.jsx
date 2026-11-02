import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Search, Calendar, Clock, User, LogOut, Users, Settings, FileText, CheckSquare, Stethoscope } from 'lucide-react';
import { authService } from '../services/api';

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || '';

  const patientLinks = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/find-doctor', icon: Search, label: 'Find Doctors' },
    { to: '/patient/my-appointments', icon: Calendar, label: 'My Appointments' },
    { to: '/patient/appointment-history', icon: Clock, label: 'Appointment History' },
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
  let roleTitle = 'Patient Portal';
  if (role === 'patient') { links = patientLinks; roleTitle = 'Patient Portal'; }
  if (role === 'doctor') { links = doctorLinks; roleTitle = 'Doctor Portal'; }
  if (role === 'admin') { links = adminLinks; roleTitle = 'Admin Portal'; }

  const handleLogout = (e) => {
    e.preventDefault();
    authService.logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-color)' }}>
          <Activity size={26} />
          <span>MediCare</span>
        </Link>
      </div>

      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-color)' }}>
          {roleTitle}
        </p>
        <p style={{ fontWeight: '600', fontSize: '0.95rem', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {userName}
        </p>
        {userEmail && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userEmail}
          </p>
        )}
      </div>

      <div className="sidebar-nav">
        {links.map((link, idx) => (
          <Link key={idx} to={link.to} className={currentPath === link.to ? 'active' : ''}>
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <button
          onClick={handleLogout}
          className="sidebar-logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--border-radius)',
            color: 'var(--danger)',
            backgroundColor: '#fef2f2',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s',
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
