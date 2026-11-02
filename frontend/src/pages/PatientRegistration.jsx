import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

export default function PatientRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const validateMobile = (value) => {
    if (!value || value.trim() === '') {
      return 'Mobile number is required';
    }
    if (value.length < 10) {
      return `Mobile number must be exactly 10 digits (${value.length}/10 entered)`;
    }
    if (value.length > 10) {
      return 'Mobile number cannot exceed 10 digits';
    }
    if (!/^[6-9]\d{9}$/.test(value)) {
      return 'Indian mobile number must start with 6, 7, 8, or 9';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const sanitized = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, mobile: sanitized }));
      const msg = validateMobile(sanitized);
      setFieldErrors(prev => ({ ...prev, mobile: msg }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    const emailErr = validateEmail(formData.email);
    if (emailErr) errors.email = emailErr;

    const mobileErr = validateMobile(formData.mobile);
    if (mobileErr) errors.mobile = mobileErr;

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await authService.registerPatient({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
      });
      setRegistered(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '480px', padding: '3rem' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={42} />
          </div>
          <h2 className="mb-2">Account Created!</h2>
          <p className="text-muted mt-2 mb-4" style={{ lineHeight: 1.6 }}>
            Welcome to MediCare, <strong>{formData.name}</strong>. Your patient account has been successfully registered. You can now log in to book appointments.
          </p>
          <Link to="/patient/login" className="btn btn-primary" style={{ width: '100%' }}>
            Proceed to Patient Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="text-center mb-4">
          <Activity size={36} color="var(--primary-color)" style={{ margin: '0 auto 0.75rem' }} />
          <h2 className="mb-1">Create Patient Account</h2>
          <p className="text-muted">Join MediCare to schedule and manage your doctor consultations.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="grid-2" onSubmit={handleSubmit} noValidate>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Amit Sharma"
              value={formData.name}
              onChange={handleChange}
              className={fieldErrors.name ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

          <div className="input-group">
            <label>Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="patient@example.com"
              value={formData.email}
              onChange={handleChange}
              className={fieldErrors.email ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="input-group">
            <label>Mobile Number (10 digits) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="tel"
              name="mobile"
              placeholder="e.g. 9876543210"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              className={fieldErrors.mobile ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.mobile ? (
              <p className="field-error">{fieldErrors.mobile}</p>
            ) : (
              <small className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                Enter exactly 10 digits (Indian mobile numbers start with 6-9)
              </small>
            )}
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Password (min. 6 characters) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="password"
              name="password"
              placeholder="Create secure password"
              value={formData.password}
              onChange={handleChange}
              className={fieldErrors.password ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <div className="input-group">
            <label>Confirm Password <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={fieldErrors.confirmPassword ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Patient Account...' : 'Register as Patient'}
            </button>
          </div>
        </form>

        <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
          <span className="text-muted">Already registered as a Patient? </span>
          <Link to="/patient/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Patient Login</Link>
        </div>
      </div>
    </div>
  );
}
