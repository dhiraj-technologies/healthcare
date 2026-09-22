import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

interface ActualFaqSectionProps {
  onOpenBooking: () => void;
}

export const ActualFaqSection: React.FC<ActualFaqSectionProps> = ({ onOpenBooking }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Staff Verification & Safety',
      question: 'Are your male and female nurses police verified and certified?',
      answer: 'Yes, 100%. Every nurse and attendant deployed by Care Health Nurses Pvt. Ltd. undergoes mandatory Delhi/NCR Police background verification, identity validation (Aadhaar & Voter ID), medical health screening, and credential verification with the State Nursing Council (INC/DNC). We maintain full legal dossiers for every caregiver.'
    },
    {
      category: 'Deployment & Timing',
      question: 'How quickly can a nurse or ICU setup be deployed at home in Delhi NCR?',
      answer: 'For emergency bedside care and ICU setups, our rapid response team dispatches within 45 to 90 minutes across Janak Puri, Dwarka, Noida, Indirapuram, Laxmi Nagar, Gurgaon, and Faridabad. For planned discharges, we recommend scheduling 12 to 24 hours in advance.'
    },
    {
      category: 'Clinical Scope',
      question: 'What is the difference between a Registered Nurse and a Nursing Attendant?',
      answer: 'Registered Nurses (GNM / B.Sc Nursing) handle complex clinical duties: IV catheterization, tracheostomy suctioning, BiPAP/ventilator management, central line maintenance, injection administration, and emergency vitals monitoring. Nursing Attendants specialize in patient daily living functions: sponge bathing, bed-sore prevention, diaper changing, tube feeding, ambulation, and oral medicine delivery.'
    },
    {
      category: 'Shift Flexibility',
      question: 'Do you provide 12-hour shifts and 24-hour live-in patient care?',
      answer: 'Yes. We provide flexible shift configurations: 12-Hour Day Shift (08:00 AM – 08:00 PM), 12-Hour Night Shift (08:00 PM – 08:00 AM), and 24-Hour Live-in Care (continuous bedside support with rotating trained staff).'
    },
    {
      category: 'Medical Equipment',
      question: 'Can I rent hospital ICU beds and oxygen concentrators with a nurse?',
      answer: 'Yes. Care Health Nurses provides integrated packages including motorized 3-function/5-function ICU hospital beds, Philips/DeVilbiss oxygen concentrators (5L/10L), ResMed BiPAP/CPAP machines, electric suction pumps, DVT pumps, and patient syringe infusion pumps with doorstep installation.'
    },
    {
      category: 'Digital Telemetry',
      question: 'How do family members track patient vitals and nursing notes?',
      answer: 'Through our built-in Clinical Portal, families receive real-time digital logs of blood pressure, SpO2, heart rate, blood sugar, and medications administered per shift, complete with cryptographic audit timestamps and direct caregiver messaging.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#163A6B] border border-blue-200 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#00a0e3]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#245085] actual-heading-underline">
            Patient Care &amp; Home Nursing FAQs
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-3">
            Clear answers to common questions about home nurse booking, qualification checks, and ICU setup.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-200 bg-white ${
                  isOpen
                    ? 'border-[#28568d]/60 shadow-md ring-1 ring-[#28568d]/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
                id={`faq-item-${index}`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-hidden"
                  aria-expanded={isOpen}
                  id={`faq-btn-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="p-1 rounded-md bg-blue-50 text-[#163A6B] mt-0.5 shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#00a0e3]" />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        {faq.category}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#08274d]">
                        {faq.question}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#28568d] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-100 font-medium">
                    <p className="pl-7">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Help Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#1b3b6f] to-[#28568d] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="font-bold text-base sm:text-lg">Have a specific medical requirement?</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Speak with our Senior Clinical Superintendent for custom patient care plans.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919999790231"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
              id="btn-faq-call"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call +91-9999790231</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
              id="btn-faq-book"
            >
              Book Service
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
