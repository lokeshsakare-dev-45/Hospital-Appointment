import { useState, useEffect } from 'react';
import { doctorService } from '../services/api';

export default function DoctorProfileDocView() {
  const doctorName = localStorage.getItem('userName') || 'Doctor';
  const doctorEmail = localStorage.getItem('userEmail') || '';
  const doctorId = localStorage.getItem('userId');
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!doctorId) return;
      try {
        const data = await doctorService.getDoctor(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      }
    }
    loadProfile();
  }, [doctorId]);

  return (
    <div>
      <h1 className="mb-4">My Profile</h1>
      <div className="card mb-4">
        <div className="flex gap-4 items-center" style={{ flexWrap: 'wrap' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>👨‍⚕️</div>
          <div>
            <h2>{doctor?.name || doctorName}</h2>
            <p style={{ color: 'var(--primary-color)', fontWeight: '500' }}>{doctor?.specialization || ''}</p>
            <p className="text-muted">{doctor?.email || doctorEmail}</p>
            {doctor?.qualification && <p className="text-muted">{doctor.qualification}</p>}
          </div>
        </div>
      </div>

      <div className="grid-2 gap-4">
        <div className="card">
          <h3 className="mb-3">Professional Details</h3>
          <div className="mb-2">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Department</p>
            <p style={{ fontWeight: '500' }}>{doctor?.department?.name || 'General Medicine'}</p>
          </div>
          <div className="mb-2">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Specialization</p>
            <p style={{ fontWeight: '500' }}>{doctor?.specialization || '—'}</p>
          </div>
          <div className="mb-2">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Experience</p>
            <p style={{ fontWeight: '500' }}>{doctor?.experienceYears || '—'} Years</p>
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Status</p>
            <span className={`badge ${(doctor?.status || 'approved').toLowerCase()}`}>{doctor?.status || 'APPROVED'}</span>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-3">Contact Information</h3>
          <div className="mb-2">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Email</p>
            <p style={{ fontWeight: '500' }}>{doctor?.email || doctorEmail}</p>
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Full Name</p>
            <p style={{ fontWeight: '500' }}>{doctor?.name || doctorName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
