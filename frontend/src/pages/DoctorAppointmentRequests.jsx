import { useState, useEffect } from 'react';
import { doctorService, appointmentService } from '../services/api';

export default function DoctorAppointmentRequests() {
  const doctorId = localStorage.getItem('userId');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    try {
      const data = await doctorService.getRequests(doctorId);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load doctor requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [doctorId]);

  const handleAction = async (id, newStatus) => {
    try {
      await appointmentService.updateStatus(id, newStatus.toUpperCase());
      await loadRequests();
    } catch (err) {
      alert(err.message || 'Failed to update appointment status');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Appointment Requests</h1>

      {loading ? (
        <p className="text-muted">Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No pending appointment requests.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td style={{ fontWeight: '500' }}>{req.patient?.name || 'Patient'}</td>
                  <td>{req.appointmentDate}</td>
                  <td>{req.appointmentTime}</td>
                  <td>{req.reasonForVisit}</td>
                  <td>
                    {req.status === 'PENDING' && <span className="badge pending">Pending</span>}
                    {req.status === 'APPROVED' && <span className="badge approved">✓ Approved</span>}
                    {req.status === 'REJECTED' && <span className="badge rejected">✕ Rejected</span>}
                  </td>
                  <td>
                    {req.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(req.id, 'APPROVED')} className="btn btn-success" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Approve</button>
                        <button onClick={() => handleAction(req.id, 'REJECTED')} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Reject</button>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
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
