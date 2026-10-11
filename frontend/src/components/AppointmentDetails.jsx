export default function AppointmentDetails({ appointment, onClose }) {
  const getStatusMessage = (status) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING': return "Waiting for doctor approval.";
      case 'APPROVED': return "Your appointment has been approved.";
      case 'COMPLETED': return "This appointment has been completed.";
      case 'CANCELLED': return "This appointment was cancelled.";
      case 'REJECTED': return "Your appointment request was rejected.";
      case 'RESCHEDULED': return "Your appointment has been rescheduled.";
      case 'NO_SHOW': return "Patient did not attend this appointment.";
      default: return "";
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white' }}>
        <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h2>Appointment Details</h2>
          <button onClick={onClose} style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>

        <div className="grid-2 mb-4 gap-4">
          <div style={{ gridColumn: 'span 2' }}>
            <p className="text-muted mb-1">Doctor</p>
            <h4 style={{ fontSize: '1.1rem' }}>{appointment.doc}</h4>
            <p className="text-muted">{appointment.dept}</p>
          </div>

          <div>
            <p className="text-muted mb-1">Date</p>
            <h4 style={{ fontSize: '1.1rem' }}>{appointment.date}</h4>
          </div>

          <div>
            <p className="text-muted mb-1">Time</p>
            <h4 style={{ fontSize: '1.1rem' }}>{appointment.time}</h4>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <p className="text-muted mb-1">Reason for Visit</p>
            <p>{appointment.reason || "Routine Checkup"}</p>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--border-radius)', textAlign: 'center' }}>
          <p className="mb-1"><strong>Status: {appointment.status}</strong></p>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>{getStatusMessage(appointment.status)}</p>
        </div>
      </div>
    </div>
  );
}
