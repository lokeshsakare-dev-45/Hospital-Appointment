import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { authService } from '../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter new password, 3 = success
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [detectedRole, setDetectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: verify email exists
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // We check by attempting a reset with a dummy — actually just verify via a GET-style approach.
      // We'll send a probe: if the account doesn't exist, backend returns 404.
      // Use a placeholder password that we won't actually save — we just need to know if email exists.
      // Better: call reset with blank password to get the existence check error only.
      // Actually, cleanest: just move to step 2 and let step 2 handle the error from backend.
      setStep(2);
    } catch (err) {
      setError(err.message || 'Error checking email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: submit new password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.resetPassword(email, newPassword);
      setDetectedRole(data.role || '');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Reset failed. Check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginLink = detectedRole === 'doctor'
    ? '/doctor/login'
    : detectedRole === 'admin'
    ? '/admin/login'
    : '/patient/login';

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-main)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>

        <div className="text-center mb-4">
          <Activity size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h2>MediCare</h2>
          <p className="text-muted mt-1">Reset Your Password</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: step >= s ? 'var(--primary-color)' : 'var(--border-color)',
              color: step >= s ? 'white' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '600', fontSize: '0.875rem'
            }}>{s}</div>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Step 1: Enter email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              Enter the email address linked to your account (patient, doctor, or admin).
            </p>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
            <div className="text-center" style={{ fontSize: '0.875rem' }}>
              <Link to="/patient/login" style={{ color: 'var(--primary-color)' }}>← Back to Login</Link>
            </div>
          </form>
        )}

        {/* Step 2: Enter new password */}
        {step === 2 && (
          <form onSubmit={handleResetSubmit}>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              Setting new password for: <strong>{email}</strong>
            </p>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="text-center" style={{ fontSize: '0.875rem' }}>
              <button type="button" onClick={() => { setStep(1); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>
                ← Change Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center">
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'var(--success)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 1.5rem'
            }}>✓</div>
            <h3 className="mb-2">Password Reset Successfully</h3>
            <p className="text-muted mb-4">
              Your password has been updated. You can now log in with your new password.
            </p>
            <Link to={loginLink} className="btn btn-primary" style={{ width: '100%' }}>
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
