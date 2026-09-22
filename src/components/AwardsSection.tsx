import React from 'react';
import { Award, ShieldCheck, FileCheck, CheckCircle2, Star, Check } from 'lucide-react';

export const AwardsSection: React.FC = () => {
  return (
    <section id="awards-section" className="py-16 bg-[#f0f4fa] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#006591] text-xs font-bold uppercase tracking-wider border border-slate-200">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Industry Leadership &amp; Trust
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b3b6f] font-heading tracking-tight">
            National Quality &amp; MSME Recognized Home Care
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Care Health Nurses has been consistently honored as North India's benchmark for ethical, reliable, and medically supervised domiciliary nursing.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Award Photos & Trophy Highlight */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
                alt="Brand Empower National Quality Awards Ceremony"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b3b6f]/90 via-[#1b3b6f]/40 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-wide uppercase mb-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  National Quality Award 2024
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  Best Home Healthcare &amp; ICU Nursing in Delhi NCR
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  Presented by Brand Empower for exemplary patient safety and 24/7 clinical reliability.
                </p>
              </div>
            </div>

            {/* Micro Badge Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <div className="text-lg font-bold text-[#1b3b6f]">ISO 9001</div>
                <div className="text-[11px] text-slate-500 font-medium">Certified Quality System</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <div className="text-lg font-bold text-[#00a0e3]">MSME Regd.</div>
                <div className="text-[11px] text-slate-500 font-medium">Govt. of India Recognized</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <div className="text-lg font-bold text-emerald-600">100% Verified</div>
                <div className="text-[11px] text-slate-500 font-medium">Police Clearance Checked</div>
              </div>
            </div>
          </div>

          {/* Right: Why Choose Care Health Nurses */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-xl font-bold text-[#1b3b6f] font-heading">
                Our 4-Tier Verification &amp; Clinical Safety Standards
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e6f0fa] text-[#00a0e3] flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">State Nursing Council Registration</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      Every nurse holds active registration with Delhi Nursing Council (DNC) or UP Nursing Council with verified credentials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e6f0fa] text-[#00a0e3] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Complete Police &amp; Criminal Background Verification</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      100% Aadhaar-linked and state police department verified personnel for total peace of mind for families and seniors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e6f0fa] text-[#00a0e3] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Supervised Care &amp; Dedicated Medical Officer Desk</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      Duty coordinators regularly check vitals charts, physician prescription adherence, and nurse attendance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e6f0fa] text-[#00a0e3] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Immediate Replacement Guarantee</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      Zero downtime. If a staff member is unwell, our 4 regional hubs dispatch a verified replacement within hours.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
