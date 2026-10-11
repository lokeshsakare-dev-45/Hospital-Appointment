import { useState, useEffect } from 'react';
import AppointmentDetails from '../components/AppointmentDetails';
import { patientService, appointmentService } from '../services/api';

export default function MyAppointments() {
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientId = localStorage.getItem('userId');

  const loadAppointments = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      const data = await patientService.getAppointments(patientId);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [patientId]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancelAppointment(id);
      await loadAppointments();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch(s) {
      case 'PENDING': return <span className="badge pending">🟡 Pending</span>;
      case 'APPROVED': return <span className="badge approved">🟢 Approved</span>;
      case 'RESCHEDULED': return <span className="badge warning">🟠 Rescheduled</span>;
      case 'CANCELLED': return <span className="badge danger">🔴 Cancelled</span>;
      case 'COMPLETED': return <span className="badge approved">✅ Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      {selectedAppt && (
        <AppointmentDetails
          appointment={{
            doc: selectedAppt.doctor?.name || 'Doctor',
            dept: selectedAppt.doctor?.department?.name || 'Department',
            date: selectedAppt.appointmentDate,
            time: selectedAppt.appointmentTime,
            status: selectedAppt.status,
            reason: selectedAppt.reasonForVisit,
          }}
          onClose={() => setSelectedAppt(null)}
        />
      )}

      <h1 className="mb-4">My Appointments</h1>
      <p className="text-muted mb-4">View your current and upcoming appointments.</p>

      {loading ? (
        <p className="text-muted">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">You have no appointments yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500' }}>{app.doctor?.name || 'Dr. Assigned'}</td>
                  <td className="text-muted">{app.doctor?.department?.name || 'Consultation'}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedAppt(app)} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>View Details</button>
                      {app.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancel(app.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
