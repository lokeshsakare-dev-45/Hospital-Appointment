import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Clock, Users, Award, HeartPulse } from 'lucide-react';

export default function About() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: 'calc(100vh - 80px)', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center mb-4">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem' }}>
            <Activity size={24} />
            <span>ABOUT MEDICARE</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Dedicated to Modern, Accessible Healthcare
          </h1>
          <p className="text-muted" style={{ fontSize: '1.15rem', maxWidth: '750px', margin: '0 auto' }}>
            MediCare is a comprehensive digital hospital appointment management system connecting patients with experienced medical professionals across multiple clinical departments.
          </p>
        </div>

        <div className="grid-3 mb-4">
          <div className="card text-center">
            <HeartPulse size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <h3>Patient-Centric Care</h3>
            <p className="text-muted mt-1">Simple online scheduling, instant status updates, and transparent medical guidance at every step.</p>
          </div>
          <div className="card text-center">
            <Award size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <h3>Verified Specialists</h3>
            <p className="text-muted mt-1">All doctors are thoroughly vetted, board-certified specialists with verified credentials and experience.</p>
          </div>
          <div className="card text-center">
            <Clock size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
            <h3>Real-Time Availability</h3>
            <p className="text-muted mt-1">View available slots and consult without long waiting room queues or scheduling conflicts.</p>
          </div>
        </div>

        <div className="card mb-4" style={{ padding: '2.5rem' }}>
          <h2 className="mb-2" style={{ color: 'var(--primary-color)' }}>Our Clinical Departments</h2>
          <p className="text-muted mb-4">
            MediCare houses state-of-the-art departments staffed by leading physicians and surgical specialists:
          </p>
          <div className="grid-2 gap-4">
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-color)' }}>●</span> Cardiology
              </h4>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Comprehensive cardiac evaluations, preventive cardiology, ECG, echocardiography, and heart care.
              </p>
            </div>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-color)' }}>●</span> General Medicine
              </h4>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Adult outpatient care, chronic disease management, seasonal infection diagnosis, and routine wellness.
              </p>
            </div>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-color)' }}>●</span> Orthopedics
              </h4>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Bone, joint, sports injury rehabilitation, fracture management, and musculoskeletal care.
              </p>
            </div>
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-color)' }}>●</span> Neurology
              </h4>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Specialized neurological diagnosis, headache and migraine treatment, and nervous system health.
              </p>
            </div>
          </div>
        </div>

        <div className="card mb-4" style={{ backgroundColor: 'var(--primary-light)', border: '1px solid #bfdbfe' }}>
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Ready to Schedule a Consultation?</h3>
              <p className="text-muted">Choose your preferred doctor and book an appointment in under two minutes.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/find-doctor" className="btn btn-primary">Find a Doctor</Link>
              <Link to="/register/patient" className="btn btn-secondary">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
