import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

export const ActualGallerySection: React.FC = () => {
  const images = [
    { src: 'https://carehealthnursing.com/images/gallery/005.jpg', title: 'Critical Care ICU Nurse Deployment' },
    { src: 'https://carehealthnursing.com/images/gallery/001.jpg', title: 'Elderly Caregiver at Home' },
    { src: 'https://carehealthnursing.com/images/gallery/002.jpg', title: 'Post-Operative Recovery Patient Support' },
    { src: 'https://carehealthnursing.com/images/gallery/004.jpg', title: 'Pediatric & Newborn Baby Care' },
    { src: 'https://carehealthnursing.com/images/gallery/003.jpg', title: 'Certified Female Nursing Staff' },
    { src: 'https://carehealthnursing.com/images/gallery/006.jpg', title: 'Physiotherapy & Mobility Rehabilitation' }
  ];

  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#245085] text-center actual-heading-underline" id="heading-gallery">
          Our Clinical Care Gallery
        </h2>
        <p className="text-center text-sm font-semibold text-slate-500 mb-8 max-w-xl mx-auto">
          Snapshots of our hospital-trained bedside nurses, attendants, and home setups across Delhi NCR.
        </p>

        {/* 3-Column Image Grid matching actual site */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImg(img.src)}
              className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer border border-slate-200 aspect-4/3 bg-slate-200"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <div className="text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <ZoomIn className="w-4 h-4 text-[#00a0e3]" />
                    <span>View Image</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5">{img.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-3xl w-full bg-transparent p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-rose-400 p-2 text-sm font-bold flex items-center gap-1"
            >
              <X className="w-6 h-6" /> Close
            </button>
            <img
              src={selectedImg}
              alt="Enlarged view"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

    </section>
  );
};
