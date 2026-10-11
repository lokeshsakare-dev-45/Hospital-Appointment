import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LoginPopup from '../components/LoginPopup';
import { doctorService, appointmentService } from '../services/api';

export default function BookAppointment() {
  const [submitted, setSubmitted] = useState(false);
  const [showPopup] = useState(() => localStorage.getItem('isLoggedIn') !== 'true');
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') || '1';
  const [doctor, setDoctor] = useState(null);

  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadDoctor() {
      try {
        const data = await doctorService.getDoctor(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error('Failed to load doctor:', err);
      }
    }
    loadDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const patientId = localStorage.getItem('userId');
    if (!patientId) {
      setError('Please log in as a patient to book an appointment.');
      return;
    }

    setLoading(true);
    try {
      // Format appointmentTime to HH:mm:ss if in "10:00 AM" format
      let formattedTime = appointmentTime;
      if (appointmentTime.includes('AM') || appointmentTime.includes('PM')) {
        const [time, modifier] = appointmentTime.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') {
          hours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === 'AM' && hours === '12') {
          hours = '00';
        }
        formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
      } else if (formattedTime.length === 5) {
        formattedTime = `${formattedTime}:00`;
      }

      await appointmentService.bookAppointment({
        patientId: parseInt(patientId, 10),
        doctorId: parseInt(doctorId, 10),
        appointmentDate,
        appointmentTime: formattedTime,
        reasonForVisit,
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showPopup) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <LoginPopup onClose={() => navigate('/')} />
      </div>
    );
  }

  const docName = doctor?.name || 'Dr. Rahul Sharma';
  const docDept = doctor?.department?.name || 'Cardiology';

  if (submitted) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '500px', padding: '3rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✓</div>
          <h2 className="mb-2">Appointment Request Sent</h2>
          <p className="text-muted mb-3">Your appointment request has been sent to {docName}.</p>
          <div className="mb-4">
            Status: <span className="badge pending">Pending</span>
          </div>
          <Link to="/patient/my-appointments" className="btn btn-primary">View My Appointments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1 className="mb-4 text-center">Book Your Appointment</h1>

      <div className="card mb-4" style={{ backgroundColor: 'var(--primary-light)', border: 'none' }}>
        <h3 className="mb-1">{docName}</h3>
        <p className="text-muted">{docDept}</p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Select Date</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Select Available Time</label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            >
              <option value="">Choose Time</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="03:00 PM">03:00 PM</option>
            </select>
          </div>
          <div className="input-group">
            <label>Reason for Visit</label>
            <textarea
              rows="3"
              placeholder="Briefly describe your symptoms"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Booking Appointment...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
