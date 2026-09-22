import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, ShieldCheck, Activity } from 'lucide-react';

interface ActualBannerCarouselProps {
  onOpenBooking: () => void;
  onOpenPortal: () => void;
}

export const ActualBannerCarousel: React.FC<ActualBannerCarouselProps> = ({
  onOpenBooking,
  onOpenPortal
}) => {
  const slides = [
    {
      src: 'https://carehealthnursing.com/images/banner/image1.webp',
      alt: 'Care Health Nurses Home Patient Care in Delhi NCR',
      caption: 'Certified Male & Female Home Nursing Staff in Delhi NCR'
    },
    {
      src: 'https://carehealthnursing.com/images/banner/image2.webp',
      alt: 'Professional ICU Care & Medical Equipment at Home',
      caption: 'Hospital-Grade ICU Setup, BiPAP, Ventilator & Oxygen at Home'
    },
    {
      src: 'https://carehealthnursing.com/images/banner/image3.webp',
      alt: 'Elderly & Senior Citizen Patient Caretakers',
      caption: 'Compassionate Senior Care, Stroke & Bed-ridden Patient Support'
    },
    {
      src: 'https://carehealthnursing.com/images/banner/image4.webp',
      alt: 'New Born Baby Care & Mother Care Aya Services',
      caption: 'Experienced Jabar, Mother & New Born Baby Attendants'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div id="bannerCarousel" className="relative w-full bg-slate-900 overflow-hidden group">
      
      {/* Slides Container */}
      <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[520px]">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient Overlay for Text Readability & CTA */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <div className="max-w-4xl">
                <span className="inline-block bg-[#28568d]/90 text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded mb-2 shadow">
                  Government Registered Bureau
                </span>
                <h1 className="text-white text-base sm:text-2xl md:text-3xl font-extrabold drop-shadow-md" id={`carousel-slide-title-${idx}`}>
                  {slide.caption}
                </h1>
                
                {/* Fast Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    onClick={onOpenBooking}
                    className="bg-[#00a0e3] hover:bg-[#008fcb] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition flex items-center gap-1.5"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Book Home Nurse Now</span>
                  </button>
                  <button
                    onClick={onOpenPortal}
                    className="bg-white/90 hover:bg-white text-[#163A6B] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Clinical Portal (RBAC)</span>
                  </button>
                  <a
                    href="tel:+919999790231"
                    className="hidden sm:inline-flex bg-[#28568d]/90 hover:bg-[#28568d] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow transition items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call 24/7: 9999790231</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Carousel Control Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#28568d] text-white flex items-center justify-center transition shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Carousel Control Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#28568d] text-white flex items-center justify-center transition shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};
