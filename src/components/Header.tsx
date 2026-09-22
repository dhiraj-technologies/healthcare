import React, { useState } from 'react';
import { Phone, Mail, Award, Clock, ShieldCheck, UserCheck, LogOut, ChevronDown, Stethoscope, Menu, X, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  onOpenBooking: (prefillService?: string) => void;
  onOpenAuth: () => void;
  onOpenPortal: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenAuth,
  onOpenPortal,
  activeSection,
  setActiveSection
}) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection('home');
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm bg-white font-sans">
      {/* Top Navy Bar */}
      <div className="bg-[#1b3b6f] text-white text-xs py-1.5 px-4 sm:px-8 border-b border-[#264985]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Accreditations */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-slate-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-[#00a0e3]" />
              Govt. Regd. & ISO 9001:2015 Certified Home Healthcare
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#00a0e3]" />
              24x7 Emergency In-Home Clinical Dispatch Across Delhi NCR
            </span>
          </div>

          {/* Right Direct Hotlines */}
          <div className="flex items-center gap-4 flex-wrap ml-auto text-slate-200">
            <a href="mailto:carehealthnurses@gmail.com" className="hidden lg:flex items-center gap-1 hover:text-[#00a0e3] transition">
              <Mail className="w-3.5 h-3.5 text-[#00a0e3]" />
              carehealthnurses@gmail.com
            </a>
            <a href="tel:+919999790231" className="flex items-center gap-1 font-semibold text-white hover:text-[#00a0e3] transition">
              <Phone className="w-3.5 h-3.5 text-[#00a0e3]" />
              +91-9999790231
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a href="tel:+919999407473" className="hidden sm:flex items-center gap-1 font-medium hover:text-[#00a0e3] transition">
              +91-9999407473
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveSection('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-brand-logo"
        >
          <div className="w-10 h-10 rounded-lg bg-[#00a0e3] flex items-center justify-center text-white shadow-md shadow-[#00a0e3]/20 group-hover:bg-[#008fcb] transition">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-[#1b3b6f] flex items-center gap-1 leading-none font-heading">
              <span>Care Health</span>
              <span className="text-[#00a0e3]">Nurses</span>
              <span className="text-xs font-normal text-slate-400 ml-1">Pvt. Ltd.</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
              CLINICAL HOME HEALTHCARE & ICU ATTENDANTS
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1e293b]">
          <button 
            onClick={() => { setActiveSection('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`transition hover:text-[#00a0e3] ${activeSection === 'home' ? 'text-[#00a0e3] font-semibold' : ''}`}
          >
            Home
          </button>
          <button onClick={() => scrollTo('services-section')} className="transition hover:text-[#00a0e3]">
            Services
          </button>
          <button onClick={() => scrollTo('equipment-section')} className="transition hover:text-[#00a0e3]">
            Medical Equipment
          </button>
          <button onClick={() => scrollTo('awards-section')} className="transition hover:text-[#00a0e3]">
            About & Awards
          </button>
          <button onClick={() => scrollTo('hubs-section')} className="transition hover:text-[#00a0e3]">
            NCR Branches
          </button>
          <button onClick={() => scrollTo('testimonials-section')} className="transition hover:text-[#00a0e3]">
            Reviews
          </button>
          <button onClick={() => scrollTo('contact-section')} className="transition hover:text-[#00a0e3]">
            Contact
          </button>
        </nav>

        {/* Action CTAs & Auth/Portal */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Demo Role Picker (Convenience for testing RBAC) */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md flex items-center gap-1 font-medium border border-slate-200"
              title="Quickly test Role-Based Access Control"
              id="demo-role-switcher"
            >
              <span>Demo Roles</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  1-Click Test Personas
                </div>
                <button
                  onClick={() => { quickDemoLogin('admin'); setDemoMenuOpen(false); onOpenPortal(); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                >
                  <div>
                    <div className="font-semibold text-[#1b3b6f]">Dr. Alok Verma</div>
                    <div className="text-[11px] text-slate-500">Role: Clinical Director (Admin)</div>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">ADMIN</span>
                </button>
                <button
                  onClick={() => { quickDemoLogin('nurse'); setDemoMenuOpen(false); onOpenPortal(); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                >
                  <div>
                    <div className="font-semibold text-[#1b3b6f]">Sister Priya Sharma</div>
                    <div className="text-[11px] text-slate-500">Role: Registered ICU Nurse</div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">NURSE</span>
                </button>
                <button
                  onClick={() => { quickDemoLogin('patient'); setDemoMenuOpen(false); onOpenPortal(); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                >
                  <div>
                    <div className="font-semibold text-[#1b3b6f]">Rajesh Khanna</div>
                    <div className="text-[11px] text-slate-500">Role: Family Rep (Patient)</div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">PATIENT</span>
                </button>
              </div>
            )}
          </div>

          {/* Clinical Portal / Login Button */}
          {user ? (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 pl-2.5 rounded-lg border border-slate-200">
              <button 
                onClick={onOpenPortal}
                className="flex items-center gap-2 text-left"
                id="btn-open-portal"
              >
                <div className="w-6 h-6 rounded-full bg-[#1b3b6f] text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-[#1b3b6f] leading-tight flex items-center gap-1">
                    {user.name.split(' ')[0]}
                    <span className="text-[10px] uppercase font-bold px-1 py-0.2 rounded bg-[#00a0e3]/10 text-[#006591]">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Clinical Portal</div>
                </div>
              </button>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1 text-slate-400 hover:text-red-600 rounded transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs sm:text-sm font-semibold text-[#1b3b6f] hover:text-[#00a0e3] px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-200 hover:border-[#00a0e3] transition flex items-center gap-1.5"
              id="btn-header-login"
            >
              <UserCheck className="w-4 h-4 text-[#00a0e3]" />
              <span className="hidden sm:inline">Clinical</span> Portal
            </button>
          )}

          {/* Direct 24/7 Hotline Pill */}
          <a
            href="tel:+919999790231"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#1b3b6f] bg-[#e6f0fa] hover:bg-[#d8e8f8] px-3 py-2 rounded-lg border border-[#c6ddf4] transition"
            id="btn-header-phone"
          >
            <Phone className="w-3.5 h-3.5 text-[#00a0e3] fill-[#00a0e3]" />
            <span>24/7: 91-9999790231</span>
          </a>

          {/* Book Nurse Primary CTA */}
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#00a0e3] hover:bg-[#008fcb] text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5"
            id="btn-header-book-nurse"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book Nurse</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button 
              onClick={() => { setActiveSection('home'); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 font-medium text-slate-800"
            >
              Home
            </button>
            <button 
              onClick={() => scrollTo('services-section')}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 font-medium text-slate-800"
            >
              Services
            </button>
            <button 
              onClick={() => scrollTo('equipment-section')}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 font-medium text-slate-800"
            >
              Medical Equipment
            </button>
            <button 
              onClick={() => scrollTo('awards-section')}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 font-medium text-slate-800"
            >
              About & Awards
            </button>
            <button 
              onClick={() => scrollTo('hubs-section')}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 font-medium text-slate-800"
            >
              NCR Branches
            </button>
            <button 
              onClick={() => scrollTo('testimonials-section')}
              className="text-left py-2 px-3 rounded hover:bg-slate-50 font-medium text-slate-800"
            >
              Reviews
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Test Portals (RBAC)</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => { quickDemoLogin('admin'); setMobileMenuOpen(false); onOpenPortal(); }}
                className="py-1.5 px-2 bg-purple-50 text-purple-700 font-semibold rounded border border-purple-200 text-center"
              >
                Admin
              </button>
              <button
                onClick={() => { quickDemoLogin('nurse'); setMobileMenuOpen(false); onOpenPortal(); }}
                className="py-1.5 px-2 bg-blue-50 text-blue-700 font-semibold rounded border border-blue-200 text-center"
              >
                Nurse
              </button>
              <button
                onClick={() => { quickDemoLogin('patient'); setMobileMenuOpen(false); onOpenPortal(); }}
                className="py-1.5 px-2 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200 text-center"
              >
                Family
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
