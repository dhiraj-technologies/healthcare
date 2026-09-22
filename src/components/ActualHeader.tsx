import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Menu, X, Calendar, Activity, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface ActualHeaderProps {
  onOpenBooking: () => void;
  onOpenPortal: () => void;
  onOpenAdminPanel?: () => void;
  onOpenAuth: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const ActualHeader: React.FC<ActualHeaderProps> = ({
  onOpenBooking,
  onOpenPortal,
  onOpenAdminPanel,
  onOpenAuth,
  activeSection = 'home',
  onNavigateSection
}) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) onNavigateSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#28568d] shadow-md border-b border-[#1b3b6f]">
      
      {/* Modern Live Telemetry & Quick Contact Bar (Visible on all screens) */}
      <div className="bg-[#183968] text-white text-[11px] py-1.5 px-4 border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 font-medium tracking-tight">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">
              Live 24/7 Dispatch Active:
            </span>
            <span className="text-slate-200 hidden md:inline">
              West Delhi (Janak Puri) • Noida (Sec 62) • Ghaziabad (Indirapuram) • East Delhi (Laxmi Nagar)
            </span>
            <span className="text-slate-200 md:hidden">
              Delhi NCR Hubs Active Now
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a href="tel:+919999790231" className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition">
              <Phone className="w-3 h-3 text-[#00a0e3]" />
              <span>Emergency 24x7: +91-9999790231</span>
            </a>
            <span className="text-blue-300/40 hidden sm:inline">|</span>
            {onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="text-[10px] bg-purple-700/80 hover:bg-purple-600 text-white font-bold px-2 py-0.5 rounded transition flex items-center gap-1 border border-purple-400/40"
                id="btn-topbar-admin"
              >
                <Shield className="w-3 h-3 text-purple-300" />
                <span>Admin Panel</span>
              </button>
            )}
            <button
              onClick={onOpenPortal}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-0.5 rounded transition flex items-center gap-1"
            >
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>{user ? `Portal (${user.role})` : 'Clinical Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[74px]">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center py-2">
              <img
                src="https://carehealthnursing.com/images/logo.png"
                alt="Care Health Nurses Pvt. Ltd."
                className="h-12 sm:h-14 object-contain brightness-105"
                onError={(e) => {
                  // Fallback in case of external network issues
                  (e.target as HTMLImageElement).src = 'https://carehealthnursing.com/images/Logo%20Care.webp';
                }}
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              onClick={() => scrollTo('home')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                activeSection === 'home'
                  ? 'bg-white text-[#17be13] rounded-sm'
                  : 'text-[#b9c8db] hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9c8db] hover:text-white transition"
            >
              Company Profile
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9c8db] hover:text-white transition"
            >
              Our Services
            </button>
            <button
              onClick={() => scrollTo('why-us')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9c8db] hover:text-white transition"
            >
              Why Us?
            </button>
            <button
              onClick={() => scrollTo('gallery')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9c8db] hover:text-white transition"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9c8db] hover:text-white transition"
            >
              FAQs
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9c8db] hover:text-white transition"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right Angle Contact Box & Portal CTA */}
          <div className="hidden lg:flex items-center">
            
            {/* The actual site's white contact box with blue text */}
            <div className="bg-white rounded-l-2xl py-2 px-5 shadow-inner border-y border-l border-slate-200 text-right pr-4">
              <div className="flex items-center justify-end gap-1.5 text-[13px] font-black text-[#0814c1]">
                <Phone className="w-3.5 h-3.5 text-[#163A6B] shrink-0" />
                <a href="tel:+919999790231" className="hover:underline">
                  91-9999790231, 91-9999407473
                </a>
              </div>
              <div className="text-[11px] font-bold text-slate-700 leading-tight">
                Email: <span className="text-[#0814c1]">carehealthnurses@gmail.com</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Delhi NCR India
              </div>
            </div>

            {/* Clinical Portal & Booking Buttons */}
            <div className="flex items-center gap-2 pl-3">
              {onOpenAdminPanel && (
                <button
                  onClick={onOpenAdminPanel}
                  className="bg-purple-800/90 hover:bg-purple-900 text-purple-100 hover:text-white text-xs font-bold py-2.5 px-3 rounded-full border border-purple-400/50 shadow transition flex items-center gap-1.5"
                  title="Direct Administrator Access to Manage Patient Records & Staff"
                  id="btn-nav-admin"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-300" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={onOpenPortal}
                className="bg-[#163A6B] hover:bg-[#0f294d] text-white text-xs font-bold py-2.5 px-3.5 rounded-full border border-blue-400/40 shadow transition flex items-center gap-1.5"
                title="Access Secure Patient Scheduling & Records Management"
                id="btn-nav-portal"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{user ? `Portal (${user.role})` : 'Clinical Portal'}</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold py-2.5 px-3.5 rounded-full shadow transition"
                id="btn-nav-book"
              >
                Book Nurse
              </button>
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#00a0e3] text-white text-xs font-bold py-1.5 px-3 rounded-full"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1f3c88] border-t border-blue-900 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => scrollTo('home')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              Company Profile
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              Our Services
            </button>
            <button
              onClick={() => scrollTo('why-us')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              Why Us?
            </button>
            <button
              onClick={() => scrollTo('gallery')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              Our Gallery
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              FAQs
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="py-2 px-3 text-left font-bold text-white bg-white/10 rounded"
            >
              Contact Desk
            </button>
          </div>

          <div className="pt-2 border-t border-blue-800/80 space-y-2">
            {onOpenAdminPanel && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdminPanel(); }}
                className="w-full bg-purple-900/90 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border border-purple-400/50 shadow"
                id="btn-mobile-admin"
              >
                <Shield className="w-4 h-4 text-purple-300" />
                <span>Admin Panel (Add/Remove Patients &amp; Staff)</span>
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenPortal(); }}
              className="w-full bg-[#163A6B] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border border-blue-400/30"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Access Clinical Portal (Scheduling &amp; Records)</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}
              className="w-full bg-[#00a0e3] text-white text-xs font-bold py-2.5 px-4 rounded-lg"
            >
              Book Home Care Nurse Now
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
