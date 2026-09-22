import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

interface QuickRequestFormProps {
  prefilledService?: string;
  prefilledLocation?: string;
}

export const QuickRequestForm: React.FC<QuickRequestFormProps> = ({
  prefilledService = '',
  prefilledLocation = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState(prefilledService || 'ICU Patient Care At Home');
  const [preferredLocation, setPreferredLocation] = useState(prefilledLocation || 'Janak Puri (West Delhi)');
  const [shiftRequirement, setShiftRequirement] = useState('12h Day Shift');
  const [conditionNotes, setConditionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync if prefilled changes
  React.useEffect(() => {
    if (prefilledService) setServiceNeeded(prefilledService);
  }, [prefilledService]);

  React.useEffect(() => {
    if (prefilledLocation) setPreferredLocation(prefilledLocation);
  }, [prefilledLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name and contact phone number.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          serviceNeeded,
          preferredLocation,
          shiftRequirement,
          conditionNotes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmittedRef(data.request?.id || 'REQ-DELHI-CONFIRMED');
      setFullName('');
      setPhone('');
      setConditionNotes('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to service desk. Please call directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 bg-[#111c2d] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Dark Information Box */}
          <div className="lg:col-span-5 bg-[#1b3b6f] rounded-2xl p-6 sm:p-8 flex flex-col justify-between border border-blue-900/60 shadow-xl">
            <div className="space-y-6">
              
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00a0e3] bg-[#00a0e3]/10 px-2.5 py-1 rounded-full border border-[#00a0e3]/30">
                  24/7 Clinical Emergency Line
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading mt-3 text-white">
                  Need a Nurse or Caregiver Today?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Our duty nursing coordinators are on standby 24 hours a day, 7 days a week. We evaluate your medical prescription, match specialized nurses, and ensure arrival at your residence in under 45 minutes.
                </p>
              </div>

              {/* Direct Hotlines */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:+919999790231"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00a0e3] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300">Central Care Helpline</div>
                    <div className="text-sm font-bold text-white">+91-9999790231</div>
                  </div>
                </a>

                <a
                  href="tel:+919999407473"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00a0e3] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300">Emergency &amp; Equipment Desk</div>
                    <div className="text-sm font-bold text-white">+91-9999407473</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] text-slate-400">Official Clinical Email</div>
                    <div className="text-xs font-medium text-slate-200 truncate">carehealthnurses@gmail.com</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick response guarantee */}
            <div className="pt-6 mt-6 border-t border-blue-900/60 flex items-center gap-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-[#00a0e3] shrink-0" />
              <span>Coordinator calls back in <strong>15 minutes or less</strong>.</span>
            </div>

          </div>

          {/* Right Column: Intake Form */}
          <div className="lg:col-span-7 bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1b3b6f] font-heading">
                Fast Patient Care Request Form
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill out the patient requirement below. A senior clinical coordinator will contact you immediately.
              </p>
            </div>

            {submittedRef ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-emerald-900">Nursing Request Received!</h4>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-1 max-w-md mx-auto">
                    Your request reference is <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">{submittedRef}</strong>. Our clinical coordinator is reviewing availability and will call you within 15 minutes.
                  </p>
                </div>
                <button
                  onClick={() => setSubmittedRef(null)}
                  className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Submit another patient request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Family / Attendant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Saxena"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#00a0e3] focus:ring-1 focus:ring-[#00a0e3] outline-hidden transition"
                      id="input-request-name"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Contact Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#00a0e3] focus:ring-1 focus:ring-[#00a0e3] outline-hidden transition"
                      id="input-request-phone"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service Needed */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Service Required
                    </label>
                    <select
                      value={serviceNeeded}
                      onChange={(e) => setServiceNeeded(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#00a0e3] focus:ring-1 focus:ring-[#00a0e3] outline-hidden transition bg-white"
                      id="select-request-service"
                    >
                      <option value="Male & Female Nursing Staff">Male &amp; Female Nursing Staff</option>
                      <option value="ICU Patient Care At Home">ICU Patient Care At Home (Tracheostomy &amp; BiPAP)</option>
                      <option value="Elderly & Senior Citizen Care">Elderly &amp; Senior Citizen Care</option>
                      <option value="Male Attendants (Ward Boys)">Male Attendants (Ward Boys)</option>
                      <option value="Female Attendants & Caregivers">Female Attendants &amp; Caregivers</option>
                      <option value="Critical Patient & Surgical Recovery">Critical Patient &amp; Surgical Recovery</option>
                      <option value="Hospital Bed & Medical Equipment Rental">Hospital Bed &amp; Medical Equipment Rental</option>
                    </select>
                  </div>

                  {/* Preferred Hub Location */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Preferred NCR Dispatch Hub
                    </label>
                    <select
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#00a0e3] focus:ring-1 focus:ring-[#00a0e3] outline-hidden transition bg-white"
                      id="select-request-location"
                    >
                      <option value="Laxmi Nagar (East Delhi HO)">Laxmi Nagar (East Delhi Head Office)</option>
                      <option value="Janak Puri (West Delhi Hub)">Janak Puri (West Delhi Hub &amp; Dwarka)</option>
                      <option value="Indirapuram (Ghaziabad Hub)">Indirapuram (Ghaziabad &amp; Vaishali)</option>
                      <option value="Noida Hub (Sector 62)">Noida &amp; Greater Noida Hub</option>
                      <option value="Other Delhi NCR Location">Other Delhi NCR Location</option>
                    </select>
                  </div>
                </div>

                {/* Shift Requirement */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Shift Duration Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['12h Day Shift', '12h Night Shift', '24h Live-in Shift'].map((shift) => (
                      <button
                        type="button"
                        key={shift}
                        onClick={() => setShiftRequirement(shift)}
                        className={`py-2 px-2 rounded-lg border font-semibold text-center transition ${
                          shiftRequirement === shift
                            ? 'bg-[#00a0e3] text-white border-[#00a0e3]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {shift}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Condition Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Patient Diagnosis &amp; Condition Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    placeholder="e.g. 70-year-old stroke patient, needs tracheostomy suctioning and Ryle's tube feeding..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] focus:ring-1 focus:ring-[#00a0e3] outline-hidden transition"
                    id="input-request-notes"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-sm py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  id="btn-submit-patient-request"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching Request...' : 'Request Immediate Nurse Callback'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  🔒 Strictly Confidential Medical Data. No spam or commercial sharing.
                </p>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
