import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.registerDoctor({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        departmentName: formData.departmentName,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experienceYears: parseInt(formData.experienceYears, 10) || 1,
        password: formData.password,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '500px', padding: '3rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✓</div>
          <h2>Account Created Successfully</h2>
          <p className="text-muted mt-2 mb-4">Your doctor account is waiting for admin approval.</p>
          <Link to="/doctor/login" className="btn btn-primary">Back to Doctor Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 className="text-center mb-1">Create Doctor Account</h2>
        <p className="text-center text-muted mb-4">Join MediCare as a healthcare professional.</p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form className="grid-2" onSubmit={handleSubmit}>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Dr. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="doctor@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              placeholder="+91 9876543210"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Department</label>
            <select
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
            </select>
          </div>
          <div className="input-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Cardiologist"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Qualification</label>
            <input
              type="text"
              name="qualification"
              placeholder="e.g. MBBS, MD"
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="experienceYears"
              placeholder="e.g. 5"
              value={formData.experienceYears}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating Doctor Account...' : 'Create Doctor Account'}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link to="/doctor/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}
