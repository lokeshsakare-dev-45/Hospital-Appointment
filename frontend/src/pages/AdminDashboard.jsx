import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingApprovals: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, pendingData, recentData] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingDoctors(),
        adminService.getRecentAppointments(),
      ]);
      // Map backend field names to what the UI expects
      setStats({
        totalPatients: statsData.totalPatients || 0,
        totalDoctors: statsData.totalDoctors || 0,
        totalAppointments: statsData.totalAppointments || 0,
        pendingApprovals: statsData.pendingDoctors || 0,
      });
      setPendingDoctors(pendingData);
      setRecentAppointments(recentData);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveDoctor(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to approve doctor');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectDoctor(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to reject doctor');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4" style={{ flexWrap: 'wrap' }}>
        <h1 className="mb-1">Admin Dashboard</h1>
        <p className="text-muted">System Overview</p>
      </div>

      <div className="grid-4 mb-4">
        <div className="card text-center">
          <p className="text-muted mb-1">Total Patients</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{stats.totalPatients}</h2>
        </div>
        <div className="card text-center">
          <p className="text-muted mb-1">Total Doctors</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--info)' }}>{stats.totalDoctors}</h2>
        </div>
        <div className="card text-center">
          <p className="text-muted mb-1">Total Appointments</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>{stats.totalAppointments}</h2>
        </div>
        <div className="card text-center">
          <p className="text-muted mb-1">Pending Approvals</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--warning)' }}>{stats.pendingApprovals}</h2>
        </div>
      </div>

      <h3 className="mb-2">Pending Doctor Approvals</h3>
      <div className="table-container mb-4">
        {pendingDoctors.length === 0 ? (
          <div className="card text-center py-4">
            <p className="text-muted">No pending doctor approvals.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: '500' }}>{doc.name}</td>
                  <td className="text-muted">{doc.department?.name || 'General'}</td>
                  <td>{doc.experienceYears || 0} Years</td>
                  <td><span className="badge pending">{doc.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => alert(`Doctor: ${doc.name}\nEmail: ${doc.email}\nSpecialization: ${doc.specialization}`)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>View</button>
                      <button onClick={() => handleApprove(doc.id)} className="btn btn-success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Approve</button>
                      <button onClick={() => handleReject(doc.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid-2 gap-4">
        <div>
          <h3 className="mb-2">Recent Appointments</h3>
          <div className="card">
            {recentAppointments.length === 0 ? (
              <p className="text-muted">No appointments found.</p>
            ) : (
              recentAppointments.map((app, idx) => (
                <div
                  key={app.id}
                  className="flex justify-between items-center mb-3 pb-3"
                  style={{ borderBottom: idx < recentAppointments.length - 1 ? '1px solid var(--border-color)' : 'none' }}
                >
                  <div>
                    <p className="font-medium">{app.patient?.name || 'Patient'}</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>with {app.doctor?.name || 'Doctor'}</p>
                  </div>
                  <span className={`badge ${app.status?.toLowerCase()}`}>{app.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2">System Activity</h3>
          <div className="card">
            <div className="flex gap-2 items-start mb-4">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)', marginTop: '6px' }}></div>
              <div>
                <p className="font-medium">System Online & Connected</p>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Spring Boot + MySQL Active</p>
              </div>
            </div>
            <div className="flex gap-2 items-start mb-4">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', marginTop: '6px' }}></div>
              <div>
                <p className="font-medium">Database Synced</p>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>REST API communication verified</p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--warning)', marginTop: '6px' }}></div>
              <div>
                <p className="font-medium">Secure Session Authentication</p>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Role-based access active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
