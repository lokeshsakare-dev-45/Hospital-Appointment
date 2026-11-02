import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppointmentDetails from '../components/AppointmentDetails';
import { patientService } from '../services/api';

export default function AppointmentHistory() {
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    async function loadAppointments() {
      if (!patientId) {
        setLoading(false);
        return;
      }
      try {
        const data = await patientService.getAppointments(patientId);
        // Requirement 3: "Display completed, cancelled and past appointments in Appointment History."
        const todayStr = new Date().toISOString().split('T')[0];
        const historyApps = (data || []).filter(app => {
          const status = (app.status || '').toUpperCase();
          const isFinished = status === 'COMPLETED' || status === 'CANCELLED' || status === 'REJECTED';
          const isPastDate = app.appointmentDate && app.appointmentDate < todayStr;
          return isFinished || isPastDate;
        });
        setAppointments(historyApps);
      } catch (err) {
        console.error('Failed to load appointment history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, [patientId]);

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'COMPLETED':
        return <span className="badge completed">🔵 Completed</span>;
      case 'CANCELLED':
        return <span className="badge cancelled">⚪ Cancelled</span>;
      case 'REJECTED':
        return <span className="badge rejected">🔴 Rejected</span>;
      case 'APPROVED':
        return <span className="badge approved">🟢 Approved</span>;
      case 'PENDING':
        return <span className="badge pending">🟡 Pending</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filterStatus === 'All') return true;
    return (app.status || '').toUpperCase() === filterStatus.toUpperCase();
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
          <h1 className="mb-1">Appointment History</h1>
          <p className="text-muted">Completed, cancelled, and past hospital consultations.</p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="input-group" style={{ marginBottom: 0 }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="All">All History ({appointments.length})</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <Link to="/patient/my-appointments" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
            &larr; Active Appointments
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-5">
          <p className="text-muted">Loading appointment history...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card text-center py-5">
          <h3>No Past Appointment History</h3>
          <p className="text-muted mt-1 mb-4">
            {filterStatus === 'All'
              ? 'You do not have any completed or past appointments in your record.'
              : `No appointments matching "${filterStatus}".`}
          </p>
          <Link to="/find-doctor" className="btn btn-primary">Book New Appointment</Link>
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
              {filteredAppointments.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '600' }}>{app.doctor?.name || 'Dr. Assigned'}</td>
                  <td className="text-muted">{app.doctor?.department?.name || 'Consultation'}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <button
                      onClick={() => setSelectedAppt(app)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.875rem' }}
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
