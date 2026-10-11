import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = localStorage.getItem('userRole');

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Activity size={28} color="var(--primary-color)" />
        MediCare
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/find-doctor">Find Doctors</Link>
        <Link to="/">About</Link>
        <Link to="/">Contact</Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/patient/login" className="btn btn-secondary">Patient Login</Link>
            <Link to="/doctor/login" className="btn btn-primary">Doctor Login</Link>
            <Link to="/admin/login" style={{ fontSize: '0.875rem', marginLeft: '1rem' }}>Admin Login</Link>
          </>
        ) : (
          <Link to={`/${role}/dashboard`} className="btn btn-primary">
            {role ? role.charAt(0).toUpperCase() + role.slice(1) + ' Dashboard' : 'Dashboard'}
          </Link>
        )}
      </div>
    </nav>
  );
}
