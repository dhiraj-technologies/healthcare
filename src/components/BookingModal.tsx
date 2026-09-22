import React, { useState } from 'react';
import { X, Send, Phone, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialLocation?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Male & Female Nursing Staff',
  initialLocation = 'Janak Puri (West Delhi Hub)'
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState(initialService);
  const [preferredLocation, setPreferredLocation] = useState(initialLocation);
  const [shiftRequirement, setShiftRequirement] = useState('12h Day Shift');
  const [conditionNotes, setConditionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialService) setServiceNeeded(initialService);
  }, [initialService]);

  React.useEffect(() => {
    if (initialLocation) setPreferredLocation(initialLocation);
  }, [initialLocation]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and contact phone number.');
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending request. Please call directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setFullName('');
    setPhone('');
    setConditionNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#1b3b6f] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00a0e3] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">Book Home Healthcare Service</h3>
              <p className="text-[11px] text-slate-300">45-Minute Rapid Dispatch Across Delhi NCR</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Booking Request Received!</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  Our duty nursing supervisor has received your intake for <strong>{serviceNeeded}</strong> and will call <strong className="text-[#1b3b6f]">{phone}</strong> within 15 minutes.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Patient / Family Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Saxena"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Category</label>
                <select
                  value={serviceNeeded}
                  onChange={(e) => setServiceNeeded(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden bg-white"
                >
                  <option value="Male & Female Nursing Staff">Male &amp; Female Nursing Staff</option>
                  <option value="ICU Patient Care At Home">ICU Patient Care At Home (Tracheostomy/Ventilator)</option>
                  <option value="Elderly & Senior Citizen Care">Elderly &amp; Senior Citizen Care</option>
                  <option value="Male Attendants (Ward Boys)">Male Attendants (Ward Boys)</option>
                  <option value="Female Attendants & Caregivers">Female Attendants &amp; Caregivers</option>
                  <option value="Critical Patient & Surgical Recovery">Critical Patient &amp; Surgical Recovery</option>
                  <option value="Medical Equipment: ICU Beds / BiPAP / Oxygen">Medical Equipment: ICU Beds / BiPAP / Oxygen</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">NCR Dispatch Hub</label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden bg-white"
                  >
                    <option value="Janak Puri (West Delhi Hub)">Janak Puri (West Delhi Hub)</option>
                    <option value="Laxmi Nagar (East Delhi HO)">Laxmi Nagar (East Delhi HO)</option>
                    <option value="Indirapuram (Ghaziabad Hub)">Indirapuram (Ghaziabad Hub)</option>
                    <option value="Noida Hub (Sector 62)">Noida &amp; Greater Noida Hub</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Shift Type</label>
                  <select
                    value={shiftRequirement}
                    onChange={(e) => setShiftRequirement(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden bg-white"
                  >
                    <option value="12h Day Shift">12h Day Shift</option>
                    <option value="12h Night Shift">12h Night Shift</option>
                    <option value="24h Live-in Shift">24h Live-in Shift</option>
                    <option value="Procedure Visit (1-2 Hours)">Procedure Visit (1-2 Hours)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Patient Details / Condition (Optional)</label>
                <textarea
                  rows={2}
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="e.g. Post-discharge after hip surgery, needs injection and wound dressing..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#00a0e3] outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-xs py-3 px-4 rounded-lg shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting Booking...' : 'Confirm Care Request'}</span>
                </button>
              </div>

              <div className="text-center">
                <a
                  href="tel:+919999790231"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1b3b6f] hover:underline"
                >
                  <Phone className="w-3 h-3 text-[#00a0e3]" />
                  Or call directly for immediate emergency dispatch: +91-9999790231
                </a>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
