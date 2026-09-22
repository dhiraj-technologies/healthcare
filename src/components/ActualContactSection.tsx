import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ActualContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your Name and Phone Number.');
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          phone,
          serviceNeeded: 'General Home Nursing Inquiry',
          preferredLocation: 'Delhi NCR',
          shiftRequirement: 'As required',
          conditionNotes: message ? `Email: ${email} | Inquiry: ${message}` : `Email: ${email}`
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit message');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg('Unable to submit inquiry. Please call +91-9999790231 directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#245085] text-center actual-heading-underline" id="heading-contact">
          Contact Care Health Bureau 24/7
        </h2>
        <p className="text-center text-sm font-semibold text-slate-500 mb-10 max-w-xl mx-auto">
          24/7 Desk for Immediate Emergency Nurse Deployment Across Delhi, Noida, Gurgaon &amp; Ghaziabad
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Address Boxes */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-lg font-bold text-[#08274d] mb-4">
              Care Health Nurses Pvt. Ltd. Bureau
            </h4>

            {/* Address Box 1 */}
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#163A6B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-[#163A6B] block">Head Office (Noida &amp; East NCR):</strong>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-semibold">
                  Care Health Nurses Pvt. Ltd., Sector 62 / Laxmi Nagar, Delhi NCR 110092
                </p>
              </div>
            </div>

            {/* Address Box 2 */}
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#163A6B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-[#163A6B] block">West Delhi &amp; Gurgaon Branch:</strong>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-semibold">
                  District Centre, Janak Puri, New Delhi 110058 (Covers Dwarka, West Delhi, DLF Gurgaon)
                </p>
              </div>
            </div>

            {/* Hotline Box */}
            <div className="bg-[#e3ebfa] p-4 rounded-xl border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#163A6B] text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">24x7 Emergency Line:</span>
                  <a href="tel:+919999790231" className="block text-sm font-black text-[#0814c1] hover:underline">
                    +91-9999790231 / 9999407473
                  </a>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-1 rounded">
                Active Now
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pl-1">
              <Mail className="w-4 h-4 text-[#163A6B]" />
              <span>Official Email: </span>
              <a href="mailto:carehealthnurses@gmail.com" className="text-[#0814c1] hover:underline">
                carehealthnurses@gmail.com
              </a>
            </div>

          </div>

          {/* Right: Quick Contact Form */}
          <div className="lg:col-span-6 bg-[#f8fafc] p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-base sm:text-lg font-bold text-[#08274d] mb-1">
              We will love to hear from you!
            </h4>
            <p className="text-xs text-slate-500 mb-4 font-semibold">
              Please submit your details below and our coordinator will respond within 15 minutes:
            </p>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h5 className="text-base font-bold text-emerald-800">
                  Thank You For Your Request!
                </h5>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  One of our Account Representatives will get in touch with you shortly to coordinate your nurse deployment.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="actual-btn text-xs py-1.5 px-4"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name *"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#1F3C88] bg-white outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#1F3C88] bg-white outline-hidden"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number *"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#1F3C88] bg-white outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Patient Condition / Service Needed..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-[#1F3C88] bg-white outline-hidden"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="actual-btn w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
