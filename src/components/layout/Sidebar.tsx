import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Role } from '../../types';
import {
  Activity,
  Stethoscope,
  ShieldCheck,
  User,
  Calendar,
  Search,
  History,
  Clock,
  ClipboardList,
  Users,
  Building,
  BarChart3,
  FileText,
  Settings,
  Database,
  LogOut,
  Bell,
  HeartPulse,
  BedDouble,
  UserPlus,
  Ticket
} from 'lucide-react';

interface SidebarProps {
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobileMenu }) => {
  const { currentRole, activeView, setActiveView, switchRole, logout } = useHospital();

  const handleNavClick = (viewKey: string) => {
    setActiveView(viewKey);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const handlePerspectiveSwitch = (role: Role) => {
    switchRole(role);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  // Nav items per role
  const patientNav = [
    { key: 'dashboard', label: 'Dashboard', icon: Activity },
    { key: 'find-doctors', label: 'Find Doctors', icon: Search },
    { key: 'my-appointments', label: 'My Appointments', icon: Calendar },
    { key: 'history', label: 'Appointment History', icon: History },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'profile', label: 'My Health Profile', icon: User }
  ];

  const doctorNav = [
    { key: 'dashboard', label: 'Doctor Dashboard', icon: Activity },
    { key: 'today-appointments', label: "Today's Appointments", icon: Calendar },
    { key: 'upcoming-appointments', label: 'Upcoming Appointments', icon: Clock },
    { key: 'manage-schedule', label: 'Manage Schedule', icon: ClipboardList },
    { key: 'manage-availability', label: 'Manage Availability', icon: HeartPulse },
    { key: 'patient-info', label: 'Patient Information', icon: Users },
    { key: 'notifications', label: 'Clinical Alerts', icon: Bell },
    { key: 'profile', label: 'Doctor Profile', icon: User }
  ];

  const receptionistNav = [
    { key: 'dashboard', label: 'Desk Dashboard', icon: Activity },
    { key: 'register-patient', label: 'Register Patient', icon: UserPlus },
    { key: 'book-appointment', label: 'Book Appointment', icon: Calendar },
    { key: 'walk-in', label: 'Walk-in Patients', icon: Ticket },
    { key: 'manage-queue', label: 'Manage Queue', icon: Clock },
    { key: 'doctor-schedule', label: 'Doctor Schedule', icon: Stethoscope },
    { key: 'patient-search', label: 'Patient Search', icon: Search },
    { key: 'reports', label: 'Reports & Logs', icon: FileText }
  ];

  const adminNav = [
    { key: 'dashboard', label: 'Executive Dashboard', icon: Activity },
    { key: 'manage-patients', label: 'Manage Patients', icon: Users },
    { key: 'manage-doctors', label: 'Manage Doctors', icon: Stethoscope },
    { key: 'manage-departments', label: 'Manage Departments', icon: Building },
    { key: 'manage-receptionists', label: 'Manage Receptionists', icon: Users },
    { key: 'manage-appointments', label: 'Manage Appointments', icon: Calendar },
    { key: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { key: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { key: 'hospital-settings', label: 'Hospital Settings', icon: Settings },
    { key: 'system-config', label: 'System & Architecture', icon: Database }
  ];

  const currentNavItems =
    currentRole === 'patient'
      ? patientNav
      : currentRole === 'doctor'
      ? doctorNav
      : currentRole === 'receptionist'
      ? receptionistNav
      : adminNav;

  return (
    <aside className="w-64 h-full bg-white border-r border-[#e2e8f0] flex flex-col justify-between shadow-xs select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 bg-[#eff4ff] border-b border-[#e2e8f0]">
        <div className="w-8 h-8 rounded-lg bg-[#006194] flex items-center justify-center text-white shadow-xs">
          <Activity className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-[#0b1c30] leading-none">MediCore OS</span>
          <span className="text-[11px] text-[#707881] font-semibold uppercase tracking-wider mt-0.5">
            Clinical Portal
          </span>
        </div>
      </div>

      {/* Main Nav Scrollable Area */}
      <div className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {/* Role Perspectives Quick Switches */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#707881]">
            Role Perspectives
          </div>
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handlePerspectiveSwitch('doctor')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'doctor'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor View</span>
            </button>

            <button
              type="button"
              onClick={() => handlePerspectiveSwitch('receptionist')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'receptionist'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Receptionist View</span>
            </button>

            <button
              type="button"
              onClick={() => handlePerspectiveSwitch('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin View</span>
            </button>

            <button
              type="button"
              onClick={() => handlePerspectiveSwitch('patient')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'patient'
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>
          </div>
        </div>

        {/* Dynamic Modules Section for active role */}
        <div className="pt-2 border-t border-[#f1f5f9]">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#707881]">
            {currentRole.toUpperCase()} MODULES
          </div>
          <nav className="space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#e5eeff] text-[#006194] font-bold shadow-2xs'
                      : 'text-[#565e74] hover:bg-[#f8f9ff] hover:text-[#0b1c30]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#006194]' : 'text-[#707881]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* EHR Connectivity Footer matching screenshots */}
      <div className="p-4 bg-[#eff4ff] border-t border-[#e2e8f0] flex flex-col gap-1 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#565e74]">EHR Connectivity</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#131b2e] font-bold text-[10px]">
            HL7 v2.8
          </span>
        </div>
        <div className="text-[10px] text-[#707881] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sync: Continuous (0 ms latency)</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-[#bfc7d2] bg-white text-[#565e74] hover:text-red-600 hover:border-red-200 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
