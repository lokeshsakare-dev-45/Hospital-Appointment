import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Calendar, Activity, Phone, Mail, MapPin, Clock, Award, ShieldCheck, HeartPulse } from 'lucide-react';
import LoginPopup from '../components/LoginPopup';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleBookClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    if (isLoggedIn && role === 'patient') {
      navigate('/find-doctor');
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}
      
      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem', display: 'flex', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1.25rem' }}>
            <Activity size={16} />
            <span>Trusted Healthcare Network</span>
          </div>
          <h1 style={{ fontSize: '3.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.15 }}>
            Find the Right Doctor.<br/>
            Book Your Appointment Easily.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Search verified doctors, select your preferred time slot, and manage your hospital appointments with ease through MediCare.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/find-doctor" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}>Find a Doctor</Link>
            <button onClick={handleBookClick} className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}>Book an Appointment</button>
          </div>
        </div>
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '380px', height: '380px', backgroundColor: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', boxShadow: '0 20px 25px -5px rgba(11, 92, 255, 0.1)' }}>
             <Activity size={140} />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ padding: '3.5rem 2rem', backgroundColor: 'white', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="grid-3">
            <div className="card text-center" style={{ border: '1px solid var(--border-color)', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Search size={32} color="var(--primary-color)" />
              </div>
              <h3>Find Specialists</h3>
              <p className="text-muted mt-1">Explore certified doctors categorized by clinical department, experience, and availability.</p>
            </div>
            <div className="card text-center" style={{ border: '1px solid var(--border-color)', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Calendar size={32} color="var(--primary-color)" />
              </div>
              <h3>Instant Scheduling</h3>
              <p className="text-muted mt-1">Pick a convenient consultation date and time slot that fits your personal schedule.</p>
            </div>
            <div className="card text-center" style={{ border: '1px solid var(--border-color)', padding: '2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <HeartPulse size={32} color="var(--primary-color)" />
              </div>
              <h3>Status Tracking</h3>
              <p className="text-muted mt-1">Stay updated with real-time status updates: Pending, Approved, Completed, or Cancelled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-main)', scrollMarginTop: '80px' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="text-center mb-4">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} />
              <span>ABOUT MEDICARE HOSPITAL</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Excellence in Digital Patient Care
            </h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
              MediCare is a modern hospital appointment management system built to streamline patient consultations, reduce waiting times, and coordinate healthcare professionals efficiently.
            </p>
          </div>

          <div className="grid-3 mb-4">
            <div className="card text-center">
              <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>25+</h3>
              <p className="font-medium">Specialist Doctors</p>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Cardiology, Orthopedics, Neurology & General Medicine</p>
            </div>
            <div className="card text-center">
              <h3 style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>10,000+</h3>
              <p className="font-medium">Patients Served</p>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Trusted healthcare for families and individuals</p>
            </div>
            <div className="card text-center">
              <h3 style={{ fontSize: '2.5rem', color: 'var(--info)', marginBottom: '0.5rem' }}>24 / 7</h3>
              <p className="font-medium">Medical Assistance</p>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Emergency hotline and round-the-clock coordination</p>
            </div>
          </div>

          <div className="card" style={{ padding: '2.5rem', backgroundColor: 'white' }}>
            <h3 className="mb-2" style={{ color: 'var(--primary-color)' }}>Our Core Clinical Departments</h3>
            <p className="text-muted mb-4">Our multi-specialty hospital provides expert medical consultation in key areas:</p>
            <div className="grid-2 gap-4">
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Award size={18} color="var(--primary-color)" /> Cardiology
                </h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Comprehensive heart care, preventive screening, hypertension management, and ECG diagnostics.
                </p>
              </div>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Award size={18} color="var(--primary-color)" /> General Medicine
                </h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Comprehensive adult healthcare, routine health exams, chronic disorder management, and fever clinics.
                </p>
              </div>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Award size={18} color="var(--primary-color)" /> Orthopedics
                </h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Advanced bone, joint, sports injuries, arthritis care, and physical therapy guidance.
                </p>
              </div>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                  <Award size={18} color="var(--primary-color)" /> Neurology
                </h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Specialized nervous system diagnostic services, migraine therapies, and neurological care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white', borderTop: '1px solid var(--border-color)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.25rem', marginBottom: '3rem' }}>How MediCare Works</h2>
          <div className="grid-4">
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem', boxShadow: '0 4px 6px -1px rgba(11, 92, 255, 0.2)' }}>1</div>
              <h4>Create Account</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Register as a patient with your verified details.</p>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem', boxShadow: '0 4px 6px -1px rgba(11, 92, 255, 0.2)' }}>2</div>
              <h4>Find Doctor</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Search by department, specialization, or name.</p>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem', boxShadow: '0 4px 6px -1px rgba(11, 92, 255, 0.2)' }}>3</div>
              <h4>Book Appointment</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Pick an available date and preferred time slot.</p>
            </div>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem', boxShadow: '0 4px 6px -1px rgba(11, 92, 255, 0.2)' }}>4</div>
              <h4>Get Confirmation</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Receive instant status updates on your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', scrollMarginTop: '80px' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="text-center mb-4">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem' }}>
              <Phone size={20} />
              <span>GET IN TOUCH</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Contact MediCare Hospital
            </h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
              Have inquiries about doctor appointments, clinical departments, or hospital facilities? Reach out to our team.
            </p>
          </div>

          <div className="grid-3 mb-4">
            <div className="card text-center" style={{ padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <MapPin size={28} color="var(--primary-color)" />
              </div>
              <h4 className="mb-1">Hospital Address</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>MediCare Multi-Specialty Hospital<br/>Healthcare Avenue, Medical District, Pune, MH 411001</p>
            </div>

            <div className="card text-center" style={{ padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Phone size={28} color="var(--primary-color)" />
              </div>
              <h4 className="mb-1">Emergency & Appointments</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Appointments: <strong>+91 98765 43210</strong><br/>
                Emergency: <strong>108 / +91 98765 00000</strong>
              </p>
            </div>

            <div className="card text-center" style={{ padding: '2rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={28} color="var(--primary-color)" />
              </div>
              <h4 className="mb-1">Operating Hours</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                OPD Consultations: Mon – Sat (9:00 AM – 6:00 PM)<br/>
                Emergency Department: 24/7 Open
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2.5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-muted)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
            <Activity size={24} />
            <span>MediCare</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <Link to="/find-doctor" style={{ color: 'var(--text-muted)' }}>Find Doctors</Link>
            <Link to="/#about" style={{ color: 'var(--text-muted)' }}>About</Link>
            <Link to="/#contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
          </div>
          <p style={{ fontSize: '0.875rem' }}>&copy; 2026 MediCare Hospital Appointment System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
