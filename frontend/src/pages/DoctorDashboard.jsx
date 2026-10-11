import { useState, useEffect } from 'react';
import { doctorService } from '../services/api';

export default function DoctorDashboard() {
  const doctorName = localStorage.getItem('userName') || 'Doctor';
  const doctorId = localStorage.getItem('userId');
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingRequests: 0,
    totalPatients: 0,
    completedAppointments: 0,
  });

  useEffect(() => {
    async function loadStats() {
      if (!doctorId) return;
      try {
        const data = await doctorService.getStats(doctorId);
        // Backend returns: todayAppointments, pendingRequests, totalPatients, completed
        setStats({
          todayAppointments: data.todayAppointments || 0,
          pendingRequests: data.pendingRequests || 0,
          totalPatients: data.totalPatients || 0,
          completedAppointments: data.completed || 0,
        });
      } catch (err) {
        console.error('Failed to load doctor stats:', err);
      }
    }
    loadStats();
  }, [doctorId]);

  return (
    <div>
      <h1 className="mb-4">Good Day, {doctorName}</h1>

      <div className="grid-4 mb-4">
        <div className="card">
          <p className="text-muted mb-1">Today's Appointments</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{stats.todayAppointments}</h2>
        </div>
        <div className="card">
          <p className="text-muted mb-1">Pending Requests</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--warning)' }}>{stats.pendingRequests}</h2>
        </div>
        <div className="card">
          <p className="text-muted mb-1">Total Patients</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--info)' }}>{stats.totalPatients}</h2>
        </div>
        <div className="card">
          <p className="text-muted mb-1">Completed</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>{stats.completedAppointments}</h2>
        </div>
      </div>
    </div>
  );
}
