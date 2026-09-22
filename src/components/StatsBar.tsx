import React from 'react';
import { Users, UserCheck, Award, Clock } from 'lucide-react';

export const StatsBar: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#00a0e3] font-heading tracking-tight">
              15,000+
            </span>
            <span className="text-sm font-bold text-[#1b3b6f] mt-1">
              Happy Families Served
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              Across Delhi, Noida &amp; NCR
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#00a0e3] font-heading tracking-tight">
              500+
            </span>
            <span className="text-sm font-bold text-[#1b3b6f] mt-1">
              Qualified Nurses &amp; Staff
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              Hospital trained &amp; background-checked
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#00a0e3] font-heading tracking-tight">
              12+
            </span>
            <span className="text-sm font-bold text-[#1b3b6f] mt-1">
              Years of Service Excellence
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              Pioneering in-home clinical care
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center text-center px-4 pt-4 sm:pt-0">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#00a0e3] font-heading tracking-tight">
              24/7
            </span>
            <span className="text-sm font-bold text-[#1b3b6f] mt-1">
              Emergency Support
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              4 Strategic Regional Hubs
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
