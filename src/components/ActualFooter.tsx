import React from 'react';
import { Phone, ShieldCheck, Activity, ArrowUp, Shield } from 'lucide-react';

interface ActualFooterProps {
  onOpenBooking: (serviceName?: string) => void;
  onOpenPortal: () => void;
  onOpenAdminPanel?: () => void;
}

export const ActualFooter: React.FC<ActualFooterProps> = ({ onOpenBooking, onOpenPortal, onOpenAdminPanel }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1c3e66] text-slate-200 text-xs">
      
      {/* Footer Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Circular Logo */}
          <div className="md:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="w-[140px] h-[140px] rounded-full bg-white p-3 shadow-xl flex items-center justify-center mb-4">
              <img
                src="https://carehealthnursing.com/images/Logo%20Care.webp"
                alt="Care Health Nurses Pvt Ltd Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://carehealthnursing.com/images/logo.png';
                }}
              />
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-xs font-semibold">
              Care Health Nurses Pvt. Ltd. <br />
              Best Patient Care Services in Noida, Delhi, Gurgaon, Lucknow and Kanpur.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-blue-400/30 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-300 font-semibold">
              <li>
                <button onClick={() => scrollTo('home')} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className="hover:text-white transition">
                  Company Profile
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('services')} className="hover:text-white transition">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('gallery')} className="hover:text-white transition">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-white transition">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className="hover:text-white transition">
                  Contact
                </button>
              </li>
              <li className="pt-2 flex flex-col gap-1.5">
                {onOpenAdminPanel && (
                  <button
                    onClick={onOpenAdminPanel}
                    className="inline-flex items-center gap-1.5 text-purple-300 font-bold hover:underline text-left"
                    id="btn-footer-admin"
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Admin Control Center (Staff &amp; Patients)</span>
                  </button>
                )}
                <button
                  onClick={onOpenPortal}
                  className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline text-left"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clinical Portal (RBAC)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Breakdown (2 sub-columns) */}
          <div className="md:col-span-6 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-blue-400/30 pb-2">
              Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-semibold">
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onOpenBooking('Male / Female Nurses Staff')} className="hover:text-white text-left">
                    Male / Female Nurses Staff
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenBooking('Male Attendant')} className="hover:text-white text-left">
                    Male Attendant
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenBooking('Female Attendants')} className="hover:text-white text-left">
                    Female Attendants / Nursing Attendants
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenBooking('Senior Citizens Caretaker')} className="hover:text-white text-left">
                    Elder / Old &amp; Senior Citizens Caretaker
                  </button>
                </li>
              </ul>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onOpenBooking('Baby Care / New Born Care')} className="hover:text-white text-left">
                    Baby Care / New Born Care
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenBooking('Home Patient Care')} className="hover:text-white text-left">
                    Home Patient Care
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenBooking('Ayas Or Maid Services')} className="hover:text-white text-left">
                    Ayas Or Maid Services
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenBooking('Physiotherapy Services')} className="hover:text-white text-left">
                    Physiotherapy Services
                  </button>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onOpenBooking()}
                className="actual-btn text-xs py-2 px-5 bg-white text-[#163A6B] hover:bg-[#28568d] hover:text-white"
              >
                Book Home Care
              </button>
              <a
                href="tel:+919999790231"
                className="actual-btn text-xs py-2 px-5 bg-[#00a0e3] text-white border-transparent hover:bg-[#008fcb]"
              >
                Call +91-9999790231
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Live Traffic Bar from actual site */}
      <div className="bg-[#142e4d] py-3 text-center text-xs font-semibold text-slate-300 border-t border-b border-blue-900/60">
        <span className="live-dot mr-1.5" />
        <strong className="text-white">18</strong> Online &nbsp;|&nbsp;{' '}
        <strong className="text-white">1,842</strong> Visitors Today &nbsp;|&nbsp;{' '}
        <strong className="text-white">5,420</strong> Page Views
      </div>

      {/* Footer Bottom Copyright */}
      <div className="bg-[#0f243c] py-4 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Copyright 2016 - {new Date().getFullYear()}. Developed By Care Health Nursing Services</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-white flex items-center gap-1 text-[11px]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating 24/7 Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-300 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-3">
        <a
          href="tel:+919999790231"
          className="flex-1 bg-[#163A6B] text-white font-bold text-xs py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call 24/7 Desk</span>
        </a>
        <button
          onClick={() => onOpenBooking()}
          className="flex-1 bg-[#00a0e3] text-white font-bold text-xs py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Book Nurse</span>
        </button>
      </div>

    </footer>
  );
};
