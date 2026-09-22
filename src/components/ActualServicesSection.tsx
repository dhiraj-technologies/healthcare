import React from 'react';
import { Check, ShieldCheck, Activity } from 'lucide-react';

interface ActualServicesSectionProps {
  onOpenBooking: (serviceName?: string) => void;
}

export const ActualServicesSection: React.FC<ActualServicesSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="services" className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#245085] text-center actual-heading-underline">
          Our Services
        </h2>

        <div className="mt-10 space-y-8">
          
          {/* Service Block 1: Male/Female Nursing Staff */}
          <div className="actual-block rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-4">
                <div className="rounded-lg overflow-hidden shadow border border-slate-300">
                  <img
                    src="https://carehealthnursing.com/images/gallery/016.jpg"
                    alt="Male/Female Nursing Staff"
                    className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#08274d]">
                  Male/Female Nursing Staff
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  We also provide reliable and well experienced Nursing staff both male and female catering a wide variety of needs of our clients. Our nurses excel in attending our clients with their good patient care and hospitality services. Our nurses are provided time to time training on quality health care and nursing acts.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  Our nurses offer quality healthcare services to clients at home. They excellently take care of the patients with optimum love and care just like a family member. Our attendants are skilled and well trained to attend our clients on timely basis. We offer reliable and trustworthy staff and offer complete guarantee of your security.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onOpenBooking('Male/Female Nursing Staff')}
                    className="actual-btn text-xs py-2 px-6"
                  >
                    Book Nursing Staff
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Service Block 2: Male Attendant/Nursing Attendants (Image on Right) */}
          <div className="actual-block rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-8 order-2 md:order-1 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#08274d]">
                  Male Attendant/Nursing Attendants
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  Care Health Nurses Pvt. Ltd., is providing well experienced male attendants to our clients. Our attendants are skilled and well trained to attend our clients on timely basis. We offer reliable and trustworthy staff and offer complete guarantee of your security. Our Male attendants are having experience to work in Private Duties, At Home, Hospitals and other medical needs.
                </p>

                <div className="bg-white/80 p-4 rounded-lg border border-slate-200 mt-2">
                  <h4 className="text-xs font-bold text-[#163A6B] uppercase tracking-wider mb-2">
                    Our Trained Attendants Can:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Administer oral medication</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Assist in ambulation (moving the patient around)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Manage feeding tubes</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Manage cleaning, grooming, bathing &amp; feeding</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Manage patients for 12 &amp; 24 hours</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Monitor vitals (BP, urine output, sugar, bed sores)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenBooking('Male Attendant/Nursing Attendants')}
                    className="actual-btn text-xs py-2 px-6"
                  >
                    Request Male Attendant
                  </button>
                </div>
              </div>

              <div className="md:col-span-4 order-1 md:order-2">
                <div className="rounded-lg overflow-hidden shadow border border-slate-300">
                  <img
                    src="https://carehealthnursing.com/images/gallery/017.jpg"
                    alt="Male Attendant"
                    className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Service Block 3: Female Attendant/Nursing Attendants */}
          <div className="actual-block rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-4">
                <div className="rounded-lg overflow-hidden shadow border border-slate-300">
                  <img
                    src="https://carehealthnursing.com/images/gallery/018.jpg"
                    alt="Female Attendant"
                    className="w-full h-56 sm:h-64 object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#08274d]">
                  Female Attendant/Nursing Attendants
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  Nursing attendants are used for Performing Day to Day Tasks to support the Medical team in Properly Caring for the Disabled/Ill/Elderly citizen. With Un-Matched Skill &amp; Compassion, Care Health trained nursing attendants play a vital role in Patient Care.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                  Care Health Trained Nursing Duties typically involve a great deal of hands-on contact. They are mostly responsible for helping patients with basic functions such as wound dressing, bathing, feeding, exercises, and companionship. Our trained nursing attendants will also help patients in &amp; out of bed, take them for walks, help them into wheelchairs, and report vital changes.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onOpenBooking('Female Attendant/Nursing Attendants')}
                    className="actual-btn text-xs py-2 px-6"
                  >
                    Request Female Caregiver
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* View All / Action */}
        <div className="text-center mt-10">
          <button
            onClick={() => onOpenBooking()}
            className="actual-btn-primary shadow-lg"
          >
            View All Services &amp; Book Today
          </button>
        </div>

      </div>
    </section>
  );
};
