import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Role } from '../../types';
import {
  Activity,
  Building2,
  ChevronDown,
  Bell,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Shield,
  Stethoscope,
  Check,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { currentUser, currentRole, switchRole, logout, notifications, showToast } = useHospital();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<Role, { title: string; badge: string; color: string }> = {
    patient: { title: 'Patient', badge: 'Patient Portal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    doctor: { title: 'Attending MD', badge: 'Attending MD', color: 'bg-[#cce5ff] text-[#001d31] border-[#93ccff]' },
    receptionist: { title: 'Station Desk', badge: 'Station Desk', color: 'bg-[#dae2fd] text-[#131b2e] border-[#bec6e0]' },
    admin: { title: 'Super Admin', badge: 'Super Admin (Lvl 5)', color: 'bg-[#ffdad6] text-[#93000a] border-[#ffdad6]' }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] px-4 lg:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Hamburger & Hospital Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 lg:hidden rounded-lg text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
          title="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#006194] flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-[#0b1c30] leading-none tracking-tight">
              MetroHealth Pavilion
            </span>
            <span className="text-[11px] text-[#707881] font-medium hidden sm:inline">
              St. Jude Memorial Hospital
            </span>
          </div>
        </div>

        {/* Clinical Unit Selector (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-xs font-medium text-[#0b1c30]">
          <Building2 className="w-3.5 h-3.5 text-[#006194]" />
          <span>Unit 4B - Acute Triage</span>
          <ChevronDown className="w-3 h-3 text-[#707881]" />
        </div>
      </div>

      {/* Right: Quick Role Switcher, Alerts, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fast Role Perspective Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] border border-[#dce9ff] transition-all text-xs font-semibold text-[#006194]"
            title="Switch User Role Perspective"
          >
            <span className="w-2 h-2 rounded-full bg-[#006194] animate-pulse"></span>
            <span className="uppercase tracking-wider text-[10px] sm:text-xs">
              Role: {roleLabels[currentRole].badge}
            </span>
            <ChevronDown className="w-3 h-3 text-[#006194]" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-1.5 z-50 text-xs font-medium animate-in fade-in">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#707881] border-b border-[#f1f5f9] mb-1">
                Switch Role Perspective
              </div>
              <button
                type="button"
                onClick={() => {
                  switchRole('patient');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                  currentRole === 'patient' ? 'bg-[#eff4ff] text-[#006194] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                }`}
              >
                <span>👤 Patient (Sarah Miller)</span>
                {currentRole === 'patient' && <Check className="w-3.5 h-3.5 text-[#006194]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  switchRole('doctor');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                  currentRole === 'doctor' ? 'bg-[#eff4ff] text-[#006194] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                }`}
              >
                <span>🩺 Doctor (Dr. Sarah Chen, MD)</span>
                {currentRole === 'doctor' && <Check className="w-3.5 h-3.5 text-[#006194]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  switchRole('receptionist');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                  currentRole === 'receptionist' ? 'bg-[#eff4ff] text-[#006194] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                }`}
              >
                <span>🖥️ Receptionist (Elena Vance)</span>
                {currentRole === 'receptionist' && <Check className="w-3.5 h-3.5 text-[#006194]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  setShowRoleDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                  currentRole === 'admin' ? 'bg-[#eff4ff] text-[#006194] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                }`}
              >
                <span>🛡️ Admin (Dr. Sarah Lin, CMO)</span>
                {currentRole === 'admin' && <Check className="w-3.5 h-3.5 text-[#006194]" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
            title="Notifications & Clinical Alerts"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] mb-2">
                <span className="font-bold text-xs text-[#0b1c30]">Notifications & Alerts</span>
                <span className="text-[10px] text-[#006194] font-semibold">{unreadCount} unread</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#0b1c30]">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#707881]">{n.timestamp}</span>
                    </div>
                    <p className="text-[#565e74] text-[11px] mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help / Guide */}
        <button
          type="button"
          onClick={() =>
            showToast('Help Desk: Dial Ext 9110 for clinical trauma hotline or 4300 for IT support.')
          }
          className="p-2 rounded-lg text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors hidden sm:block"
          title="Hospital Support & Help"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        {/* User Profile & Logout */}
        <div className="relative pl-1 sm:pl-2 border-l border-[#e2e8f0]">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#eff4ff] transition-colors"
          >
            <div className="text-right hidden md:block">
              <span className="block text-xs font-bold text-[#0b1c30] leading-tight">
                {currentUser?.name || 'Guest'}
              </span>
              <span className="block text-[10px] text-[#707881]">
                {currentUser?.department || currentUser?.specialization || 'Patient'}
              </span>
            </div>
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128'
              }
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-[#bfc7d2]"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e2e8f0] p-2 z-50 text-xs animate-in fade-in">
              <div className="p-2 border-b border-[#f1f5f9] mb-1">
                <div className="font-bold text-[#0b1c30]">{currentUser?.name}</div>
                <div className="text-[11px] text-[#707881]">{currentUser?.email}</div>
                {currentUser?.mrn && (
                  <div className="text-[10px] font-mono text-[#006194] mt-0.5 font-bold">
                    {currentUser.mrn}
                  </div>
                )}
                {currentUser?.clearance && (
                  <div className="text-[10px] text-[#006577] mt-0.5">{currentUser.clearance}</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Lock Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
