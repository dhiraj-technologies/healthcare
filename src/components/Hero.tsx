import React from 'react';
import { ShieldCheck, Award, Clock, Phone, CalendarCheck, CheckCircle2, Siren, ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenEquipment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f4fa] via-white to-white pt-8 pb-14 border-b border-slate-200">
      {/* Subtle ambient medical background mesh */}
      <div className="absolute top-0 right-0 -z-10 w-[550px] h-[550px] bg-[#00a0e3]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[450px] h-[450px] bg-[#1b3b6f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Regional Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e6f0fa] border border-[#c6ddf4] text-[#006591] text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00a0e3] animate-pulse" />
              <span>DELHI NCR'S LEADING HOME HEALTHCARE NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111c2d] leading-[1.18] font-heading tracking-tight">
              Professional Home Nursing &amp; Caregiver Services in <span className="text-[#00a0e3]">Delhi NCR</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Care Health Nurses delivers hospital-grade clinical ICU setup, senior citizen companion care, newborn baby nursing, and specialized patient attendants directly to your residence with 45-minute urgent dispatch.
            </p>

            {/* 3 Core Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-lg border border-slate-200 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#00a0e3] shrink-0" />
                <span className="text-xs font-semibold text-slate-700">100% Police Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-lg border border-slate-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#00a0e3] shrink-0" />
                <span className="text-xs font-semibold text-slate-700">GNM &amp; B.Sc Registered</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-lg border border-slate-200 shadow-xs">
                <Clock className="w-4 h-4 text-[#00a0e3] shrink-0" />
                <span className="text-xs font-semibold text-slate-700">12h &amp; 24h Live-in Shifts</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5"
                id="btn-hero-request-nurse"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Request Home Nurse Now</span>
              </button>

              <a
                href="tel:+919999790231"
                className="bg-[#1b3b6f] hover:bg-[#152e57] text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5"
                id="btn-hero-call-now"
              >
                <Phone className="w-5 h-5 fill-white" />
                <span>Call +91-9999790231</span>
              </a>
            </div>

            {/* Award Recognition Endorsement */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-200">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Recognized by <strong className="text-slate-700">Brand Empower &amp; National Quality Awards</strong> for Outstanding Home Healthcare in North India.
              </span>
            </div>

          </div>

          {/* Right Column: Immediate Nurse Deployment Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative">
              
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#00a0e3]/10 text-[#00a0e3] flex items-center justify-center">
                    <Siren className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1b3b6f]">Immediate Nurse Deployment</h3>
                    <p className="text-[11px] text-slate-500">Live Care Coordinator Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>OPEN 24/7</span>
                </div>
              </div>

              {/* Verified Staff Image with Floating Badges */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&auto=format&fit=crop&q=80"
                  alt="Verified Home Healthcare Nurses Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Image Overlays */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-[#1b3b6f] flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Medical Team</span>
                  </div>
                  <div className="bg-[#00a0e3] text-white px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm">
                    45 Min Response
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="bg-[#f0f4fa] p-3 rounded-lg border border-slate-200/80">
                  <div className="text-xs font-semibold text-[#1b3b6f] flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#00a0e3]" />
                    Central Care Coordinator Desk
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct hotline for emergency hospital discharge, stroke management &amp; ICU setup.
                  </p>
                </div>

                {/* Emergency Hotline Button */}
                <a
                  href="tel:+919999790231"
                  className="w-full bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-sm py-3 px-4 rounded-lg shadow transition flex items-center justify-center gap-2 group"
                  id="btn-card-emergency-call"
                >
                  <Phone className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
                  <span>Emergency Call: 91-9999790231</span>
                </a>

                {/* Footer Micro-Perks */}
                <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0% Hidden Cost
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Free Consultation
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
