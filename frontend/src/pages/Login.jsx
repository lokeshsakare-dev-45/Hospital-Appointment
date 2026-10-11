import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const [role, setRole] = useState('Patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setIdentifier('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'Patient') {
        await authService.loginPatient(identifier, password);
        navigate('/patient/dashboard');
      } else if (role === 'Doctor') {
        await authService.loginDoctor(identifier, password);
        navigate('/doctor/dashboard');
      }
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
          <p className="text-muted mt-1">Welcome Back</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--border-radius)', padding: '0.25rem', marginBottom: '2rem' }}>
          {['Patient', 'Doctor'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: 'calc(var(--border-radius) - 2px)',
                backgroundColor: role === r ? 'white' : 'transparent',
                boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                fontWeight: role === r ? '600' : '500',
                color: role === r ? 'var(--primary-color)' : 'var(--text-muted)'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}>
          {role === 'Patient' && (
            <>
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
                <a href="#" style={{ color: 'var(--primary-color)', fontSize: '0.875rem' }}>Forgot Password?</a>
              </div>
              <div className="text-center" style={{ fontSize: '0.875rem' }}>
                Don't have an account? <Link to="/register/patient" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create Patient Account</Link>
              </div>
            </>
          )}

          {role === 'Doctor' && (
            <>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
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
                <a href="#" style={{ color: 'var(--primary-color)', fontSize: '0.875rem' }}>Forgot Password?</a>
              </div>
              <div className="text-center" style={{ fontSize: '0.875rem' }}>
                Don't have an account? <Link to="/register/doctor" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Create Doctor Account</Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
