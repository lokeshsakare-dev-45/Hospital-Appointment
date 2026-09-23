import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor, Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Search,
  User,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Heart,
  Activity,
  Shield,
  Star,
  ChevronRight,
  Filter,
  ArrowRight,
  Printer,
  CalendarCheck,
  Stethoscope,
  Phone,
  Mail,
  Bell,
  X,
  Sparkles
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    doctors,
    departments,
    appointments,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    notifications,
    showToast
  } = useHospital();

  // Search & Filter state for Find Doctors
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<Doctor | null>(null);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('09:30 AM');
  const [bookingType, setBookingType] = useState<'In-Person' | 'Telehealth'>('In-Person');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Reschedule & Cancel Modal States
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('10:00 AM');

  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Conflict in schedule');

  // Filter appointments for current patient
  const myAppointments = appointments.filter(
    (apt) => apt.patientId === currentUser?.id || apt.patientName === currentUser?.name
  );
  const upcomingAppointments = myAppointments.filter(
    (apt) => apt.status === 'Confirmed' || apt.status === 'Scheduled' || apt.status === 'In Progress'
  );
  const pastAppointments = myAppointments.filter(
    (apt) => apt.status === 'Completed' || apt.status === 'Cancelled'
  );

  const nextApt = upcomingAppointments[0];

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const handleOpenBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    setBookingTime(doc.timeSlots[0] || '09:30 AM');
    setChiefComplaint('');
    setBookingNotes('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;
    if (!chiefComplaint.trim()) {
      showToast('Please state your chief complaint or symptoms.');
      return;
    }

    const created = bookAppointment({
      doctorId: bookingDoctor.id,
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
      chiefComplaint,
      notes: bookingNotes
    });

    setBookingDoctor(null);
    setConfirmedAppointment(created);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !newRescheduleDate) return;
    rescheduleAppointment(reschedulingApt.id, newRescheduleDate, newRescheduleTime);
    setReschedulingApt(null);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingApt) return;
    cancelAppointment(cancellingApt.id, cancelReason);
    setCancellingApt(null);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
              Patient Portal
            </span>
            <span className="text-xs text-[#707881]">MRN: {currentUser?.mrn || 'MRN-782104'}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0b1c30] mt-1">
            {activeView === 'find-doctors'
              ? 'Find & Book Doctors'
              : activeView === 'my-appointments'
              ? 'My Consultations'
              : activeView === 'history'
              ? 'Appointment & Health History'
              : activeView === 'profile'
              ? 'Patient Health Profile'
              : activeView === 'notifications'
              ? 'Clinical Notifications'
              : `Welcome back, ${currentUser?.name || 'Sarah'}`}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('find-doctors')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeView === 'find-doctors'
                ? 'bg-[#006194] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#006194] hover:bg-[#dce9ff]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('my-appointments')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeView === 'my-appointments'
                ? 'bg-[#006194] text-white shadow-xs'
                : 'bg-white border border-[#bfc7d2] text-[#565e74] hover:bg-[#f8f9ff]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({upcomingAppointments.length})</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Next Upcoming Appointment Highlight */}
          {nextApt ? (
            <div className="bg-gradient-to-r from-[#006194] to-[#007bb9] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next Appointment • {nextApt.date} at {nextApt.time}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{nextApt.doctorName}</h3>
                  <p className="text-blue-100 text-sm mt-0.5 font-medium">
                    {nextApt.doctorSpecialty} • {nextApt.department}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-blue-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {nextApt.room}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {nextApt.type === 'Telehealth' ? <Video className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                      {nextApt.type} Visit
                    </span>
                    <span>•</span>
                    <span>Token: {nextApt.token || 'Checked In'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReschedulingApt(nextApt);
                      setNewRescheduleDate(nextApt.date);
                      setNewRescheduleTime(nextApt.time);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-white text-[#006194] font-semibold text-xs hover:bg-blue-50 transition-colors shadow-xs"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancellingApt(nextApt)}
                    className="px-4 py-2.5 rounded-lg bg-white/15 text-white hover:bg-white/25 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#006194] flex items-center justify-center mx-auto">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">No Upcoming Appointments</h3>
              <p className="text-xs text-[#707881] max-w-md mx-auto">
                You have no active doctor consultations scheduled. Browse our medical specialists and book a visit anytime.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('find-doctors')}
                className="px-5 py-2.5 bg-[#006194] text-white rounded-lg font-semibold text-xs hover:bg-[#007bb9] shadow-xs inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Find a Doctor</span>
              </button>
            </div>
          )}

          {/* Quick Metrics & Health Baseline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#707881] uppercase tracking-wider">
                  Upcoming Consults
                </span>
                <div className="text-2xl font-bold text-[#0b1c30] mt-1">
                  {upcomingAppointments.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Active in system</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#eff4ff] text-[#006194] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#707881] uppercase tracking-wider">
                  Completed Visits
                </span>
                <div className="text-2xl font-bold text-[#0b1c30] mt-1">
                  {pastAppointments.filter((a) => a.status === 'Completed').length + 1}
                </div>
                <span className="text-[11px] text-[#707881]">Prescriptions logged</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#707881] uppercase tracking-wider">
                  Blood Group
                </span>
                <div className="text-2xl font-bold text-[#0b1c30] mt-1">O+ Positive</div>
                <span className="text-[11px] text-[#707881]">RH Antigen verified</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#707881] uppercase tracking-wider">
                  Primary Coverage
                </span>
                <div className="text-sm font-bold text-[#0b1c30] mt-1 truncate max-w-[140px]">
                  BlueCross Select
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Active Policy</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#dae2fd] text-[#006194] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Doctor Recommendations Grid */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Available Specialists Today</h3>
                <p className="text-xs text-[#707881]">Top-rated clinical faculty accepting appointments</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('find-doctors')}
                className="text-xs font-semibold text-[#006194] hover:underline flex items-center gap-1"
              >
                <span>View All Doctors ({doctors.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-[#e2e8f0] hover:border-[#006194] hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#bfc7d2]"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0b1c30] truncate">{doc.name}</h4>
                      <p className="text-xs text-[#006194] font-medium truncate">{doc.specialization}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-[#707881]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#0b1c30]">{doc.rating}</span>
                        <span>({doc.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-[#707881] block text-[10px]">Consult Fee</span>
                      <span className="font-bold text-[#0b1c30]">${doc.consultationFee}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(doc)}
                      className="px-3 py-1.5 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg text-xs font-semibold shadow-2xs"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FIND DOCTORS VIEW */}
      {activeView === 'find-doctors' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707881]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor by name, specialty (e.g. Cardiology, Pediatrics, Knee)..."
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#bfc7d2] bg-white text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/15 focus:border-[#006194] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="h-11 px-3 rounded-lg border border-[#bfc7d2] bg-white text-xs font-semibold text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/15 focus:border-[#006194] outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Cardiology">Cardiology ICU</option>
                  <option value="Pediatrics">Pediatrics & Neonatal</option>
                  <option value="Orthopedics">Orthopedics & Sports</option>
                  <option value="Neurology">Neurology & Neurosurgery</option>
                </select>
              </div>
            </div>

            {/* Department Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDept === dept
                      ? 'bg-[#006194] text-white'
                      : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#dce9ff]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs hover:shadow-md hover:border-[#006194] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#bfc7d2] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.dutyStatus === 'On Duty'
                              ? 'bg-emerald-50 text-emerald-700'
                              : doc.dutyStatus === 'In Procedure'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          ● {doc.dutyStatus}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#0b1c30]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-base text-[#0b1c30] mt-1">{doc.name}</h4>
                      <p className="text-xs font-semibold text-[#006194]">{doc.specialization}</p>
                      <p className="text-[11px] text-[#707881] mt-0.5">{doc.department} • {doc.room}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#565e74] mt-3 line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {doc.availableDays.slice(0, 3).map((day) => (
                      <span
                        key={day}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#eff4ff] text-[#006194]"
                      >
                        {day}
                      </span>
                    ))}
                    {doc.availableDays.length > 3 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#f1f5f9] text-[#707881]">
                        +{doc.availableDays.length - 3} days
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#707881] font-semibold block">Fee</span>
                    <span className="text-base font-bold text-[#0b1c30]">${doc.consultationFee}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorForProfile(doc)}
                      className="px-3 py-2 rounded-lg border border-[#bfc7d2] text-xs font-semibold text-[#565e74] hover:bg-[#eff4ff]"
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(doc)}
                      className="px-4 py-2 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold shadow-xs"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY APPOINTMENTS VIEW */}
      {activeView === 'my-appointments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0b1c30]">Active Consultations</h3>
                <p className="text-xs text-[#707881]">Upcoming hospital appointments and telehealth sessions</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('find-doctors')}
                className="px-3 py-1.5 bg-[#006194] text-white text-xs font-semibold rounded-lg hover:bg-[#007bb9]"
              >
                + Schedule Another
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-[#707881] text-xs">
                No active appointments found.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#006194] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#006194] flex flex-col items-center justify-center font-bold shrink-0">
                        <span className="text-[10px] uppercase font-semibold text-[#707881]">
                          {new Date(apt.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-base leading-none">
                          {new Date(apt.date).getDate()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#0b1c30]">{apt.doctorName}</h4>
                          <span className="font-mono text-xs text-[#707881]">#{apt.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              apt.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : apt.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            ● {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#006194] font-medium">{apt.doctorSpecialty} • {apt.department}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#707881]">
                          <span className="flex items-center gap-1 font-semibold text-[#0b1c30]">
                            <Clock className="w-3.5 h-3.5 text-[#006194]" /> {apt.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {apt.room}
                          </span>
                          <span>•</span>
                          <span className="italic truncate max-w-xs">"{apt.chiefComplaint}"</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setReschedulingApt(apt);
                          setNewRescheduleDate(apt.date);
                          setNewRescheduleTime(apt.time);
                        }}
                        className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006194] text-xs font-semibold rounded-lg"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancellingApt(apt)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPOINTMENT HISTORY VIEW */}
      {activeView === 'history' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-[#0b1c30]">Past Consultations & Prescriptions</h3>
            <p className="text-xs text-[#707881]">Historical clinical records, doctor summaries, and diagnoses</p>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {pastAppointments.map((apt) => (
              <div key={apt.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0b1c30]">{apt.date} at {apt.time}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-xs font-mono text-[#707881]">#{apt.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0b1c30] mt-1">{apt.doctorName} ({apt.doctorSpecialty})</h4>
                  <p className="text-xs text-[#565e74] mt-0.5">Complaint: {apt.chiefComplaint}</p>
                  {apt.diagnosis && (
                    <p className="text-xs text-[#006194] font-semibold mt-1">Diagnosis: {apt.diagnosis}</p>
                  )}
                  {apt.prescription && (
                    <div className="mt-1.5 p-2 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs font-mono text-[#006194]">
                      Rx: {apt.prescription}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Downloading clinical encounter record #${apt.id}...`)}
                  className="px-3 py-1.5 border border-[#bfc7d2] hover:bg-[#f8f9ff] text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start md:self-center"
                >
                  <FileText className="w-3.5 h-3.5 text-[#006194]" />
                  <span>Download Summary</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS VIEW */}
      {activeView === 'notifications' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0b1c30]">Notifications & Alerts</h3>
            <span className="text-xs text-[#707881]">{notifications.length} messages</span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#006194] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0b1c30]">{n.title}</h4>
                    <p className="text-xs text-[#565e74] mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-[#707881] mt-1 block">{n.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PATIENT PROFILE VIEW */}
      {activeView === 'profile' && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[#f1f5f9]">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#006194]"
            />
            <div>
              <h3 className="text-2xl font-bold text-[#0b1c30]">{currentUser?.name}</h3>
              <p className="text-xs font-mono font-bold text-[#006194]">MRN: {currentUser?.mrn || 'MRN-782104'}</p>
              <p className="text-xs text-[#707881] mt-0.5">Registered Patient • St. Jude Pavilion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#707881]">Personal Contact</h4>
              <div className="p-4 rounded-xl bg-[#f8f9ff] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#707881]">Email:</span>
                  <span className="font-semibold text-[#0b1c30]">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707881]">Phone:</span>
                  <span className="font-semibold text-[#0b1c30]">{currentUser?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707881]">Preferred Language:</span>
                  <span className="font-semibold text-[#0b1c30]">English (US)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#707881]">Emergency Information</h4>
              <div className="p-4 rounded-xl bg-[#f8f9ff] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#707881]">Emergency Contact:</span>
                  <span className="font-semibold text-[#0b1c30]">David Miller (Brother)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707881]">Emergency Phone:</span>
                  <span className="font-semibold text-[#0b1c30]">+1 (555) 234-9988</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#707881]">Allergies:</span>
                  <span className="font-semibold text-emerald-700">No known drug allergies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR PROFILE MODAL */}
      {selectedDoctorForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setSelectedDoctorForProfile(null)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <img
                src={selectedDoctorForProfile.avatar}
                alt={selectedDoctorForProfile.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#bfc7d2]"
              />
              <div>
                <h4 className="text-xl font-bold text-[#0b1c30]">{selectedDoctorForProfile.name}</h4>
                <p className="text-xs font-bold text-[#006194]">{selectedDoctorForProfile.title}</p>
                <p className="text-xs text-[#707881]">{selectedDoctorForProfile.department} • {selectedDoctorForProfile.room}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <span className="font-bold text-[#006194] block mb-1">Education & Credentials</span>
                <p className="text-[#565e74]">{selectedDoctorForProfile.qualification} • {selectedDoctorForProfile.experienceYears} Years Experience</p>
                <p className="text-[#707881] font-mono mt-0.5">{selectedDoctorForProfile.npi}</p>
              </div>

              <div>
                <span className="font-bold text-[#0b1c30] block mb-1">Clinical Biography</span>
                <p className="text-[#565e74] leading-relaxed">{selectedDoctorForProfile.bio}</p>
              </div>

              <div>
                <span className="font-bold text-[#0b1c30] block mb-1">Available Clinic Days</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoctorForProfile.availableDays.map((d) => (
                    <span key={d} className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#565e74] font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-[#707881] font-bold block">Consultation Fee</span>
                <span className="text-lg font-bold text-[#0b1c30]">${selectedDoctorForProfile.consultationFee}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleOpenBooking(selectedDoctorForProfile);
                  setSelectedDoctorForProfile(null);
                }}
                className="px-5 py-2.5 bg-[#006194] text-white rounded-lg font-semibold text-xs hover:bg-[#007bb9]"
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] relative my-8">
            <button
              onClick={() => setBookingDoctor(null)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#f1f5f9]">
              <img
                src={bookingDoctor.avatar}
                alt={bookingDoctor.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#bfc7d2]"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006194]">
                  Appointment Booking
                </span>
                <h4 className="text-lg font-bold text-[#0b1c30]">{bookingDoctor.name}</h4>
                <p className="text-xs text-[#707881]">{bookingDoctor.specialization} • Fee: ${bookingDoctor.consultationFee}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              {/* Step 1: Visit Type */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">
                  1. Choose Consultation Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingType('In-Person')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      bookingType === 'In-Person'
                        ? 'border-[#006194] bg-[#eff4ff] ring-2 ring-[#006194]/20'
                        : 'border-[#bfc7d2] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-[#006194]" />
                    <div>
                      <span className="block text-xs font-bold text-[#0b1c30]">In-Person Visit</span>
                      <span className="block text-[11px] text-[#707881]">{bookingDoctor.room}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('Telehealth')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      bookingType === 'Telehealth'
                        ? 'border-[#006194] bg-[#eff4ff] ring-2 ring-[#006194]/20'
                        : 'border-[#bfc7d2] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <Video className="w-5 h-5 text-[#006194]" />
                    <div>
                      <span className="block text-xs font-bold text-[#0b1c30]">Encrypted Video</span>
                      <span className="block text-[11px] text-[#707881]">WebRTC Telehealth Room</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Date Picker */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">
                  2. Select Consultation Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                />
              </div>

              {/* Step 3: Available Time Slots */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">
                  3. Select Available Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {bookingDoctor.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                        bookingTime === slot
                          ? 'bg-[#006194] text-white shadow-xs'
                          : 'bg-[#f8f9ff] text-[#565e74] border border-[#e2e8f0] hover:border-[#006194]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Chief Complaint */}
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">
                  4. Reason for Visit / Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="e.g. Chest discomfort on exertion, recurring headache, medication titration..."
                  className="w-full p-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <span>Confirm Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT CONFIRMATION MODAL */}
      {confirmedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] relative text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Booking Confirmed
            </span>
            <h3 className="text-xl font-bold text-[#0b1c30] mt-1">Appointment Slip Generated</h3>
            <p className="text-xs text-[#707881] mt-1">
              Your consultation has been committed to the hospital master schedule.
            </p>

            {/* Ticket Slip Details */}
            <div className="my-6 p-4 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0] text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
                <span className="text-[#707881]">Appointment ID:</span>
                <span className="font-mono font-bold text-[#006194]">{confirmedAppointment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707881]">Doctor:</span>
                <span className="font-bold text-[#0b1c30]">{confirmedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707881]">Date & Time:</span>
                <span className="font-bold text-[#0b1c30]">{confirmedAppointment.date} at {confirmedAppointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707881]">Location:</span>
                <span className="font-semibold text-[#0b1c30]">{confirmedAppointment.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#707881]">Format:</span>
                <span className="font-semibold text-[#006194]">{confirmedAppointment.type} Visit</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Printing clinical appointment confirmation slip...')}
                className="flex-1 py-2.5 rounded-lg border border-[#bfc7d2] text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedAppointment(null);
                  setActiveView('my-appointments');
                }}
                className="flex-1 py-2.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold shadow-xs"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setReschedulingApt(null)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-[#0b1c30]">Reschedule Appointment</h4>
            <p className="text-xs text-[#707881] mt-1 mb-4">
              {reschedulingApt.doctorName} • Current: {reschedulingApt.date} at {reschedulingApt.time}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">New Time Slot</label>
                <select
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none focus:border-[#006194]"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#006194] hover:bg-[#007bb9] rounded-lg shadow-xs"
                >
                  Update Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-[#0b1c30]">Cancel Consultation?</h4>
            <p className="text-xs text-[#707881] mt-1 mb-4">
              Are you sure you want to cancel appointment #{cancellingApt.id} with {cancellingApt.doctorName}?
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-xs text-[#0b1c30] outline-none"
                >
                  <option value="Conflict in personal schedule">Conflict in personal schedule</option>
                  <option value="Symptoms resolved">Symptoms resolved</option>
                  <option value="Financial or insurance concern">Financial or insurance concern</option>
                  <option value="Prefer different doctor or time">Prefer different doctor or time</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingApt(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#f8f9ff] rounded-lg"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                >
                  Yes, Cancel Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
