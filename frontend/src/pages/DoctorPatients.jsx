import { useState, useEffect } from 'react';
import { doctorService } from '../services/api';

export default function DoctorPatients() {
  const doctorId = localStorage.getItem('userId');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      if (!doctorId) {
        setLoading(false);
        return;
      }
      try {
        const data = await doctorService.getPatients(doctorId);
        setPatients(data);
      } catch (err) {
        console.error('Failed to load doctor patients:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, [doctorId]);

  return (
    <div>
      <h1 className="mb-4">My Patients</h1>

      {loading ? (
        <p className="text-muted">Loading patients...</p>
      ) : patients.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No patient records found yet.</p>
        </div>
      ) : !selectedPatient ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '500' }}>{p.name}</td>
                  <td className="text-muted">{p.email}</td>
                  <td>{p.mobile || 'N/A'}</td>
                  <td>
                    <button onClick={() => setSelectedPatient(p)} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
            <h2>Patient Details</h2>
            <button onClick={() => setSelectedPatient(null)} className="btn btn-secondary">Back to List</button>
          </div>

          <div className="grid-2 mb-4">
            <div>
              <p className="text-muted mb-1">Name</p>
              <h4 style={{ fontSize: '1.25rem' }}>{selectedPatient.name}</h4>
            </div>
            <div>
              <p className="text-muted mb-1">Email</p>
              <h4>{selectedPatient.email}</h4>
            </div>
            <div>
              <p className="text-muted mb-1">Mobile</p>
              <h4>{selectedPatient.mobile || 'N/A'}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
