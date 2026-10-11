import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginPopup from '../components/LoginPopup';
import { doctorService } from '../services/api';

export default function DoctorProfile() {
  const [showPopup, setShowPopup] = useState(false);
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('id') || '1';
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDoctor() {
      try {
        const data = await doctorService.getDoctor(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId]);

  const handleBookClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (isLoggedIn && role === 'patient') {
      navigate(`/book-appointment?doctorId=${doctor?.id || doctorId}`);
    } else {
      setShowPopup(true);
    }
  };

  const docName = doctor?.name || 'Dr. Rahul Sharma';
  const docSpecialization = doctor?.specialization || 'Cardiologist';
  const docDepartment = doctor?.department?.name || 'Cardiology Department';
  const docExperience = doctor?.experienceYears || 8;
  const docDescription = doctor?.department?.description || `Dr. ${docName} is a highly skilled healthcare specialist with over ${docExperience} years of experience in patient care.`;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}

      <div className="card mb-4">
        <div className="flex gap-4 items-center" style={{ flexWrap: 'wrap' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👨‍⚕️</div>
          <div>
            <h1>{docName}</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '500' }}>{docSpecialization}</p>
            <p className="text-muted">{docDepartment}</p>
            <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{docExperience} Years Experience</span>
              <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>Status: {doctor?.status || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 gap-4">
        <div className="card">
          <h3 className="mb-2">About Doctor</h3>
          <p className="text-muted">{docDescription}</p>
        </div>

        <div className="card">
          <h3 className="mb-2">Availability</h3>
          <div className="mb-3">
            <p className="font-medium mb-1">Available Days</p>
            <div className="flex gap-2 flex-wrap">
              {doctor?.schedules && doctor.schedules.length > 0 ? (
                doctor.schedules.map((s, idx) => (
                  <span key={idx} className="badge active">{s.dayOfWeek}</span>
                ))
              ) : (
                <>
                  <span className="badge active">Monday</span>
                  <span className="badge active">Wednesday</span>
                  <span className="badge active">Friday</span>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="font-medium mb-1">Available Time</p>
            <p className="text-muted">
              {doctor?.schedules && doctor.schedules.length > 0
                ? `${doctor.schedules[0].startTime} - ${doctor.schedules[0].endTime}`
                : '10:00 AM – 1:00 PM'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button onClick={handleBookClick} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.25rem' }}>Book Appointment</button>
      </div>
    </div>
  );
}
