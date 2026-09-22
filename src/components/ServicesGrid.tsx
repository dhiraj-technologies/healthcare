import React from 'react';
import { CLINICAL_SERVICES } from '../data/careData.ts';
import { ArrowRight, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';

interface ServicesGridProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  return (
    <section id="services-section" className="py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f0fa] text-[#006591] text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-[#00a0e3]" />
            Hospital-Grade Protocols
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b3b6f] font-heading tracking-tight">
            Comprehensive Clinical &amp; Bedside Nursing Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From high-dependency intensive care to daily personal companioning, our vetted healthcare staff deliver hospital standard protocols right in the comfort of your home.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CLINICAL_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col overflow-hidden group"
              id={`service-card-${srv.id}`}
            >
              {/* Image with Tag Header */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1b3b6f]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs">
                    {srv.tag}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3">
                  <span className="text-[11px] font-medium text-slate-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00a0e3]" />
                    {srv.tagType}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#1b3b6f] group-hover:text-[#00a0e3] transition font-heading">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  {/* Meta tag */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{srv.metaLabel}:</span>
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {srv.metaValue}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectService(srv.title)}
                    className="w-full bg-[#e6f0fa] hover:bg-[#00a0e3] text-[#006591] hover:text-white font-bold text-xs py-2.5 px-3 rounded-lg transition duration-150 flex items-center justify-center gap-1.5 group/btn"
                    id={`btn-book-${srv.id}`}
                  >
                    <span>{srv.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
