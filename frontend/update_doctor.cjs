const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const doctorDashboard = `export default function DoctorDashboard() {
  return (
    <div>
      <h1 className="mb-4">Good Morning, Dr. Rahul</h1>
      
      <div className="grid-4 mb-4">
        <div className="card">
          <p className="text-muted mb-1">Today's Appointments</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>8</h2>
        </div>
        <div className="card">
          <p className="text-muted mb-1">Pending Requests</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--warning)' }}>3</h2>
        </div>
        <div className="card">
          <p className="text-muted mb-1">Total Patients</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--info)' }}>125</h2>
        </div>
        <div className="card">
          <p className="text-muted mb-1">Completed</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--success)' }}>110</h2>
        </div>
      </div>
    </div>
  );
}
`;

const doctorMyAppointments = `export default function DoctorMyAppointments() {
  return (
    <div>
      <h1 className="mb-4">My Appointments</h1>
      <p className="text-muted mb-4">Complete appointment list and management.</p>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: '500' }}>Amit Sharma</td>
              <td>10 Oct 2026</td>
              <td>10:00 AM</td>
              <td><span className="badge approved">Approved</span></td>
              <td><button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>View Details</button></td>
            </tr>
            <tr>
              <td style={{ fontWeight: '500' }}>Priya Patil</td>
              <td>10 Oct 2026</td>
              <td>11:00 AM</td>
              <td><span className="badge approved">Approved</span></td>
              <td><button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>View Details</button></td>
            </tr>
            <tr>
              <td style={{ fontWeight: '500' }}>Rohit Joshi</td>
              <td>10 Oct 2026</td>
              <td>12:00 PM</td>
              <td><span className="badge pending">Pending</span></td>
              <td><button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>View Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

const doctorProfile = `export default function DoctorProfileDocView() {
  return (
    <div>
      <h1 className="mb-4">My Profile</h1>
      <div className="card mb-4">
        <div className="flex gap-4 items-center" style={{ flexWrap: 'wrap' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>👨‍⚕️</div>
          <div>
            <h2>Dr. Rahul Sharma</h2>
            <p className="text-muted">Cardiology</p>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Settings & Information</h3>
        <p className="text-muted mt-2">Manage your profile information and preferences here.</p>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'pages', 'DoctorDashboard.jsx'), doctorDashboard);
fs.writeFileSync(path.join(srcDir, 'pages', 'DoctorMyAppointments.jsx'), doctorMyAppointments);
fs.writeFileSync(path.join(srcDir, 'pages', 'DoctorProfileDocView.jsx'), doctorProfile);

// Update App.jsx
let appJsx = fs.readFileSync(path.join(srcDir, 'App.jsx'), 'utf8');
appJsx = appJsx.replace(
  "import DoctorAppointmentRequests from './pages/DoctorAppointmentRequests';",
  "import DoctorAppointmentRequests from './pages/DoctorAppointmentRequests';\nimport DoctorMyAppointments from './pages/DoctorMyAppointments';\nimport DoctorProfileDocView from './pages/DoctorProfileDocView';"
);
appJsx = appJsx.replace(
  "{/* Doctor Routes */}",
  `{/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<AppLayout role="doctor"><DoctorDashboard /></AppLayout>} />
        <Route path="/doctor/appointment-requests" element={<AppLayout role="doctor"><DoctorAppointmentRequests /></AppLayout>} />
        <Route path="/doctor/my-appointments" element={<AppLayout role="doctor"><DoctorMyAppointments /></AppLayout>} />
        <Route path="/doctor/patients" element={<AppLayout role="doctor"><DoctorPatients /></AppLayout>} />
        <Route path="/doctor/schedule" element={<AppLayout role="doctor"><DoctorSchedule /></AppLayout>} />
        <Route path="/doctor/profile" element={<AppLayout role="doctor"><DoctorProfileDocView /></AppLayout>}`
);
// Remove the old doctor routes block
appJsx = appJsx.replace(
  /<Route path="\/doctor\/dashboard".*\n.*\n.*\n.*\n/g,
  ""
);
const oldDoctorRoutes = `        <Route path="/doctor/dashboard" element={<AppLayout role="doctor"><DoctorDashboard /></AppLayout>} />
        <Route path="/doctor/requests" element={<AppLayout role="doctor"><DoctorAppointmentRequests /></AppLayout>} />
        <Route path="/doctor/patients" element={<AppLayout role="doctor"><DoctorPatients /></AppLayout>} />
        <Route path="/doctor/schedule" element={<AppLayout role="doctor"><DoctorSchedule /></AppLayout>} />`;

if (appJsx.includes(oldDoctorRoutes)) {
    appJsx = appJsx.replace(oldDoctorRoutes, "");
}

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);

console.log('Doctor updates applied');
