import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Award, Activity, Heart, ArrowUp } from 'lucide-react';
import { REGIONAL_HUBS } from '../data/careData.ts';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenPortal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1320] text-slate-300 font-sans border-t border-slate-800">
      
      {/* Upper Footer: Branches Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00a0e3] flex items-center justify-center text-white font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight font-heading">
                Care Health <span className="text-[#00a0e3]">Nurses</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delhi NCR's premier certified home nursing bureau. Providing GNM/B.Sc nurses, ICU setups, male &amp; female attendants, and elderly caregivers with rapid 45-minute bedside deployment.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Police Verified &amp; Council Registered</span>
            </div>
          </div>

          {/* Quick Hub Hotlines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Regional Dispatch Hubs
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div>
                <strong className="text-white">Janak Puri (West Delhi):</strong>
                <a href="tel:+919999790231" className="block text-[#00a0e3] hover:underline font-mono mt-0.5">
                  +91-9999790231
                </a>
              </div>
              <div>
                <strong className="text-white">Laxmi Nagar (East Delhi):</strong>
                <a href="tel:+919910531897" className="block text-[#00a0e3] hover:underline font-mono mt-0.5">
                  +91-9910531897
                </a>
              </div>
              <div>
                <strong className="text-white">Indirapuram (Ghaziabad):</strong>
                <a href="tel:+919625436163" className="block text-[#00a0e3] hover:underline font-mono mt-0.5">
                  +91-9625436163
                </a>
              </div>
              <div>
                <strong className="text-white">Noida &amp; Gr. Noida:</strong>
                <a href="tel:+919999407473" className="block text-[#00a0e3] hover:underline font-mono mt-0.5">
                  +91-9999407473
                </a>
              </div>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Clinical Specializations
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="hover:text-white transition">ICU Patient Care At Home</li>
              <li className="hover:text-white transition">Tracheostomy &amp; BiPAP Management</li>
              <li className="hover:text-white transition">Male Attendants (Ward Boys)</li>
              <li className="hover:text-white transition">Female Caregivers &amp; Jabar Care</li>
              <li className="hover:text-white transition">Dementia &amp; Alzheimer's Senior Care</li>
              <li className="hover:text-white transition">Motorized Hospital Beds on Rent</li>
            </ul>
          </div>

          {/* Clinical Portal & Staff Link */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Digital Healthcare Portal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secure patient scheduling, daily vitals trends, medication administration logs, and role-based staff access.
            </p>
            <button
              onClick={onOpenPortal}
              className="w-full bg-[#1b3b6f] hover:bg-[#234b8c] text-white text-xs font-bold py-2.5 px-3 rounded-lg border border-blue-900 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#00a0e3]" />
              <span>Access Clinical RBAC Portal</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="w-full bg-[#00a0e3] hover:bg-[#008fcb] text-white text-xs font-bold py-2 px-3 rounded-lg transition"
            >
              Book Home Nurse Now
            </button>
          </div>

        </div>
      </div>

      {/* Lower Copyright & Legal Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Care Health Nurses Pvt. Ltd. All rights reserved. Registered under Indian Companies Act &amp; MSME.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={scrollToTop} className="hover:text-white flex items-center gap-1 transition">
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating 24/7 Mobile Hotline Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-3">
        <a
          href="tel:+919999790231"
          className="flex-1 bg-[#1b3b6f] text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5 fill-white" />
          <span>Call 24/7 Desk</span>
        </a>
        <button
          onClick={onOpenBooking}
          className="flex-1 bg-[#00a0e3] text-white font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Book Nurse</span>
        </button>
      </div>

    </footer>
  );
};
