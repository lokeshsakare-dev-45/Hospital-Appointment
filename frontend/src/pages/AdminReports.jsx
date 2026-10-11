import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export default function AdminReports() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load report stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <p className="text-muted">Loading reports...</p>;

  return (
    <div>
      <h1 className="mb-4">Reports</h1>

      <div className="grid-3 mb-4">
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
      </div>

      <div className="card mb-4">
        <h3 className="mb-4">Appointment Status Summary</h3>
        <div className="grid-4 text-center">
          <div>
            <h4 style={{ color: 'var(--warning)', fontSize: '2rem' }}>{stats.pendingAppointments}</h4>
            <p className="text-muted">Pending</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--success)', fontSize: '2rem' }}>{stats.approvedAppointments}</h4>
            <p className="text-muted">Approved</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>{stats.activeDoctors}</h4>
            <p className="text-muted">Active Doctors</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--danger)', fontSize: '2rem' }}>{stats.pendingDoctors}</h4>
            <p className="text-muted">Pending Doctor Approvals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
