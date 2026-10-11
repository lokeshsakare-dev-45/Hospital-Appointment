import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { authService } from '../services/api';

export default function PatientLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.loginPatient(identifier, password);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-main)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <Activity size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h2>MediCare</h2>
          <p className="text-muted mt-1">Patient Login</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email / Mobile Number</label>
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center mb-3">
            <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontSize: '0.875rem' }}>Forgot Password?</Link>
          </div>
          <div className="text-center" style={{ fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register/patient" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create Patient Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
