import { useState, useEffect } from 'react';
import { doctorService } from '../services/api';

export default function DoctorMyAppointments() {
  const doctorId = localStorage.getItem('userId');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      if (!doctorId) {
        setLoading(false);
        return;
      }
      try {
        const data = await doctorService.getAppointments(doctorId);
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load doctor appointments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, [doctorId]);

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch(s) {
      case 'PENDING': return <span className="badge pending">Pending</span>;
      case 'APPROVED': return <span className="badge approved">Approved</span>;
      case 'REJECTED': return <span className="badge danger">Rejected</span>;
      case 'CANCELLED': return <span className="badge danger">Cancelled</span>;
      case 'COMPLETED': return <span className="badge approved">Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <h1 className="mb-4">My Appointments</h1>
      <p className="text-muted mb-4">Complete appointment list and management.</p>

      {loading ? (
        <p className="text-muted">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No appointments found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500' }}>{app.patient?.name || 'Patient'}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <button
                      onClick={() => alert(`Patient: ${app.patient?.name}\nEmail: ${app.patient?.email}\nMobile: ${app.patient?.mobile || 'N/A'}\nReason: ${app.reasonForVisit}`)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                    >
                      View Details
                    </button>
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
