import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { QueueItem } from '../../types';
import {
  Users,
  UserPlus,
  Clock,
  Search,
  Ticket,
  Printer,
  Calendar,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  Filter,
  Megaphone,
  X,
  FileText
} from 'lucide-react';

export const ReceptionistDashboard: React.FC = () => {
  const {
    activeView,
    setActiveView,
    queue,
    doctors,
    patients,
    appointments,
    registerWalkIn,
    updateQueueStatus,
    registerNewPatient,
    bookAppointment,
    showToast
  } = useHospital();

  // Walk-in modal state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    age: 32,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    doctorId: doctors[0]?.id || '',
    chiefComplaint: '',
    isEmergency: false
  });
  const [generatedTicket, setGeneratedTicket] = useState<QueueItem | null>(null);

  // New Patient Registration Modal State
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPtForm, setNewPtForm] = useState({
    name: '',
    age: 30,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    bloodGroup: 'A+',
    emergencyName: '',
    emergencyPhone: ''
  });

  // Patient Directory Search state
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // Queue status filter
  const [queueFilter, setQueueFilter] = useState<'All' | 'Waiting' | 'Triage Done' | 'In Exam'>('All');

  const filteredQueue = queue.filter((item) => {
    if (queueFilter === 'Waiting') return item.status === 'Checked In';
    if (queueFilter === 'Triage Done') return item.status === 'Triage Done';
    if (queueFilter === 'In Exam') return item.status === 'In Exam';
    return true;
  });

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      p.phone.includes(patientSearchQuery)
  );

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.name || !walkInForm.phone || !walkInForm.chiefComplaint) {
      showToast('Please enter all required walk-in details.');
      return;
    }

    const { queueItem } = registerWalkIn(walkInForm);
    setGeneratedTicket(queueItem);
    setShowWalkInModal(false);
    setWalkInForm({
      name: '',
      age: 32,
      gender: 'Female',
      phone: '',
      doctorId: doctors[0]?.id || '',
      chiefComplaint: '',
      isEmergency: false
    });
  };

  const handleNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtForm.name || !newPtForm.phone || !newPtForm.email) {
      showToast('Please fill required patient registration fields.');
      return;
    }

    registerNewPatient({
      name: newPtForm.name,
      age: Number(newPtForm.age),
      gender: newPtForm.gender,
      phone: newPtForm.phone,
      email: newPtForm.email,
      bloodGroup: newPtForm.bloodGroup,
      allergies: [],
      emergencyContact: {
        name: newPtForm.emergencyName || 'Relative',
        relationship: 'Emergency Contact',
        phone: newPtForm.emergencyPhone || newPtForm.phone
      }
    });

    setShowNewPatientModal(false);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Front-Desk Quick Bar */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] font-bold text-xs">
              Front-Desk Intake & Triage
            </span>
            <span className="text-xs text-[#707881]">Station: Desk 02 • Main Pavilion</span>
          </div>
          <h2 className="text-xl font-bold text-[#0b1c30] mt-0.5">Reception & Queue Control</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWalkInModal(true)}
            className="px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>+ Walk-In Token</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewPatientModal(true)}
            className="px-3.5 py-2 border border-[#bfc7d2] hover:bg-[#f8f9ff] text-[#565e74] text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-[#006194]" />
            <span>New Patient Record</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD OR MANAGE QUEUE VIEW */}
      {(activeView === 'dashboard' || activeView === 'manage-queue' || activeView === 'walk-in') && (
        <div className="space-y-6">
          {/* Key Queue Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">In Waiting Area</span>
              <div className="text-2xl font-bold text-[#0b1c30] mt-1">
                {queue.filter((q) => q.status === 'Checked In' || q.status === 'Triage Done').length}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">Active queue</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">In Examination</span>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {queue.filter((q) => q.status === 'In Exam').length}
              </div>
              <span className="text-[10px] text-[#707881]">Rooms occupied</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Walk-ins Today</span>
              <div className="text-2xl font-bold text-[#006194] mt-1">
                {queue.filter((q) => q.type === 'Walk-In' || q.type === 'Emergency').length}
              </div>
              <span className="text-[10px] text-[#707881]">Tokens issued</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Average Wait Time</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">11m 45s</div>
              <span className="text-[10px] text-emerald-700 font-medium">-2m below benchmark</span>
            </div>
          </div>

          {/* Live Queue Table (matching screenshot) */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Live Patient Queue & Triage</h3>
                <p className="text-xs text-[#707881]">Real-time token dispatch, room routing, and attendance</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#f8f9ff] rounded-lg border border-[#e2e8f0] text-xs">
                {(['All', 'Waiting', 'Triage Done', 'In Exam'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setQueueFilter(tab)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      queueFilter === tab
                        ? 'bg-white text-[#006194] shadow-2xs font-bold'
                        : 'text-[#565e74] hover:text-[#0b1c30]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-[#707881] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Token #</th>
                    <th className="py-3 px-3">Patient Information</th>
                    <th className="py-3 px-3">Assigned Physician & Ward</th>
                    <th className="py-3 px-3">Wait Time</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Queue Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredQueue.map((item) => (
                    <tr key={item.token} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-sm text-[#006194]">{item.token}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0b1c30]">{item.patientName}</div>
                        <div className="text-[11px] text-[#707881]">{item.patientMrn} • {item.patientAge}y {item.patientGender}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#0b1c30]">{item.doctorName}</div>
                        <div className="text-[11px] text-[#707881]">{item.doctorDepartment} • {item.room}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-[#565e74]">
                        {item.waitDuration}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            item.priority === 'Emergency'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.status === 'In Exam'
                              ? 'bg-blue-100 text-blue-700'
                              : item.status === 'Triage Done'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Checked In'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Chime: Token ${item.token} - ${item.patientName}, please proceed to ${item.room}`);
                          }}
                          className="px-2 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] rounded text-[11px] font-semibold"
                          title="Broadcast PA Audio Call"
                        >
                          Call
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQueueStatus(item.token, 'In Exam')}
                          className="px-2 py-1 bg-[#006194] hover:bg-[#007bb9] text-white rounded text-[11px] font-semibold"
                        >
                          To Exam
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQueueStatus(item.token, 'Completed')}
                          className="px-2 py-1 border border-[#bfc7d2] hover:bg-[#f8f9ff] text-[#565e74] rounded text-[11px] font-semibold"
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PATIENT SEARCH & DIRECTORY VIEW */}
      {(activeView === 'patient-search' || activeView === 'register-patient') && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">Master Patient Directory</h3>
              <p className="text-xs text-[#707881]">Search hospital EHR by MRN, Name, or Phone</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-3 py-1.5 bg-[#006194] text-white rounded-lg text-xs font-semibold hover:bg-[#007bb9]"
            >
              + Register New Patient
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#707881]" />
            <input
              type="text"
              value={patientSearchQuery}
              onChange={(e) => setPatientSearchQuery(e.target.value)}
              placeholder="Search by MRN (e.g. MRN-782104) or Patient Name..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
            />
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {filteredPatients.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0b1c30]">{p.name}</span>
                    <span className="font-mono text-xs font-bold text-[#006194]">{p.mrn}</span>
                    <span className="text-[10px] text-[#707881]">{p.gender}, {p.age}y</span>
                  </div>
                  <div className="text-[11px] text-[#565e74] mt-0.5">
                    Phone: {p.phone} • Blood: {p.bloodGroup} • Emergency: {p.emergencyContact.name} ({p.emergencyContact.phone})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWalkInForm({
                        name: p.name,
                        age: p.age,
                        gender: p.gender,
                        phone: p.phone,
                        doctorId: doctors[0]?.id || '',
                        chiefComplaint: '',
                        isEmergency: false
                      });
                      setShowWalkInModal(true);
                    }}
                    className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] text-xs font-semibold rounded-lg"
                  >
                    Issue Walk-in Token
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCTOR SCHEDULE VIEW */}
      {activeView === 'doctor-schedule' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Doctor Daily Roster & Room Matrix</h3>
            <p className="text-xs text-[#707881]">Monitor active doctors on duty and room availability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-[#0b1c30]">{doc.name}</h4>
                    <p className="text-[11px] text-[#006194] font-medium">{doc.specialization}</p>
                    <span className="text-[10px] text-[#707881]">{doc.room}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      doc.dutyStatus === 'On Duty'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    ● {doc.dutyStatus}
                  </span>
                  <div className="text-[10px] text-[#707881] mt-1">
                    Slots: {doc.timeSlots.length} available
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS VIEW */}
      {activeView === 'reports' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30]">Daily Intake & Front-Desk Log</h3>
              <p className="text-xs text-[#707881]">Consolidated summary of tokens issued and clinic handoffs</p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Exporting Front-Desk Daily Log to CSV/PDF...')}
              className="px-3 py-1.5 bg-[#006194] text-white text-xs font-semibold rounded-lg"
            >
              Export Report
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#707881]">Total Queue Tokens Issued:</span>
              <span className="font-bold text-[#0b1c30]">{queue.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707881]">Emergency Rapid Triage Cases:</span>
              <span className="font-bold text-red-600">
                {queue.filter((q) => q.priority === 'Emergency').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707881]">Active Doctors Stationed:</span>
              <span className="font-bold text-[#006194]">
                {doctors.filter((d) => d.dutyStatus === 'On Duty').length} / {doctors.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN PATIENT MODAL */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setShowWalkInModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e2e8f0]">
              <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#0b1c30]">Register Walk-In Patient</h4>
                <p className="text-xs text-[#707881]">Issue instant triage token and assign consultation room</p>
              </div>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={walkInForm.name}
                  onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                  placeholder="e.g. Johnathan Lee"
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={walkInForm.age}
                    onChange={(e) => setWalkInForm({ ...walkInForm, age: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Gender</label>
                  <select
                    value={walkInForm.gender}
                    onChange={(e) => setWalkInForm({ ...walkInForm, gender: e.target.value as any })}
                    className="w-full h-10 px-2 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    placeholder="555-0192"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Assign Doctor
                </label>
                <select
                  value={walkInForm.doctorId}
                  onChange={(e) => setWalkInForm({ ...walkInForm, doctorId: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.department} ({doc.room})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Chief Complaint / Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={walkInForm.chiefComplaint}
                  onChange={(e) => setWalkInForm({ ...walkInForm, chiefComplaint: e.target.value })}
                  placeholder="e.g. Acute abdominal pain, fever and vomiting..."
                  className="w-full p-2.5 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-900 block">Emergency Priority Case</span>
                  <span className="text-[11px] text-red-700">Immediate bypass of waiting queue to acute triage</span>
                </div>
                <input
                  type="checkbox"
                  checked={walkInForm.isEmergency}
                  onChange={(e) => setWalkInForm({ ...walkInForm, isEmergency: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9]"
                >
                  Issue Token & Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE TOKEN SLIP MODAL */}
      {generatedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006194]">
              MetroHealth Front Desk Slip
            </span>
            <div className="my-3 py-3 px-4 bg-[#eff4ff] border-2 border-dashed border-[#006194] rounded-xl">
              <span className="text-xs font-semibold text-[#707881]">Token Number</span>
              <div className="text-3xl font-mono font-bold text-[#006194]">{generatedTicket.token}</div>
              <span className="text-[11px] font-bold text-emerald-700">● Checked In</span>
            </div>

            <div className="text-left text-xs space-y-1.5 text-[#565e74] mb-4">
              <div className="flex justify-between">
                <span>Patient:</span>
                <span className="font-bold text-[#0b1c30]">{generatedTicket.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span className="font-bold text-[#0b1c30]">{generatedTicket.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Room:</span>
                <span className="font-bold text-[#006194]">{generatedTicket.room}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Printing thermal paper token slip...')}
                className="flex-1 py-2 rounded-lg border border-[#bfc7d2] text-xs font-semibold hover:bg-[#f8f9ff] flex items-center justify-center gap-1"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => setGeneratedTicket(null)}
                className="flex-1 py-2 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PATIENT MODAL */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setShowNewPatientModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-[#0b1c30] mb-1">Create Patient EHR</h4>
            <p className="text-xs text-[#707881] mb-4">Generates permanent Medical Record Number (MRN) and chart</p>

            <form onSubmit={handleNewPatientSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newPtForm.name}
                  onChange={(e) => setNewPtForm({ ...newPtForm, name: e.target.value })}
                  placeholder="e.g. Robert Davis"
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newPtForm.email}
                    onChange={(e) => setNewPtForm({ ...newPtForm, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newPtForm.phone}
                    onChange={(e) => setNewPtForm({ ...newPtForm, phone: e.target.value })}
                    placeholder="555-9012"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9]"
                >
                  Register Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
