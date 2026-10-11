import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function AdminManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      const data = await adminService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveDoctor(id);
      await loadDoctors();
    } catch (err) {
      alert(err.message || 'Failed to approve doctor');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectDoctor(id);
      await loadDoctors();
    } catch (err) {
      alert(err.message || 'Failed to reject doctor');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Manage Doctors</h1>

      {loading ? (
        <p className="text-muted">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <div className="card text-center py-5">
          <p className="text-muted">No doctors found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: '500' }}>{doc.name}</td>
                  <td>{doc.department?.name || 'General'}</td>
                  <td>{doc.experienceYears || 0} Years</td>
                  <td>
                    <span className={`badge ${doc.status?.toLowerCase()}`}>{doc.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {doc.status?.toUpperCase() === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(doc.id)} className="btn btn-success" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Approve</button>
                          <button onClick={() => handleReject(doc.id)} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Reject</button>
                        </>
                      )}
                      <button
                        onClick={() => alert(`Doctor: ${doc.name}\nEmail: ${doc.email}\nSpecialization: ${doc.specialization}\nQualification: ${doc.qualification || 'MBBS'}`)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                      >
                        View
                      </button>
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
