import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle, Clock, AlertCircle, Award, Stethoscope, Phone, Mail } from 'lucide-react';
import { doctorService, appointmentService } from '../services/api';

export default function DoctorDashboard() {
  const doctorName = localStorage.getItem('userName') || 'Doctor';
  const doctorEmail = localStorage.getItem('userEmail') || '';
  const doctorId = localStorage.getItem('userId');

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingRequests: 0,
    totalPatients: 0,
    completedAppointments: 0,
    remainingPatients: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadDashboardData = async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Doctor Profile
      try {
        const profileData = await doctorService.getDoctor(doctorId);
        setDoctorProfile(profileData);
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      }

      // 2. Fetch Doctor Stats
      try {
        const statsData = await doctorService.getStats(doctorId);
        // Calculate remaining: pending + approved today appointments
        setStats(prev => ({
          ...prev,
          todayAppointments: statsData.todayAppointments || 0,
          pendingRequests: statsData.pendingRequests || 0,
          totalPatients: statsData.totalPatients || 0,
          completedAppointments: statsData.completed || 0,
        }));
      } catch (err) {
        console.error('Failed to load doctor stats:', err);
      }

      // 3. Fetch Doctor Appointments
      try {
        const appts = await doctorService.getAppointments(doctorId);
        setAppointments(appts || []);

        const remaining = (appts || []).filter(a => a.status === 'PENDING' || a.status === 'APPROVED').length;
        setStats(prev => ({ ...prev, remainingPatients: remaining }));
      } catch (err) {
        console.error('Failed to load doctor appointments:', err);
      }

      // 4. Fetch Pending Requests
      try {
        const reqs = await doctorService.getRequests(doctorId);
        setPendingRequests(reqs || []);
      } catch (err) {
        console.error('Failed to load doctor requests:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [doctorId]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, newStatus);
      setActionMessage(`Appointment #${appointmentId} marked as ${newStatus}`);
      setTimeout(() => setActionMessage(''), 4000);
      await loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update appointment status');
    }
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
      {/* Action Notification */}
      {actionMessage && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontWeight: '500' }}>
          ✓ {actionMessage}
        </div>
      )}

      {/* Doctor Profile Header Banner */}
      <div className="card mb-4" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', flexShrink: 0 }}>
              👨‍⚕️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{doctorProfile?.name || doctorName}</h1>
                <span className="badge approved" style={{ fontSize: '0.75rem' }}>
                  {doctorProfile?.status || 'APPROVED'}
                </span>
              </div>
              <p style={{ color: 'var(--primary-color)', fontWeight: '600', marginTop: '0.25rem' }}>
                {doctorProfile?.specialization || 'Clinical Specialist'} &bull; {doctorProfile?.department?.name || 'MediCare Hospital'}
              </p>
              <div className="flex gap-4 mt-2 text-muted" style={{ fontSize: '0.875rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> {doctorProfile?.email || doctorEmail}
                </span>
                {doctorProfile?.mobile && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} /> {doctorProfile.mobile}
                  </span>
                )}
                {doctorProfile?.experienceYears && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Award size={14} /> {doctorProfile.experienceYears} Years Experience
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <Link to="/doctor/schedule" className="btn btn-secondary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.875rem' }}>
              My Availability
            </Link>
            <Link to="/doctor/profile" className="btn btn-primary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.875rem' }}>
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-4 mb-4">
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Today's Appointments</p>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--primary-color)' }}>{stats.todayAppointments}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled for today</span>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Pending Requests</p>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--warning)' }}>{stats.pendingRequests}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting your review</span>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Active/Remaining</p>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--info)' }}>{stats.remainingPatients}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending + Approved slots</span>
        </div>
        <div className="card text-center" style={{ padding: '1.5rem' }}>
          <p className="text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Patients</p>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--success)' }}>{stats.totalPatients}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distinct patients treated</span>
        </div>
      </div>

      {/* Pending Appointment Requests Quick Review Section */}
      {pendingRequests.length > 0 && (
        <div className="card mb-4" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--warning)" />
              Pending Appointment Requests ({pendingRequests.length})
            </h3>
            <Link to="/doctor/appointment-requests" style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: '600' }}>
              View All Requests &rarr;
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason for Visit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.slice(0, 3).map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: '600' }}>{req.patient?.name || 'Patient'}</td>
                    <td>{req.appointmentDate}</td>
                    <td>{req.appointmentTime}</td>
                    <td className="text-muted">{req.reasonForVisit || 'General Consultation'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments List with Patient Details */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 style={{ fontSize: '1.35rem' }}>Doctor's Appointments & Patients</h2>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>View upcoming and past patient consultation records.</p>
        </div>
        <Link to="/doctor/my-appointments" className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.4rem 0.9rem' }}>
          View Full List
        </Link>
      </div>

      {loading ? (
        <div className="card text-center py-5">
          <p className="text-muted">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-5">
          <Stethoscope size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No Appointments Scheduled</h3>
          <p className="text-muted mt-1">When patients book consultations with you, they will appear here.</p>
        </div>
      ) : (
        <div className="table-container mb-4">
          <table>
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 8).map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{app.patient?.name || 'Patient'}</div>
                    <small className="text-muted">ID: #{app.patient?.id || app.id}</small>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{app.patient?.email || 'N/A'}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{app.patient?.mobile || 'No Mobile'}</div>
                  </td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {app.reasonForVisit || 'Regular checkup'}
                  </td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAppointment(app)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
                      >
                        Details
                      </button>
                      {app.status === 'APPROVED' && (
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
                          title="Mark consultation as completed"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', backgroundColor: 'white' }}>
            <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3>Patient Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-muted)', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div className="grid-2 gap-2 mb-3">
              <div>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Patient Name</p>
                <p style={{ fontWeight: '600' }}>{selectedAppointment.patient?.name}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Appointment Status</p>
                <div>{getStatusBadge(selectedAppointment.status)}</div>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Patient Email</p>
                <p style={{ fontWeight: '500' }}>{selectedAppointment.patient?.email}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Patient Mobile</p>
                <p style={{ fontWeight: '500' }}>{selectedAppointment.patient?.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Appointment Date</p>
                <p style={{ fontWeight: '500' }}>{selectedAppointment.appointmentDate}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Appointment Time</p>
                <p style={{ fontWeight: '500' }}>{selectedAppointment.appointmentTime}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-muted" style={{ fontSize: '0.8125rem' }}>Reason for Consultation / Symptoms</p>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: '6px', marginTop: '0.25rem' }}>
                {selectedAppointment.reasonForVisit || 'No description provided.'}
              </div>
            </div>

            <div className="flex justify-between items-center">
              {selectedAppointment.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button onClick={() => { handleUpdateStatus(selectedAppointment.id, 'APPROVED'); setSelectedAppointment(null); }} className="btn btn-success" style={{ fontSize: '0.875rem' }}>Approve</button>
                  <button onClick={() => { handleUpdateStatus(selectedAppointment.id, 'REJECTED'); setSelectedAppointment(null); }} className="btn btn-danger" style={{ fontSize: '0.875rem' }}>Reject</button>
                </div>
              )}
              {selectedAppointment.status === 'APPROVED' && (
                <button onClick={() => { handleUpdateStatus(selectedAppointment.id, 'COMPLETED'); setSelectedAppointment(null); }} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Mark as Completed</button>
              )}
              <button onClick={() => setSelectedAppointment(null)} className="btn btn-secondary" style={{ marginLeft: 'auto', fontSize: '0.875rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
