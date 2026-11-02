import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Search, Activity, User, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { patientService, departmentService } from '../services/api';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Patient';
  const userEmail = localStorage.getItem('userEmail') || '';
  const patientId = localStorage.getItem('userId');

  const [patientProfile, setPatientProfile] = useState(null);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, cancelled: 0 });
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchDoctor, setSearchDoctor] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!patientId) {
        setLoading(false);
        return;
      }
      try {
        // 1. Fetch Patient Profile
        try {
          const profile = await patientService.getProfile(patientId);
          setPatientProfile(profile);
        } catch (err) {
          console.error('Error fetching patient profile:', err);
        }

        // 2. Fetch Patient Stats
        try {
          const statsData = await patientService.getStats(patientId);
          setStats({
            upcoming: statsData.upcomingAppointments || 0,
            completed: statsData.completedAppointments || 0,
            cancelled: statsData.cancelledAppointments || 0,
          });
        } catch (err) {
          console.error('Error fetching patient stats:', err);
        }

        // 3. Fetch Patient Appointments
        try {
          const apps = await patientService.getAppointments(patientId);
          if (apps && apps.length > 0) {
            setRecentAppointments(apps);
            const upcoming = apps.find(a => a.status === 'PENDING' || a.status === 'APPROVED');
            setUpcomingAppointment(upcoming || apps[0]);
          }
        } catch (err) {
          console.error('Error fetching patient appointments:', err);
        }

        // 4. Fetch Departments for Doctor Search
        try {
          const depts = await departmentService.getDepartments();
          setDepartments(depts || []);
        } catch (err) {
          console.error('Error fetching departments:', err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [patientId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDoctor.trim()) params.append('search', searchDoctor.trim());
    if (selectedDept) params.append('departmentId', selectedDept);
    navigate(`/find-doctor${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PENDING':
        return <span className="badge pending">🟡 Pending</span>;
      case 'APPROVED':
        return <span className="badge approved">🟢 Approved</span>;
      case 'COMPLETED':
        return <span className="badge completed">🔵 Completed</span>;
      case 'CANCELLED':
        return <span className="badge cancelled">⚪ Cancelled</span>;
      case 'REJECTED':
        return <span className="badge rejected">🔴 Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      {/* Patient Profile Card */}
      <div className="card mb-4" style={{ backgroundColor: '#ffffff', padding: '1.75rem' }}>
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
              🧑
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>
                  Welcome, {patientProfile?.name || userName}
                </h1>
                <span className="badge approved" style={{ fontSize: '0.75rem' }}>Active Patient</span>
              </div>
              <p className="text-muted mt-1" style={{ fontSize: '0.95rem' }}>
                MediCare Patient ID: #{patientId || 'N/A'}
              </p>
              <div className="flex gap-4 mt-2 text-muted" style={{ fontSize: '0.875rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> {patientProfile?.email || userEmail}
                </span>
                {patientProfile?.mobile && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} /> {patientProfile.mobile}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center card" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-main)', minWidth: '90px' }}>
              <h3 style={{ color: 'var(--primary-color)', fontSize: '1.75rem' }}>{stats.upcoming}</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Upcoming</p>
            </div>
            <div className="text-center card" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-main)', minWidth: '90px' }}>
              <h3 style={{ color: 'var(--success)', fontSize: '1.75rem' }}>{stats.completed}</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Completed</p>
            </div>
            <div className="text-center card" style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-main)', minWidth: '90px' }}>
              <h3 style={{ color: 'var(--danger)', fontSize: '1.75rem' }}>{stats.cancelled}</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Doctors Card */}
      <div className="card mb-4" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem' }}>
          Find a Doctor & Book Appointment
        </h3>
        <form onSubmit={handleSearchSubmit} className="grid-3" style={{ alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'white', fontSize: '0.875rem' }}>Doctor Name / Specialty</label>
            <input
              type="text"
              placeholder="Search by doctor name or specialty"
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
              style={{ border: 'none', backgroundColor: 'white', color: 'var(--text-main)' }}
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ color: 'white', fontSize: '0.875rem' }}>Clinical Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ border: 'none', backgroundColor: 'white', color: 'var(--text-main)' }}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="btn"
              style={{ backgroundColor: 'white', color: 'var(--primary-color)', width: '100%', fontWeight: '600' }}
            >
              Search Doctors
            </button>
          </div>
        </form>
      </div>

      {/* Upcoming Appointment Section */}
      <div className="flex justify-between items-center mb-2">
        <h3 style={{ fontSize: '1.25rem' }}>Upcoming Appointment</h3>
        <Link to="/patient/my-appointments" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: '600' }}>
          My Appointments &rarr;
        </Link>
      </div>

      {upcomingAppointment ? (
        <div className="card mb-4" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem' }}>{upcomingAppointment.doctor?.name || 'Assigned Doctor'}</h4>
              <p style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
                {upcomingAppointment.doctor?.specialization || 'Clinical Consultation'} &bull; {upcomingAppointment.doctor?.department?.name || 'General Medicine'}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>📅 {upcomingAppointment.appointmentDate}</div>
                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>⏰ {upcomingAppointment.appointmentTime}</div>
              </div>
              {upcomingAppointment.reasonForVisit && (
                <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
                  Reason: {upcomingAppointment.reasonForVisit}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="mb-2">
                {getStatusBadge(upcomingAppointment.status)}
              </div>
              <div>
                <Link to="/patient/my-appointments" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                  Manage Appointments
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-4 text-center py-4">
          <p className="text-muted mb-3">You have no upcoming appointments scheduled right now.</p>
          <Link to="/find-doctor" className="btn btn-primary">Find a Doctor & Book Now</Link>
        </div>
      )}

      {/* Recent Appointments List */}
      {recentAppointments.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 style={{ fontSize: '1.25rem' }}>Recent Consultations</h3>
            <Link to="/patient/appointment-history" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: '600' }}>
              Full History &rarr;
            </Link>
          </div>
          <div className="table-container mb-4">
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.slice(0, 5).map(app => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: '600' }}>{app.doctor?.name || 'Doctor'}</td>
                    <td className="text-muted">{app.doctor?.department?.name || 'General'}</td>
                    <td>{app.appointmentDate}</td>
                    <td>{app.appointmentTime}</td>
                    <td>{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
