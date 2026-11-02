import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LogOut, User } from 'lucide-react';
import { authService } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authState, setAuthState] = useState(() => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: localStorage.getItem('userRole'),
    name: localStorage.getItem('userName'),
  }));

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        role: localStorage.getItem('userRole'),
        name: localStorage.getItem('userName'),
      });
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/#${sectionId}`);
  };

  const { isLoggedIn, role, name } = authState;

  const getDashboardPath = () => {
    if (role === 'doctor') return '/doctor/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/patient/dashboard';
  };

  const getRoleLabel = () => {
    if (role === 'doctor') return 'Doctor';
    if (role === 'admin') return 'Admin';
    return 'Patient';
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Activity size={28} color="var(--primary-color)" />
        <span>MediCare</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' && !location.hash ? 'nav-active' : ''}>Home</Link>
        <Link to="/find-doctor" className={location.pathname === '/find-doctor' ? 'nav-active' : ''}>Find Doctors</Link>
        <button
          type="button"
          onClick={() => scrollToSection('about')}
          className={`nav-btn-link ${location.hash === '#about' || location.pathname === '/about' ? 'nav-active' : ''}`}
          style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
        >
          About
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('contact')}
          className={`nav-btn-link ${location.hash === '#contact' ? 'nav-active' : ''}`}
          style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
        >
          Contact
        </button>

        {!isLoggedIn ? (
          <div className="auth-buttons-group">
            <Link to="/patient/login" className="btn btn-secondary nav-login-btn">
              Patient Login
            </Link>
            <Link to="/doctor/login" className="btn btn-primary nav-login-btn doctor-btn">
              Doctor Login
            </Link>
            <Link to="/admin/login" className="btn-admin-nav">
              Admin Login
            </Link>
          </div>
        ) : (
          <div className="user-nav-group">
            <div className="user-greeting-badge">
              <User size={16} color="var(--primary-color)" />
              <span className="user-greeting-name">{name || getRoleLabel()}</span>
              <span className="user-greeting-role">{getRoleLabel()}</span>
            </div>
            <Link to={getDashboardPath()} className="btn btn-primary nav-login-btn">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-secondary nav-logout-btn"
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
