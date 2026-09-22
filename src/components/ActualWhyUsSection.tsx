import React from 'react';
import { Building2, HeartHandshake, Stethoscope, Baby, ShieldCheck, Clock } from 'lucide-react';

export const ActualWhyUsSection: React.FC = () => {
  const reasons = [
    {
      icon: Building2,
      name: 'Exp Male Female Attendant',
      des: 'Experts in caring for bed-ridden, knee replacement, Neuro, Paralysis, and post-surgical patients.'
    },
    {
      icon: HeartHandshake,
      name: 'Elders/Senior Citizen Care Taker',
      des: 'Follow every step according to elders’ needs, ensuring dignity, mobility, and companionship.'
    },
    {
      icon: Stethoscope,
      name: 'Exp. Male/Female Nurses',
      des: 'Our nurses are well qualified (GNM/B.Sc), council registered, and hospital experienced.'
    },
    {
      icon: Baby,
      name: 'Nanny Baby Care',
      des: 'We realize no greater joy than to see children smile, hear them laugh, or watch them play. Dedicated newborn and mother care.'
    }
  ];

  return (
    <section id="why-us" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#245085] text-center actual-heading-underline" id="heading-why-us">
          Why Choose Care Health Nurses?
        </h2>
        <p className="text-center text-sm font-semibold text-slate-500 mb-10 max-w-xl mx-auto">
          We are preferred by our clients for the following reasons :
        </p>

        {/* 4 Reason Cards with Circular Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="actual-block rounded-xl p-6 text-center flex flex-col items-center justify-between group hover:-translate-y-1 transition duration-300"
              >
                <div>
                  {/* 70px Circular Icon with Hover Transition */}
                  <div className="mb-4">
                    <div className="w-[70px] h-[70px] mx-auto rounded-full bg-white shadow-md flex items-center justify-center text-[#163A6B] group-hover:bg-[#1F3C88] group-hover:text-white transition duration-500">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#08274d] mb-2 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    {item.des}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 w-full flex items-center justify-center gap-1 text-[11px] font-bold text-[#163A6B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Assured Reliability</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
