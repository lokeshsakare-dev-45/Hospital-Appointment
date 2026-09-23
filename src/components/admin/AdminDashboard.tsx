import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types';
import {
  Activity,
  ShieldCheck,
  Building,
  Users,
  Stethoscope,
  BarChart3,
  FileText,
  Settings,
  Database,
  Plus,
  Power,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Code,
  Layers,
  Search,
  BedDouble,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activeView,
    setActiveView,
    doctors,
    departments,
    patients,
    appointments,
    auditLogs,
    toggleDoctorStatus,
    addDoctor,
    updateDepartmentBeds,
    showToast
  } = useHospital();

  // Add Doctor Modal
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDoctorForm, setNewDoctorForm] = useState({
    name: '',
    title: 'Attending Physician, MD',
    specialization: 'General Medicine',
    department: 'Cardiology ICU',
    email: '',
    phone: '',
    room: 'Room 401',
    npi: 'NPI-1049281920',
    qualification: 'MD, Board Certified',
    experienceYears: 8,
    consultationFee: 150,
    dutyStatus: 'On Duty' as 'On Duty' | 'In Procedure' | 'On Break' | 'Off Duty'
  });

  // Doctor search state in admin table
  const [docSearch, setDocSearch] = useState('');

  const filteredDocs = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.specialization.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.staffId.toLowerCase().includes(docSearch.toLowerCase())
  );

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorForm.name || !newDoctorForm.email) {
      showToast('Please enter doctor name and email.');
      return;
    }

    addDoctor({
      ...newDoctorForm,
      wing: 'West Wing - Pavilion',
      clearance: 'Level 4 - Attending Physician',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
      bio: `${newDoctorForm.name} is a board-certified clinical specialist practicing in the ${newDoctorForm.department}.`,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
      rating: 4.9,
      reviewsCount: 12
    });

    setShowAddDoctorModal(false);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#93000a] font-bold text-xs">
              Super Admin (Lvl 5)
            </span>
            <span className="text-xs text-[#707881]">Enterprise Clinical Governance</span>
          </div>
          <h2 className="text-xl font-bold text-[#0b1c30] mt-0.5">Hospital Administration & System Matrix</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Physician</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('system-config')}
            className="px-3.5 py-2 border border-[#bfc7d2] hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            <Database className="w-4 h-4 text-[#006194]" />
            <span>Backend Architecture</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD VIEW: Telemetry & Wing Matrix matching screenshot */}
      {(activeView === 'dashboard' || activeView === 'reports-analytics') && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Active Clinical Staff</span>
              <div className="text-2xl font-bold text-[#0b1c30] mt-1">142</div>
              <span className="text-[10px] text-emerald-600 font-semibold">+4% from baseline roster</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Total Inpatient Census</span>
              <div className="text-2xl font-bold text-[#006194] mt-1">384 beds</div>
              <span className="text-[10px] text-[#707881]">89% occupancy rate</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">ER Arrival Velocity</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">18.4 pts/hr</div>
              <span className="text-[10px] text-amber-700 font-medium">Peak triage load</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">HL7 Telemetry Feed</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">1,420 msgs</div>
              <span className="text-[10px] text-emerald-700 font-medium">0 failed transactions</span>
            </div>
          </div>

          {/* Wing & Unit Matrix */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Clinical Wing & Unit Matrix</h3>
                <p className="text-xs text-[#707881]">Real-time departmental capacity and bed occupancy allocation</p>
              </div>
              <span className="text-xs font-semibold text-[#006194]">
                {departments.length} Units Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0b1c30]">{dept.name}</h4>
                      <p className="text-xs text-[#707881]">{dept.code} • Head: {dept.headDoctor}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dept.occupancyRate > 90
                          ? 'bg-red-100 text-red-700'
                          : dept.occupancyRate > 80
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {dept.occupancyRate}% Occupied
                    </span>
                  </div>

                  {/* Bed Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-[#565e74] mb-1">
                      <span>Occupied: {dept.occupiedBeds} / {dept.totalBeds} Beds</span>
                      <span>{dept.totalBeds - dept.occupiedBeds} Available</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          dept.occupancyRate > 90 ? 'bg-red-600' : 'bg-[#006194]'
                        }`}
                        style={{ width: `${dept.occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bed adjustments */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[#707881]">Adjust Occupancy:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateDepartmentBeds(dept.id, -1)}
                        className="w-6 h-6 rounded bg-white border border-[#bfc7d2] text-[#0b1c30] font-bold hover:bg-[#eff4ff] flex items-center justify-center"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDepartmentBeds(dept.id, 1)}
                        className="w-6 h-6 rounded bg-white border border-[#bfc7d2] text-[#0b1c30] font-bold hover:bg-[#eff4ff] flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCTORS MANAGEMENT VIEW */}
      {(activeView === 'manage-doctors' || activeView === 'manage-departments') && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">Physician & Clinical Faculty Directory</h3>
              <p className="text-xs text-[#707881]">Credential validation, active duty rotation, and clinic room assignments</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddDoctorModal(true)}
              className="px-3.5 py-2 bg-[#006194] text-white rounded-lg text-xs font-semibold hover:bg-[#007bb9] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Doctor</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#707881]" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search faculty by name, staff ID, or specialty..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-[#707881] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Staff ID & Doctor</th>
                  <th className="py-3 px-3">Department & Ward</th>
                  <th className="py-3 px-3">NPI & Credentials</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Fee</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img src={doc.avatar} alt={doc.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-[#0b1c30]">{doc.name}</div>
                          <div className="text-[10px] font-mono text-[#006194]">{doc.staffId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0b1c30]">{doc.department}</div>
                      <div className="text-[11px] text-[#707881]">{doc.room}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#565e74] font-mono">{doc.npi}</div>
                      <div className="text-[10px] text-[#707881]">{doc.qualification}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          doc.dutyStatus === 'On Duty'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.dutyStatus === 'In Procedure'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {doc.dutyStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#0b1c30]">${doc.consultationFee}</td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => toggleDoctorStatus(doc.id)}
                        className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] font-semibold text-[11px]"
                      >
                        Toggle Duty
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS VIEW */}
      {activeView === 'audit-logs' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">HIPAA Compliance & Clinical Audit Trail</h3>
              <p className="text-xs text-[#707881]">Cryptographically signed user events, patient access, and privilege tracking</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700">Audit Status: Compliant</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-[#707881] font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User & Role</th>
                  <th className="py-3 px-3">Event Action</th>
                  <th className="py-3 px-3">Details</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f8f9ff]">
                    <td className="py-2.5 px-3 font-mono text-[#707881]">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[#0b1c30]">{log.user}</span>
                      <span className="block text-[10px] text-[#707881] uppercase">{log.role}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#006194]">{log.action}</td>
                    <td className="py-2.5 px-3 text-[#565e74]">{log.details}</td>
                    <td className="py-2.5 px-3 font-mono text-[#707881]">{log.ipAddress}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SYSTEM ARCHITECTURE & CONFIGURATION (Java Spring Boot & SQL Relational Schema) */}
      {activeView === 'system-config' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#006194] font-bold text-xs">
                Backend-Ready Architecture
              </span>
              <span className="text-xs text-[#707881]">Java Spring Boot & SQL Schema</span>
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mt-1">System Architecture Blueprint</h3>
            <p className="text-xs text-[#565e74]">
              Clean decoupled enterprise architecture ready for production Java Spring Boot microservices and SQL relational persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Java Spring Boot REST Controller Blueprint */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
              <div className="flex items-center justify-between text-[#4cd7f6] font-bold border-b border-slate-700 pb-2 mb-2">
                <span className="flex items-center gap-1.5">
                  <Code className="w-4 h-4" /> Java Spring Boot: AppointmentController.java
                </span>
                <span className="text-[10px] text-slate-400">Spring Boot 3.3.x</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-slate-300">
{`@RestController
@RequestMapping("/api/v1/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final TriageQueueService queueService;

    @PostMapping("/book")
    public ResponseEntity<AppointmentDTO> bookAppointment(
            @Valid @RequestBody BookingRequest req,
            @AuthenticationPrincipal UserDetails user) {
        
        Appointment appt = appointmentService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new AppointmentDTO(appt));
    }

    @GetMapping("/queue/live")
    public ResponseEntity<List<QueueTokenDTO>> getLiveQueue() {
        return ResponseEntity.ok(queueService.getActiveTokens());
    }
}`}
              </pre>
            </div>

            {/* SQL Relational Schema */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
              <div className="flex items-center justify-between text-[#4cd7f6] font-bold border-b border-slate-700 pb-2 mb-2">
                <span className="flex items-center gap-1.5">
                  <Database className="w-4 h-4" /> SQL Relational Schema: schema.sql
                </span>
                <span className="text-[10px] text-slate-400">PostgreSQL / MySQL</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-slate-300">
{`CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY,
    mrn VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    blood_group VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id),
    doctor_id VARCHAR(36) REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(15) NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    type VARCHAR(20) DEFAULT 'IN_PERSON',
    chief_complaint TEXT
);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ADD DOCTOR MODAL */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setShowAddDoctorModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-[#0b1c30] mb-1">Add Medical Doctor to Roster</h4>
            <p className="text-xs text-[#707881] mb-4">Register new attending specialist, room, and credentials</p>

            <form onSubmit={handleAddDoctorSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  value={newDoctorForm.name}
                  onChange={(e) => setNewDoctorForm({ ...newDoctorForm, name: e.target.value })}
                  placeholder="e.g. Dr. Arthur Pendelton, MD"
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Department</label>
                  <select
                    value={newDoctorForm.department}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, department: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  >
                    <option value="Cardiology ICU">Cardiology ICU</option>
                    <option value="Pediatrics Clinic">Pediatrics Clinic</option>
                    <option value="Orthopedics & Sports">Orthopedics & Sports</option>
                    <option value="Neurology & Neurosurgery">Neurology & Neurosurgery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Consultation Room</label>
                  <input
                    type="text"
                    value={newDoctorForm.room}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, room: e.target.value })}
                    placeholder="Room 401"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newDoctorForm.email}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, email: e.target.value })}
                    placeholder="doctor@metrohealth.org"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={newDoctorForm.consultationFee}
                    onChange={(e) => setNewDoctorForm({ ...newDoctorForm, consultationFee: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9]"
                >
                  Commit to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
