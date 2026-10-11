import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function AdminAllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadAppointments = async (status) => {
    setLoading(true);
    try {
      const data = await adminService.getAllAppointments(status === 'All' ? '' : status);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load all appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(filterStatus);
  }, [filterStatus]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h1>All Appointments</h1>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="All">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No appointments found matching this filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '500' }}>{app.patient?.name || 'Patient'}</td>
                  <td>{app.doctor?.name || 'Doctor'}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td>
                    <span className={`badge ${app.status?.toLowerCase()}`}>{app.status}</span>
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
