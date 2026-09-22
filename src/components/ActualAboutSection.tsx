import React from 'react';
import { Award, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

interface ActualAboutSectionProps {
  onOpenBooking: () => void;
}

export const ActualAboutSection: React.FC<ActualAboutSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Actual Site Heading with Decorative Underline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#245085] text-center actual-heading-underline" id="heading-welcome-about">
          Welcome to Care Health Nurses Pvt. Ltd.
        </h2>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Actual Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-slate-200 group">
              <img
                src="https://carehealthnursing.com/images/banner/aboutus_img.webp"
                alt="About Care Health Nurses"
                className="w-full h-auto max-h-[360px] object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://carehealthnursing.com/images/gallery/016.jpg';
                }}
              />
              <div className="absolute bottom-0 inset-x-0 bg-[#28568d]/90 text-white text-xs p-2 text-center font-bold">
                Established 2018 • ISO 9001:2015 Certified
              </div>
            </div>
          </div>

          {/* Right Actual Content */}
          <div className="lg:col-span-8 space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              <strong>Care Health Nurses Pvt. Ltd.</strong> is a leading home nursing agency in India. It was established in 2018. Care Health Nurses Pvt. Ltd. is situated in Noida. At Care Health Nurses Pvt. Ltd., we take pride in our team of skilled nurses who are dedicated to ensuring the well-being and comfort of our clients. Whether you or your loved one requires medical assistance, post-operative care, elderly care, or simply companionship, our nurses are here to provide personalized support tailored to your unique needs.
            </p>

            <p>
              With a commitment to excellence and a focus on enhancing the quality of life for our clients, we offer a wide range of services including medication management, wound care, physical therapy, and more. Our goal is to promote independence and dignity while fostering a safe and nurturing environment for those under our care.
            </p>

            <p>
              We are happy to have our customer and strive to understand your needs in best possible way. Care Health Nurses Pvt. Ltd. provides male and female nurses, New Born Baby Care, Pregnancy Care, Mother Care, Nursing Aid Ayaa and Attendant etc. Our aim is to have a long lasting and cherishing bondage with our patient families.
            </p>

            {/* Credential highlights */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#e3ebfa] p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#163A6B] shrink-0" />
                <span className="text-xs font-bold text-[#163A6B]">100% Police Verified Staff</span>
              </div>
              <div className="bg-[#e3ebfa] p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#163A6B] shrink-0" />
                <span className="text-xs font-bold text-[#163A6B]">State Nursing Council Registered</span>
              </div>
              <div className="bg-[#e3ebfa] p-3 rounded-lg border border-slate-200 flex items-center gap-2.5">
                <HeartHandshake className="w-5 h-5 text-[#163A6B] shrink-0" />
                <span className="text-xs font-bold text-[#163A6B]">45-Min Urgent Dispatch</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenBooking}
                className="actual-btn"
              >
                Inquire About Home Care
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
