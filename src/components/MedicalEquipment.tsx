import React, { useState } from 'react';
import { MEDICAL_EQUIPMENT_LIST } from '../data/careData.ts';
import { Activity, ShieldCheck, Check, Truck, Phone, ChevronRight } from 'lucide-react';

interface MedicalEquipmentProps {
  onOpenBooking: (prefillService?: string) => void;
}

export const MedicalEquipment: React.FC<MedicalEquipmentProps> = ({ onOpenBooking }) => {
  const [selectedEquip, setSelectedEquip] = useState<string>(MEDICAL_EQUIPMENT_LIST[0].id);

  const activeItem = MEDICAL_EQUIPMENT_LIST.find(e => e.id === selectedEquip) || MEDICAL_EQUIPMENT_LIST[0];

  return (
    <section id="equipment-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f0fa] text-[#006591] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-[#00a0e3]" />
            Complete ICU At Home
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b3b6f] font-heading tracking-tight">
            Hospital-Grade Medical Equipment on Rent &amp; Sale
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Equip your residence with sterilized, biomedical-inspected respiratory and critical care machinery delivered within 2 hours across Delhi NCR.
          </p>
        </div>

        {/* Equipment Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Equipment Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {MEDICAL_EQUIPMENT_LIST.map((equip) => {
              const isSelected = equip.id === selectedEquip;
              return (
                <div
                  key={equip.id}
                  onClick={() => setSelectedEquip(equip.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#f0f7fd] border-[#00a0e3] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  id={`tab-equip-${equip.id}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-[#006591]' : 'text-slate-800'}`}>
                      {equip.title}
                    </h3>
                    <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-[#00a0e3] translate-x-1' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {equip.subtitle}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-semibold text-slate-700">Rent: <span className="text-[#00a0e3]">{equip.rentPrice}</span></span>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-700">Sale: <span className="text-[#1b3b6f]">{equip.buyPrice}</span></span>
                  </div>
                </div>
              );
            })}

            {/* Quick 2-Hour Delivery Callout */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-800">2-Hour Rapid Delivery &amp; Demo</div>
                <div className="text-emerald-700">Certified technician installs and explains operation at bedside.</div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Product Card */}
          <div className="lg:col-span-7 bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Image Banner */}
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                <img
                  src={
                    activeItem.id === 'icu-bed'
                      ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
                      : activeItem.id === 'oxygen-conc'
                      ? 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=80'
                      : activeItem.id === 'bipap-cpap'
                      ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold text-[#1b3b6f] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00a0e3]" />
                  <span>100% Sanitized &amp; Tested</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1b3b6f] font-heading">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {activeItem.subtitle}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Biomedical Specifications &amp; Inclusions:
                </div>
                {activeItem.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <Check className="w-4 h-4 text-[#00a0e3] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Display */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Rental Tariff</span>
                  <div className="text-lg sm:text-xl font-extrabold text-[#006591]">{activeItem.rentPrice}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Outright Purchase</span>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-800">{activeItem.buyPrice}</div>
                </div>
              </div>

            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-4 border-t border-slate-200">
              <button
                onClick={() => onOpenBooking(`Medical Equipment: ${activeItem.title}`)}
                className="flex-1 bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-sm py-3 px-4 rounded-lg shadow-sm transition text-center"
                id="btn-rent-equipment"
              >
                Inquire &amp; Book Equipment
              </button>

              <a
                href="tel:+919999790231"
                className="bg-[#1b3b6f] hover:bg-[#152e57] text-white font-semibold text-sm py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Call Desk: +91-9999790231</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
