import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationIcon from './components/LocationIcon';
import BenefitsList from './components/BenefitsList';
import LocationActions from './components/LocationActions';
import ManualLocationEntry from './components/ManualLocationEntry';
import PermissionInstructions from './components/PermissionInstructions';

const LocationPermissionHandler = () => {
  const [language, setLanguage] = useState('fr');
  const [currentView, setCurrentView] = useState('initial'); // 'initial', 'manual', 'denied'
  const [locationStatus, setLocationStatus] = useState('pending'); // 'pending', 'granted', 'denied'
  const navigate = useNavigate();

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    
    // Update document direction for RTL support
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Check if location is already available
  useEffect(() => {
    const savedLocation = localStorage.getItem('cleanfinder-location');
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        // Check if location is recent (within 1 hour)
        const isRecent = Date.now() - locationData?.timestamp < 3600000;
        if (isRecent) {
          navigate('/service-discovery-map-view');
          return;
        }
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }

    // Check current permission status
    if (navigator.permissions) {
      navigator.permissions?.query({ name: 'geolocation' })?.then((result) => {
        if (result?.state === 'granted') {
          setLocationStatus('granted');
        } else if (result?.state === 'denied') {
          setLocationStatus('denied');
          setCurrentView('denied');
        }
      });
    }
  }, [navigate]);

  const handleLocationGranted = (location) => {
    setLocationStatus('granted');
    console.log('Location granted:', location);
  };

  const handleLocationDenied = (error) => {
    setLocationStatus('denied');
    setCurrentView('denied');
    console.error('Location denied:', error);
  };

  const handleManualEntry = () => {
    setCurrentView('manual');
  };

  const handleLocationSelected = (location) => {
    console.log('Location selected:', location);
  };

  const handleBackToInitial = () => {
    setCurrentView('initial');
  };

  const handleRetryLocation = () => {
    setCurrentView('initial');
    setLocationStatus('pending');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'manual':
        return (
          <ManualLocationEntry
            language={language}
            onLocationSelected={handleLocationSelected}
            onBack={handleBackToInitial}
            className="w-full max-w-md"
          />
        );
      
      case 'denied':
        return (
          <PermissionInstructions
            language={language}
            onRetry={handleRetryLocation}
            onManualEntry={handleManualEntry}
            className="w-full max-w-md"
          />
        );
      
      default:
        return (
          <>
            <LocationIcon 
              language={language} 
              className="mb-8"
            />
            
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h1 className="font-heading font-bold text-2xl text-foreground mb-3">
                  {language === 'ar' ? 'مرحباً بك في CleanFinder' : 'Bienvenue sur CleanFinder'}
                </h1>
                <p className="font-body text-muted-foreground">
                  {language === 'ar' ?'اكتشف أفضل خدمات تنظيف السيارات في المغرب' :'Découvrez les meilleurs services de nettoyage automobile au Maroc'
                  }
                </p>
              </div>

              <BenefitsList 
                language={language}
                className="mb-8"
              />

              <LocationActions
                language={language}
                onLocationGranted={handleLocationGranted}
                onLocationDenied={handleLocationDenied}
                onManualEntry={handleManualEntry}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center text-center">
            {renderContent()}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-4">
        <div className="text-center">
          <p className="font-body text-xs text-muted-foreground">
            {language === 'ar' 
              ? `© ${new Date()?.getFullYear()} CleanFinder Morocco. جميع الحقوق محفوظة.`
              : `© ${new Date()?.getFullYear()} CleanFinder Morocco. Tous droits réservés.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionHandler;