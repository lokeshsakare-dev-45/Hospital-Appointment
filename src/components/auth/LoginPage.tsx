import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Role } from '../../types';
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, showToast } = useHospital();

  const [identifier, setIdentifier] = useState('patient@metrohealth.org');
  const [password, setPassword] = useState('MetroHealth2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '28',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered Email or Mobile Number');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(identifier, password, selectedRole);
      setIsLoading(false);
      if (!success) {
        setErrorMsg('Invalid clinical credentials. Please check your username and password.');
      }
    }, 450);
  };

  const handleDemoFill = (role: Role, demoEmail: string) => {
    setSelectedRole(role);
    setIdentifier(demoEmail);
    setPassword('MetroHealth2026!');
    setErrorMsg('');
  };

  const handleQuickLogin = (role: Role, demoEmail: string) => {
    setSelectedRole(role);
    setIdentifier(demoEmail);
    setPassword('MetroHealth2026!');
    setIsLoading(true);
    setTimeout(() => {
      login(demoEmail, 'MetroHealth2026!', role);
      setIsLoading(false);
    }, 250);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      showToast(`Password reset instructions sent to ${resetEmail}`);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.phone || !regForm.password) {
      showToast('Please fill in all mandatory patient fields.');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      showToast('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(regForm.email, regForm.password, 'patient');
      setIsLoading(false);
      setShowRegisterModal(false);
      showToast(`Patient account created for ${regForm.name}! Generated MRN automatically.`);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col justify-between selection:bg-[#cce5ff] text-[#0b1c30]">
      {/* Top Clinical Nav Bar */}
      <header className="w-full h-16 bg-white border-b border-[#e2e8f0] px-6 lg:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#006194] flex items-center justify-center text-white shadow-sm">
            <Activity className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight text-[#006194] tracking-tight">
              MetroHealth Pavilion
            </span>
            <span className="text-xs text-[#707881] font-medium tracking-wide">
              St. Jude Memorial Hospital • Clinical Access Gateway
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-[#565e74]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5eeff] text-[#006194]">
            <span className="w-2 h-2 rounded-full bg-[#006194] animate-pulse"></span>
            HL7 v2.8 Live Telemetry
          </span>
          <span className="inline-flex items-center gap-1 text-[#006577]">
            <ShieldCheck className="w-4 h-4" /> HIPAA Certified
          </span>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#e2e8f0] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero & Clinical Identity (5 cols on Desktop) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#006194] via-[#007bb9] to-[#004e5c] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background ambient medical accent circles */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#4cd7f6]/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold tracking-wide backdrop-blur-md mb-6">
                <Building2 className="w-3.5 h-3.5" />
                Enterprise Health Portal
              </div>
              <h2 className="text-2xl font-bold tracking-tight leading-snug">
                Hospital Appointment Management System
              </h2>
              <p className="text-sm text-blue-100 mt-2 font-normal leading-relaxed">
                Single integrated clinical workspace connecting patients, attending physicians,
                front-desk triage, and hospital administration.
              </p>
            </div>

            {/* Live Hospital Telemetry Pill Highlights */}
            <div className="relative z-10 my-8 space-y-3">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">14 Specialist Clinics</div>
                  <div className="text-[11px] text-blue-100">Real-time scheduling & virtual rooms</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Live Queue & Triage Desk</div>
                  <div className="text-[11px] text-blue-100">Zero latency token and bed allocation</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100">
              <span>Security Clearance Lvl 1 - 5</span>
              <span>256-bit AES Encrypted</span>
            </div>
          </div>

          {/* Right Form Area (7 cols on Desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006194]">
                  Clinical Sign-In
                </span>
                <span className="text-xs text-[#707881]">Secure Session</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0b1c30]">Welcome to Portal</h3>
              <p className="text-xs sm:text-sm text-[#565e74] mt-1">
                Enter your credentials or choose a role below for immediate demo access.
              </p>

              {/* 1-Click Role Demo Selector Chips */}
              <div className="mt-4 mb-6">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#707881] mb-2">
                  Select or Test Role Perspective:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('patient', 'patient@metrohealth.org')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedRole === 'patient'
                        ? 'border-[#006194] bg-[#eff4ff] ring-2 ring-[#006194]/20'
                        : 'border-[#e2e8f0] bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#006194]">Patient</span>
                    <span className="text-[10px] text-[#565e74] truncate">Sarah Miller</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoFill('doctor', 'doctor@metrohealth.org')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedRole === 'doctor'
                        ? 'border-[#006194] bg-[#eff4ff] ring-2 ring-[#006194]/20'
                        : 'border-[#e2e8f0] bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#006194]">Doctor</span>
                    <span className="text-[10px] text-[#565e74] truncate">Dr. Sarah Chen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoFill('receptionist', 'receptionist@metrohealth.org')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedRole === 'receptionist'
                        ? 'border-[#006194] bg-[#eff4ff] ring-2 ring-[#006194]/20'
                        : 'border-[#e2e8f0] bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#006194]">Receptionist</span>
                    <span className="text-[10px] text-[#565e74] truncate">Elena Vance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoFill('admin', 'admin@metrohealth.org')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedRole === 'admin'
                        ? 'border-[#006194] bg-[#eff4ff] ring-2 ring-[#006194]/20'
                        : 'border-[#e2e8f0] bg-white hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#006194]">Admin</span>
                    <span className="text-[10px] text-[#565e74] truncate">Dr. Sarah Lin</span>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0"></span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                    Email OR Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707881]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. patient@metrohealth.org or 555-234-5678"
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#bfc7d2] bg-white text-sm text-[#0b1c30] placeholder:text-[#707881] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#0b1c30]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setResetSent(false);
                      }}
                      className="text-xs font-semibold text-[#006194] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707881]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 pl-10 pr-11 rounded-lg border border-[#bfc7d2] bg-white text-sm text-[#0b1c30] placeholder:text-[#707881] focus:outline-none focus:border-[#006194] focus:ring-2 focus:ring-[#006194]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#707881] hover:text-[#0b1c30] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#006194] hover:bg-[#007bb9] active:bg-[#004b73] text-white rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Sign In as {selectedRole.toUpperCase()}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Actions: Register & Direct Role Switcher */}
            <div className="pt-6 mt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1 text-[#565e74]">
                <span>New patient to MetroHealth?</span>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="font-bold text-[#006194] hover:underline"
                >
                  Create Account / Register
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[#707881]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006577]" />
                <span>HIPAA Secured Session</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#707881] border-t border-[#e2e8f0] bg-white">
        © 2026 Hospital Appointment Management System — St. Jude Memorial Hospital / MetroHealth Pavilion. All Rights Reserved.
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#e2e8f0] relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#006194] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold text-[#0b1c30]">Reset Clinical Access</h4>
            <p className="text-xs text-[#565e74] mt-1 mb-4">
              Enter your registered hospital email address or phone number. We will transmit an encrypted verification token to restore your credentials.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Recovery Instructions Sent!
                </div>
                <p>
                  A temporary access link has been dispatched to <strong>{resetEmail}</strong>. Please check your inbox or SMS.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-3 w-full py-2 bg-[#006194] text-white rounded-lg font-semibold hover:bg-[#007bb9]"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Email Address or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. doctor@metrohealth.org"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#eff4ff] rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#006194] hover:bg-[#007bb9] rounded-lg shadow-sm"
                  >
                    Send Recovery Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Patient Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] relative my-8">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 p-1.5 text-[#707881] hover:text-[#0b1c30] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#006194] text-white flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0b1c30]">Register Patient Account</h4>
                <p className="text-xs text-[#565e74]">
                  Create an instant EHR record with automated Medical Record Number (MRN)
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Sarah Miller"
                  className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={regForm.age}
                    onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">Gender</label>
                  <select
                    value={regForm.gender}
                    onChange={(e) => setRegForm({ ...regForm, gender: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="Re-type password"
                    className="w-full h-10 px-3 rounded-lg border border-[#bfc7d2] text-sm text-[#0b1c30] focus:ring-2 focus:ring-[#006194]/20 focus:border-[#006194] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#565e74] hover:bg-[#eff4ff] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#006194] hover:bg-[#007bb9] rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <span>Complete Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
