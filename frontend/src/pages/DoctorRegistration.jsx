import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

export default function DoctorRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    departmentName: '',
    specialization: '',
    qualification: '',
    experienceYears: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Allow only numbers and limit to 10 digits
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

    if (!formData.departmentName) {
      errors.departmentName = 'Please select a clinical department';
    }

    if (!formData.specialization.trim()) {
      errors.specialization = 'Specialization is required';
    }

    if (!formData.qualification.trim()) {
      errors.qualification = 'Medical qualification is required (e.g. MBBS, MD)';
    }

    if (!formData.experienceYears || parseInt(formData.experienceYears, 10) < 0) {
      errors.experienceYears = 'Years of experience must be 0 or more';
    }

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
      await authService.registerDoctor({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        departmentName: formData.departmentName,
        specialization: formData.specialization.trim(),
        qualification: formData.qualification.trim(),
        experienceYears: parseInt(formData.experienceYears, 10) || 1,
        password: formData.password,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '520px', padding: '3rem' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={42} />
          </div>
          <h2 className="mb-2">Registration Submitted!</h2>
          <p className="text-muted mt-2 mb-4" style={{ lineHeight: 1.6 }}>
            Thank you, <strong>{formData.name}</strong>. Your doctor profile has been created and is awaiting administrator verification and approval. You will be able to log in once approved.
          </p>
          <Link to="/doctor/login" className="btn btn-primary" style={{ width: '100%' }}>
            Proceed to Doctor Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="text-center mb-4">
          <Activity size={36} color="var(--primary-color)" style={{ margin: '0 auto 0.75rem' }} />
          <h2 className="mb-1">Doctor Registration</h2>
          <p className="text-muted">Join MediCare Hospital as a healthcare specialist.</p>
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
              placeholder="e.g. Dr. Rajesh Kulkarni"
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
              placeholder="doctor@hospital.com"
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
            <label>Department <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              className={fieldErrors.departmentName ? 'input-invalid' : ''}
              required
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
            </select>
            {fieldErrors.departmentName && <p className="field-error">{fieldErrors.departmentName}</p>}
          </div>

          <div className="input-group">
            <label>Specialization <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Senior Cardiologist"
              value={formData.specialization}
              onChange={handleChange}
              className={fieldErrors.specialization ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.specialization && <p className="field-error">{fieldErrors.specialization}</p>}
          </div>

          <div className="input-group">
            <label>Qualification <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              name="qualification"
              placeholder="e.g. MBBS, MD, DM"
              value={formData.qualification}
              onChange={handleChange}
              className={fieldErrors.qualification ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.qualification && <p className="field-error">{fieldErrors.qualification}</p>}
          </div>

          <div className="input-group">
            <label>Years of Experience <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="number"
              name="experienceYears"
              min="0"
              max="50"
              placeholder="e.g. 8"
              value={formData.experienceYears}
              onChange={handleChange}
              className={fieldErrors.experienceYears ? 'input-invalid' : ''}
              required
            />
            {fieldErrors.experienceYears && <p className="field-error">{fieldErrors.experienceYears}</p>}
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
              {loading ? 'Submitting Registration...' : 'Register as Doctor'}
            </button>
          </div>
        </form>

        <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
          <span className="text-muted">Already registered as a Doctor? </span>
          <Link to="/doctor/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Doctor Login</Link>
        </div>
      </div>
    </div>
  );
}
