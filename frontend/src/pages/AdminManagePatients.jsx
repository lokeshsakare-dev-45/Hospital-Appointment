import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function AdminManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await adminService.getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Manage Patients</h1>

      {loading ? (
        <p className="text-muted">Loading patients...</p>
      ) : patients.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No patients registered yet.</p>
        </div>
      ) : (
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
              {patients.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '500' }}>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.mobile || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => alert(`Patient: ${p.name}\nEmail: ${p.email}\nMobile: ${p.mobile || 'N/A'}\nAddress: ${p.address || 'N/A'}`)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                    >
                      View
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
