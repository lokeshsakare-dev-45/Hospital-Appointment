import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../services/api';

export default function PatientDashboard() {
  const userName = localStorage.getItem('userName') || 'Patient';
  const patientId = localStorage.getItem('userId');
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, cancelled: 0 });
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!patientId) {
        setLoading(false);
        return;
      }
      try {
        const statsData = await patientService.getStats(patientId);
        // Backend returns: totalAppointments, upcomingAppointments, completedAppointments
        setStats({
          upcoming: statsData.upcomingAppointments || 0,
          completed: statsData.completedAppointments || 0,
          cancelled: statsData.cancelledAppointments || 0,
        });

        const apps = await patientService.getAppointments(patientId);
        if (apps && apps.length > 0) {
          // Find first upcoming or pending
          const upcoming = apps.find(a => a.status === 'PENDING' || a.status === 'APPROVED');
          setUpcomingAppointment(upcoming || apps[0]);
        }
      } catch (err) {
        console.error('Error loading patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [patientId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap' }}>
        <div>
          <h1 className="mb-1">Good Day, {userName}</h1>
          <p className="text-muted mb-4">Find a doctor and book your next appointment.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <h3 style={{ color: 'var(--primary-color)' }}>{stats.upcoming}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Upcoming</p>
          </div>
          <div className="text-center">
            <h3 style={{ color: 'var(--success)' }}>{stats.completed}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Completed</p>
          </div>
          <div className="text-center">
            <h3 style={{ color: 'var(--danger)' }}>{stats.cancelled}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Cancelled</p>
          </div>
        </div>
      </div>

      <div className="card mb-4" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div className="grid-3" style={{ alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'white' }}>Search Doctor</label>
            <input type="text" placeholder="Search doctor by name or specialization" style={{ border: 'none' }} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'white' }}>Department</label>
            <select style={{ border: 'none', color: 'black' }}>
              <option>All Departments</option>
              <option>Cardiology</option>
              <option>General Medicine</option>
              <option>Orthopedics</option>
            </select>
          </div>
          <div>
            <Link to="/find-doctor" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary-color)', width: '100%', textAlign: 'center', display: 'block' }}>Search</Link>
          </div>
        </div>
      </div>

      <h3 className="mb-2">Upcoming Appointment</h3>
      {upcomingAppointment ? (
        <div className="card mb-4">
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem' }}>{upcomingAppointment.doctor?.name || 'Assigned Doctor'}</h4>
              <p className="text-muted">{upcomingAppointment.doctor?.specialization || 'Consultation'}</p>
              <div className="flex items-center gap-4 mt-2">
                <div style={{ fontWeight: '500' }}>📅 {upcomingAppointment.appointmentDate}</div>
                <div style={{ fontWeight: '500' }}>⏰ {upcomingAppointment.appointmentTime}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`badge ${upcomingAppointment.status?.toLowerCase()} mb-2`}>
                {upcomingAppointment.status}
              </div>
              <br />
              <div>
                <Link to="/patient/my-appointments" className="btn btn-secondary">View Appointment</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-4 text-center py-4">
          <p className="text-muted mb-3">No upcoming appointments scheduled.</p>
          <Link to="/find-doctor" className="btn btn-primary">Find a Doctor & Book Now</Link>
        </div>
      )}
    </div>
  );
}
