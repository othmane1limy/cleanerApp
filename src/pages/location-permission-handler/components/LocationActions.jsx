import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LocationActions = ({ 
  language = 'fr', 
  onLocationGranted = () => {},
  onLocationDenied = () => {},
  onManualEntry = () => {},
  className = '' 
}) => {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  const handleLocationRequest = async () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position?.coords;
      
      // Store location in localStorage
      localStorage.setItem('cleanfinder-location', JSON.stringify({
        latitude,
        longitude,
        timestamp: Date.now(),
        method: 'gps'
      }));

      onLocationGranted({ latitude, longitude });
      
      // Navigate to map view
      setTimeout(() => {
        navigate('/service-discovery-map-view');
      }, 500);

    } catch (error) {
      console.error('Location error:', error);
      
      let errorMessage = '';
      switch (error?.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = language === 'ar' ?'تم رفض إذن الموقع. يرجى تمكينه في إعدادات المتصفح.' :'Permission de localisation refusée. Veuillez l\'activer dans les paramètres du navigateur.';
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = language === 'ar' ?'لا يمكن تحديد موقعك. يرجى المحاولة مرة أخرى.' :'Impossible de déterminer votre position. Veuillez réessayer.';
          break;
        case 3: // TIMEOUT
          errorMessage = language === 'ar' ?'انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.' :'Délai de localisation dépassé. Veuillez réessayer.';
          break;
        default:
          errorMessage = language === 'ar' ?'خطأ في تحديد الموقع. يرجى المحاولة مرة أخرى.' :'Erreur de localisation. Veuillez réessayer.';
      }
      
      setLocationError(errorMessage);
      onLocationDenied(error);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleManualEntry = () => {
    onManualEntry();
  };

  const handleSkip = () => {
    // Set default location to Casablanca
    const defaultLocation = {
      latitude: 33.5731,
      longitude: -7.5898,
      city: 'Casablanca',
      method: 'default'
    };
    
    localStorage.setItem('cleanfinder-location', JSON.stringify({
      ...defaultLocation,
      timestamp: Date.now()
    }));

    navigate('/service-discovery-map-view');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Action - Allow Location */}
      <Button
        variant="default"
        size="lg"
        fullWidth
        loading={isRequestingLocation}
        onClick={handleLocationRequest}
        iconName="MapPin"
        iconPosition="left"
        iconSize={20}
        className="h-12"
      >
        {isRequestingLocation 
          ? (language === 'ar' ? 'جاري تحديد الموقع...' : 'Localisation en cours...')
          : (language === 'ar' ? 'السماح بالوصول للموقع' : 'Autoriser l\'accès à la localisation')
        }
      </Button>

      {/* Secondary Action - Manual Entry */}
      <Button
        variant="outline"
        size="lg"
        fullWidth
        onClick={handleManualEntry}
        iconName="Search"
        iconPosition="left"
        iconSize={20}
        className="h-12"
      >
        {language === 'ar' ? 'إدخال الموقع يدوياً' : 'Saisir la localisation manuellement'}
      </Button>

      {/* Skip Option */}
      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onClick={handleSkip}
        className="text-muted-foreground hover:text-foreground"
      >
        {language === 'ar' ? 'تخطي واستخدام الموقع الافتراضي' : 'Ignorer et utiliser la localisation par défaut'}
      </Button>

      {/* Error Message */}
      {locationError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm text-error">
                {locationError}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocationError(null)}
                className="mt-2 text-error hover:text-error/80 p-0 h-auto"
              >
                {language === 'ar' ? 'إغلاق' : 'Fermer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="font-body text-xs text-muted-foreground">
          {language === 'ar' ?'نحن نحترم خصوصيتك. لن يتم مشاركة موقعك مع أطراف ثالثة.' :'Nous respectons votre vie privée. Votre localisation ne sera pas partagée avec des tiers.'
          }
        </p>
      </div>
    </div>
  );
};

export default LocationActions;