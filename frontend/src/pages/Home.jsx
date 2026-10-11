import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, Activity } from 'lucide-react';
import LoginPopup from '../components/LoginPopup';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleBookClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (isLoggedIn && role === 'patient') {
      navigate('/find-doctor');
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}
      
      <section style={{ padding: '6rem 2rem', display: 'flex', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.1 }}>
            Find the Right Doctor.<br/>
            Book Your Appointment Easily.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Search doctors, choose a convenient time and manage your hospital appointments in one simple place.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/find-doctor" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>Find a Doctor</Link>
            <button onClick={handleBookClick} className="btn btn-secondary" style={{ fontSize: '1.1rem' }}>Book an Appointment</button>
          </div>
        </div>
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '400px', height: '400px', backgroundColor: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
             <Activity size={150} />
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div className="container">
          <div className="grid-3">
            <div className="card text-center">
              <Search size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
              <h3>Find Doctors</h3>
              <p className="text-muted mt-1">Search doctors by department and specialization.</p>
            </div>
            <div className="card text-center">
              <Calendar size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
              <h3>Easy Booking</h3>
              <p className="text-muted mt-1">Choose your preferred date and available time.</p>
            </div>
            <div className="card text-center">
              <Activity size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
              <h3>Appointment Tracking</h3>
              <p className="text-muted mt-1">Know whether your appointment is pending, approved or completed.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-main)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>How MediCare Works</h2>
          <div className="grid-4">
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>1</div>
              <h4>Create Account</h4>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>2</div>
              <h4>Find Doctor</h4>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>3</div>
              <h4>Book Appointment</h4>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>4</div>
              <h4>Get Confirmation</h4>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-muted)' }}>
        <p>&copy; 2026 MediCare. All rights reserved.</p>
      </footer>
    </div>
  );
}
