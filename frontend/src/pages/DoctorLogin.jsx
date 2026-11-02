import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (isLoggedIn && role === 'doctor') {
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your doctor email or registered mobile number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await authService.loginDoctor(identifier.trim(), password);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your doctor credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-main)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <Activity size={40} color="var(--primary-color)" style={{ margin: '0 auto 0.75rem' }} />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>MediCare</h2>
          <p className="text-muted mt-1" style={{ fontSize: '0.95rem' }}>Doctor Portal Login</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <label>Email or Mobile Number</label>
            <input
              type="text"
              placeholder="e.g. rahul@medicare.com or 9876543201"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1.25rem', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Doctor Dashboard'}
          </button>
          
          <div className="text-center" style={{ fontSize: '0.9rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <span className="text-muted">New Doctor at MediCare? </span>
            <Link to="/register/doctor" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
              Register Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
