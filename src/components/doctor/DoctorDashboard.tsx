import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types';
import {
  Activity,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  Stethoscope,
  Pill,
  Send,
  Calendar,
  CalendarDays,
  Play,
  Check,
  ChevronRight,
  ShieldAlert,
  Thermometer,
  Wind,
  Bed,
  X
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    doctors,
    appointments,
    alerts,
    updateDoctorDutyStatus,
    updateAppointmentStatus,
    signClinicalAlert,
    showToast
  } = useHospital();

  // Find active doctor data
  const currentDoctor = doctors.find((d) => d.id === currentUser?.id) || doctors[0];

  // Prescription / Clinical Exam Modal State
  const [selectedExamApt, setSelectedExamApt] = useState<Appointment | null>(null);
  const [rxText, setRxText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');

  // Availability state
  const dutyStatus = currentDoctor.dutyStatus;

  // Appointments for this doctor
  const docAppointments = appointments.filter(
    (apt) => apt.doctorId === currentDoctor.id || apt.doctorName === currentDoctor.name
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = docAppointments.filter((a) => a.date === todayStr || a.status === 'In Progress' || a.status === 'Checked In');
  const upcomingAppointments = docAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'Scheduled');
  
  // Find current active patient in exam
  const activeInExam = docAppointments.find((a) => a.status === 'In Progress') || todayAppointments[0];

  const handleStartExam = (apt: Appointment) => {
    updateAppointmentStatus(apt.id, 'In Progress');
    setSelectedExamApt(apt);
    setRxText(apt.prescription || '');
    setNotesText(apt.notes || '');
    setDiagnosisText(apt.diagnosis || '');
  };

  const handleCompleteExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamApt) return;
    updateAppointmentStatus(selectedExamApt.id, 'Completed', notesText, rxText);
    setSelectedExamApt(null);
    showToast(`Consultation completed for ${selectedExamApt.patientName}. EHR record updated.`);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Doctor Banner & Status Switcher */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentDoctor.avatar}
            alt={currentDoctor.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#006194]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#006194] text-xs font-bold font-mono">
                {currentDoctor.staffId}
              </span>
              <span className="text-xs text-[#707881]">{currentDoctor.department} • {currentDoctor.room}</span>
            </div>
            <h2 className="text-xl font-bold text-[#0b1c30] mt-0.5">{currentDoctor.name}</h2>
            <p className="text-xs text-[#565e74]">{currentDoctor.title}</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider hidden sm:inline">
            Status:
          </span>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0]">
            {(['On Duty', 'In Procedure', 'On Break', 'Off Duty'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateDoctorDutyStatus(currentDoctor.id, status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  dutyStatus === status
                    ? status === 'On Duty'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : status === 'In Procedure'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-slate-700 text-white shadow-2xs'
                    : 'text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUB-VIEW: Today's Appointments or Dashboard */}
      {(activeView === 'dashboard' || activeView === 'today-appointments') && (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Today's Roster</span>
              <div className="text-2xl font-bold text-[#0b1c30] mt-1">{todayAppointments.length}</div>
              <span className="text-[10px] text-[#006194] font-medium">Scheduled consults</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Waiting in Triage</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {todayAppointments.filter((a) => a.status === 'Checked In').length}
              </div>
              <span className="text-[10px] text-[#707881]">Avg wait: 12 mins</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Completed Today</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {todayAppointments.filter((a) => a.status === 'Completed').length}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">EHR Signed off</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
              <span className="text-[11px] font-bold uppercase text-[#707881]">Telemetry Alerts</span>
              <div className="text-2xl font-bold text-red-600 mt-1">{alerts.length}</div>
              <span className="text-[10px] text-red-700 font-medium">Critical flags</span>
            </div>
          </div>

          {/* Active Examination Room Card (matching screenshot) */}
          {activeInExam && (
            <div className="bg-white rounded-2xl border-2 border-[#006194] p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#006194] font-bold text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#006194] animate-ping"></span>
                      ACTIVE IN EXAM • {activeInExam.room}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#707881]">
                      {activeInExam.patientMrn}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1c30] mt-1">
                    {activeInExam.patientName}
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    {activeInExam.patientAge} yrs • {activeInExam.patientGender} • Complaint: "{activeInExam.chiefComplaint}"
                  </p>
                </div>

                {/* Vitals Telemetry Box */}
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  <div className="px-3 py-2 bg-[#f8f9ff] rounded-xl border border-[#e2e8f0] text-center min-w-[75px]">
                    <span className="text-[10px] text-[#707881] block">Heart Rate</span>
                    <span className="text-sm font-bold text-red-600">104 bpm</span>
                  </div>
                  <div className="px-3 py-2 bg-[#f8f9ff] rounded-xl border border-[#e2e8f0] text-center min-w-[75px]">
                    <span className="text-[10px] text-[#707881] block">Blood Press</span>
                    <span className="text-sm font-bold text-[#0b1c30]">142/88</span>
                  </div>
                  <div className="px-3 py-2 bg-[#f8f9ff] rounded-xl border border-[#e2e8f0] text-center min-w-[75px]">
                    <span className="text-[10px] text-[#707881] block">SpO2</span>
                    <span className="text-sm font-bold text-blue-600">96%</span>
                  </div>
                  <div className="px-3 py-2 bg-[#f8f9ff] rounded-xl border border-[#e2e8f0] text-center min-w-[75px]">
                    <span className="text-[10px] text-[#707881] block">Temperature</span>
                    <span className="text-sm font-bold text-amber-600">38.2 °C</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Active Patient */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartExam(activeInExam)}
                    className="px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <Pill className="w-4 h-4" />
                    <span>Prescribe / Clinical EHR Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Order sent to Central Pathology & Imaging Lab')}
                    className="px-3 py-2 border border-[#bfc7d2] hover:bg-[#eff4ff] text-xs font-semibold text-[#565e74] rounded-lg"
                  >
                    Order Lab Tests
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Requested inpatient bed allocation in Cardiology ICU')}
                    className="px-3 py-2 border border-[#bfc7d2] hover:bg-[#eff4ff] text-xs font-semibold text-[#565e74] rounded-lg"
                  >
                    Admit to Ward
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateAppointmentStatus(activeInExam.id, 'Completed');
                    showToast(`Consultation closed for ${activeInExam.patientName}`);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          )}

          {/* Today's Queue List */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Today's Patient Schedule</h3>
                <p className="text-xs text-[#707881]">Sequential consult queue and walk-in arrivals</p>
              </div>
              <span className="text-xs font-semibold text-[#006194]">
                {todayAppointments.length} Total Patients
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-[#707881] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Token / Time</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Chief Complaint</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#0b1c30]">
                        <span className="font-mono text-[#006194]">{apt.token || apt.time}</span>
                        <span className="block text-[10px] text-[#707881]">{apt.time}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0b1c30]">{apt.patientName}</div>
                        <div className="text-[11px] text-[#707881]">{apt.patientMrn} • {apt.patientAge}y {apt.patientGender}</div>
                      </td>
                      <td className="py-3 px-3 text-[#565e74] max-w-xs truncate">
                        {apt.chiefComplaint}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            apt.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-700'
                              : apt.status === 'Checked In'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-[#707881]">{apt.type}</td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        {apt.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleStartExam(apt)}
                            className="px-2.5 py-1 bg-[#006194] text-white rounded-md text-[11px] font-semibold hover:bg-[#007bb9]"
                          >
                            Call & Examine
                          </button>
                        )}
                        {apt.status === 'Completed' && (
                          <span className="text-[11px] text-emerald-600 font-bold">Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Alerts Box */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-[#0b1c30]">Clinical Triage Alerts</h3>
              </div>
              <span className="text-xs text-red-600 font-bold">{alerts.length} Pending Sign-off</span>
            </div>

            <div className="space-y-2">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-3.5 rounded-xl border border-red-200 bg-red-50/60 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                        {al.severity}
                      </span>
                      <span className="font-bold text-xs text-[#0b1c30]">{al.patientName}</span>
                      <span className="font-mono text-xs text-[#707881]">{al.patientMrn}</span>
                    </div>
                    <p className="text-xs text-[#565e74] mt-1">{al.description}</p>
                    <span className="text-[10px] text-[#707881] mt-0.5 block">{al.timeAgo}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => signClinicalAlert(al.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Sign Protocol
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW: Upcoming Appointments */}
      {activeView === 'upcoming-appointments' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Upcoming Patient Schedule</h3>
            <p className="text-xs text-[#707881]">Advanced calendar appointments for next 14 days</p>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-[#0b1c30]">
                    <span>{apt.date} at {apt.time}</span>
                    <span className="text-[#006194]">({apt.type})</span>
                  </div>
                  <div className="text-xs text-[#565e74] mt-0.5">
                    {apt.patientName} • {apt.patientAge}y {apt.patientGender} • Complaint: "{apt.chiefComplaint}"
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast(`Encounter file opened for ${apt.patientName}`)}
                  className="px-3 py-1.5 border border-[#bfc7d2] hover:bg-[#f8f9ff] text-xs font-semibold rounded-lg"
                >
                  View Chart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW: Manage Availability & Schedule */}
      {(activeView === 'manage-schedule' || activeView === 'manage-availability') && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Clinic Schedule & Time Slot Manager</h3>
            <p className="text-xs text-[#707881]">Configure your weekly clinic availability, room allocation, and procedure blocks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#006194]">Active Clinic Days</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <label key={day} className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30]">
                    <input
                      type="checkbox"
                      defaultChecked={currentDoctor.availableDays.includes(day)}
                      className="rounded text-[#006194]"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#006194]">Daily Consultation Slots</h4>
              <div className="flex flex-wrap gap-1.5">
                {currentDoctor.timeSlots.map((slot) => (
                  <span key={slot} className="px-2.5 py-1 rounded-md bg-white border border-[#bfc7d2] text-xs font-bold text-[#0b1c30]">
                    {slot}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => showToast('Time slot modifications synced with hospital master schedule.')}
                className="mt-2 px-4 py-2 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9]"
              >
                Save Schedule Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRESCRIPTION / EHR MODAL */}
      {selectedExamApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setSelectedExamApt(null)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-[#e2e8f0] mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#0b1c30]">Clinical Encounter EHR</h4>
                <p className="text-xs text-[#707881]">
                  {selectedExamApt.patientName} ({selectedExamApt.patientMrn}) • {selectedExamApt.room}
                </p>
              </div>
            </div>

            <form onSubmit={handleCompleteExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Primary Diagnosis
                </label>
                <input
                  type="text"
                  required
                  value={diagnosisText}
                  onChange={(e) => setDiagnosisText(e.target.value)}
                  placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Prescriptions (Rx)
                </label>
                <textarea
                  rows={3}
                  value={rxText}
                  onChange={(e) => setRxText(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg PO TID x 7d, Paracetamol 650mg PRN"
                  className="w-full p-3 rounded-lg border border-[#bfc7d2] text-xs font-mono text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Clinical Notes & Follow-up Instructions
                </label>
                <textarea
                  rows={2}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Patient counseled on hydration and rest. Follow up in 7 days."
                  className="w-full p-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setSelectedExamApt(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign & Save Encounter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
