import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ActualHeader } from './components/ActualHeader.tsx';
import { ActualBannerCarousel } from './components/ActualBannerCarousel.tsx';
import { ActualAboutSection } from './components/ActualAboutSection.tsx';
import { ActualServicesSection } from './components/ActualServicesSection.tsx';
import { ActualWhyUsSection } from './components/ActualWhyUsSection.tsx';
import { ActualGallerySection } from './components/ActualGallerySection.tsx';
import { ActualFaqSection } from './components/ActualFaqSection.tsx';
import { ActualContactSection } from './components/ActualContactSection.tsx';
import { ActualFooter } from './components/ActualFooter.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ClinicalPortal } from './components/Portal/ClinicalPortal.tsx';

function MainApplication() {
  const { user, quickDemoLogin } = useAuth();
  const [currentView, setCurrentView] = useState<'public' | 'portal'>('public');
  const [activeSection, setActiveSection] = useState<string>('home');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('Male & Female Nursing Staff');
  const [bookingLocation, setBookingLocation] = useState('Noida & Delhi NCR');

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenBooking = (service?: string, location?: string) => {
    if (service) setBookingService(service);
    if (location) setBookingLocation(location);
    setIsBookingOpen(true);
  };

  const handleOpenPortal = () => {
    if (user) {
      setCurrentView('portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleOpenAdminPortal = async () => {
    if (user?.role !== 'admin') {
      await quickDemoLogin('admin');
    }
    setCurrentView('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] text-[#333333]">
      
      {currentView === 'portal' ? (
        <ClinicalPortal
          onBackToWebsite={() => setCurrentView('public')}
          onOpenBooking={() => handleOpenBooking()}
        />
      ) : (
        <>
          <ActualHeader
            onOpenBooking={() => handleOpenBooking()}
            onOpenPortal={handleOpenPortal}
            onOpenAdminPanel={handleOpenAdminPortal}
            onOpenAuth={() => setIsAuthOpen(true)}
            activeSection={activeSection}
            onNavigateSection={setActiveSection}
          />

          <main id="home" className="flex-1">
            <ActualBannerCarousel
              onOpenBooking={() => handleOpenBooking()}
              onOpenPortal={handleOpenPortal}
            />

            <ActualAboutSection
              onOpenBooking={() => handleOpenBooking()}
            />

            <ActualServicesSection
              onOpenBooking={(srv) => handleOpenBooking(srv)}
            />

            <ActualWhyUsSection />

            <ActualGallerySection />

            <ActualFaqSection
              onOpenBooking={() => handleOpenBooking()}
            />

            <ActualContactSection />
          </main>

          <ActualFooter
            onOpenBooking={() => handleOpenBooking()}
            onOpenPortal={handleOpenPortal}
            onOpenAdminPanel={handleOpenAdminPortal}
          />
        </>
      )}

      {/* Global Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={bookingService}
        initialLocation={bookingLocation}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setCurrentView('portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApplication />
    </AuthProvider>
  );
}
