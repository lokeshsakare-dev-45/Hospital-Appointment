import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ReceptionistDashboard } from './components/receptionist/ReceptionistDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const HospitalAppContent: React.FC = () => {
  const { currentUser, currentRole, toastMessage } = useHospital();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // STRICT USER CONSTRAINT: "The FIRST SCREEN must be the LOGIN PAGE. Do not create a public landing/home page before login."
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col selection:bg-[#cce5ff] text-[#0b1c30]">
      {/* Top Clinical Header */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Slide-Over Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="relative z-50 w-72 h-full bg-white shadow-2xl">
              <Sidebar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentRole === 'patient' && <PatientDashboard />}
          {currentRole === 'doctor' && <DoctorDashboard />}
          {currentRole === 'receptionist' && <ReceptionistDashboard />}
          {currentRole === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Global Clinical Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-[#0b1c30] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <HospitalAppContent />
    </HospitalProvider>
  );
}
