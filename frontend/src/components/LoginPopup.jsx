import { Link } from 'react-router-dom';

export default function LoginPopup({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="card text-center" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white' }}>
        <h2 className="mb-2">Login Required</h2>
        <p className="text-muted mb-4">Please login as a patient to book an appointment.</p>
        
        <Link to="/patient/login" className="btn btn-primary mb-3" style={{ width: '100%' }}>Patient Login</Link>
        
        <div className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>Don't have a patient account?</div>
        <Link to="/register/patient" className="btn btn-secondary mb-4" style={{ width: '100%' }}>Create Patient Account</Link>
        
        <button onClick={onClose} className="btn" style={{ width: '100%', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)' }}>Cancel</button>
      </div>
    </div>
  );
}
