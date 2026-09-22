import React from 'react';
import { REGIONAL_HUBS } from '../data/careData.ts';
import { MapPin, Phone, Building2, Send, Navigation } from 'lucide-react';

interface RegionalHubsProps {
  onRequestDispatch: (hubName: string) => void;
}

export const RegionalHubs: React.FC<RegionalHubsProps> = ({ onRequestDispatch }) => {
  return (
    <section id="hubs-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f0fa] text-[#006591] text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-[#00a0e3]" />
            Local NCR Network
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b3b6f] font-heading tracking-tight">
            4 Dedicated Hubs for Rapid Mobilization
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            To guarantee rapid 45-minute bedside deployment, Care Health Nurses operates 4 strategic regional dispatch branches across Delhi, Noida, and Ghaziabad.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REGIONAL_HUBS.map((hub) => (
            <div
              key={hub.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md ${
                hub.headOffice
                  ? 'bg-gradient-to-b from-[#f0f7fd] to-white border-[#00a0e3]/40'
                  : 'bg-white border-slate-200'
              }`}
              id={`hub-card-${hub.id}`}
            >
              <div className="space-y-3.5">
                
                {/* Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      hub.headOffice
                        ? 'bg-[#00a0e3] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {hub.badge}
                  </span>
                  <Building2 className={`w-4 h-4 ${hub.headOffice ? 'text-[#00a0e3]' : 'text-slate-400'}`} />
                </div>

                {/* Hub Name */}
                <h3 className="text-base font-bold text-[#1b3b6f] font-heading">
                  {hub.name}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-[#00a0e3] shrink-0 mt-0.5" />
                  <span>{hub.address}</span>
                </div>

                {/* Servicing Coverage */}
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                  {hub.servicingAreas}
                </div>

              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <a
                  href={`tel:${hub.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full bg-[#1b3b6f] hover:bg-[#152e57] text-white font-semibold text-xs py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>{hub.phone}</span>
                </a>

                <button
                  onClick={() => onRequestDispatch(hub.name)}
                  className="w-full bg-[#e6f0fa] hover:bg-[#00a0e3] text-[#006591] hover:text-white font-bold text-xs py-2 px-3 rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Dispatch From Here</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
