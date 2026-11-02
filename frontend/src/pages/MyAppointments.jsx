import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppointmentDetails from '../components/AppointmentDetails';
import { patientService, appointmentService } from '../services/api';

export default function MyAppointments() {
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const patientId = localStorage.getItem('userId');

  const loadAppointments = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    try {
      const data = await patientService.getAppointments(patientId);
      // Filter for current and upcoming appointments (PENDING, APPROVED, RESCHEDULED)
      const currentAndUpcoming = (data || []).filter(
        a => a.status === 'PENDING' || a.status === 'APPROVED' || a.status === 'RESCHEDULED'
      );
      setAppointments(currentAndUpcoming);
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
    switch (s) {
      case 'PENDING':
        return <span className="badge pending">🟡 Pending</span>;
      case 'APPROVED':
        return <span className="badge approved">🟢 Approved</span>;
      case 'RESCHEDULED':
        return <span className="badge warning">🟠 Rescheduled</span>;
      case 'CANCELLED':
        return <span className="badge cancelled">⚪ Cancelled</span>;
      case 'COMPLETED':
        return <span className="badge completed">🔵 Completed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const filtered = appointments.filter(a => {
    if (filterStatus === 'ALL') return true;
    return (a.status || '').toUpperCase() === filterStatus;
  });

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

      <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="mb-1">My Appointments</h1>
          <p className="text-muted">Current and upcoming doctor appointments.</p>
        </div>

        <div className="flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="ALL">All Current ({appointments.length})</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved / Confirmed</option>
            </select>
          </div>
          <Link to="/patient/appointment-history" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
            View Past History &rarr;
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-5">
          <p className="text-muted">Loading your appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-5">
          <h3>No Active Appointments Found</h3>
          <p className="text-muted mt-1 mb-4">
            {filterStatus === 'ALL'
              ? 'You do not have any pending or upcoming appointments.'
              : `No appointments matching "${filterStatus}" status.`}
          </p>
          <div className="flex justify-center gap-2">
            <Link to="/find-doctor" className="btn btn-primary">Find a Doctor & Book Now</Link>
            <Link to="/patient/appointment-history" className="btn btn-secondary">Check Appointment History</Link>
          </div>
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
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '600' }}>{app.doctor?.name || 'Dr. Assigned'}</td>
                  <td className="text-muted">{app.doctor?.department?.name || 'General Consultation'}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAppt(app)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.875rem' }}
                      >
                        View Details
                      </button>
                      {app.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancel(app.id)}
                          className="btn btn-danger"
                          style={{
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.875rem',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--danger)',
                            color: 'var(--danger)',
                          }}
                        >
                          Cancel
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
