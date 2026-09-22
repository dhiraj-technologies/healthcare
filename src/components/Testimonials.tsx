import React from 'react';
import { TESTIMONIALS } from '../data/careData.ts';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f0fa] text-[#006591] text-xs font-bold uppercase tracking-wider">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#00a0e3]" />
            Real Family Stories
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b3b6f] font-heading tracking-tight">
            Voices of Relieved Families
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Read how our compassionate nursing staff and ICU attendants brought peace of mind and professional healing right inside homes across Delhi NCR.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition duration-200"
              id={`review-card-${t.id}`}
            >
              <div className="space-y-4">
                
                {/* 5 Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  {t.quote}
                </p>

              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-full bg-[#1b3b6f] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1b3b6f] flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <span title="Verified Family">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
