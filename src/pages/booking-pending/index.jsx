
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';

const BookingPending = () => {
  const [language, setLanguage] = useState('fr');
  const [status, setStatus] = useState('pending'); // pending, accepted, en_route, arrived, completed
  const [eta, setEta] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Simulate booking progression
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Simulate status changes
    const statusTimer = setTimeout(() => {
      if (status === 'pending') {
        setStatus('accepted');
        setEta(15); // 15 minutes ETA
      }
    }, 5000); // Accept after 5 seconds for demo

    const enRouteTimer = setTimeout(() => {
      if (status === 'accepted') {
        setStatus('en_route');
      }
    }, 10000);

    const arrivedTimer = setTimeout(() => {
      if (status === 'en_route') {
        setStatus('arrived');
      }
    }, 25000);

    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer);
      clearTimeout(enRouteTimer);
      clearTimeout(arrivedTimer);
    };
  }, [status]);

  // Update ETA countdown
  useEffect(() => {
    if (eta && eta > 0 && status === 'accepted') {
      const etaTimer = setInterval(() => {
        setEta(prev => prev > 0 ? prev - 1 : 0);
      }, 60000); // Decrease every minute

      return () => clearInterval(etaTimer);
    }
  }, [eta, status]);

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          title: language === 'ar' ? 'في انتظار الموافقة...' : 'En attente d\'acceptation...',
          description: language === 'ar' ? 'ننتظر موافقة المنظف على طلبك' : 'En attente de la confirmation du nettoyeur',
          icon: 'Clock',
          color: 'text-warning'
        };
      case 'accepted':
        return {
          title: language === 'ar' ? 'تم قبول الحجز!' : 'Réservation acceptée !',
          description: language === 'ar' ? `سيصل المنظف خلال ${eta} دقيقة` : `Le nettoyeur arrive dans ${eta} minutes`,
          icon: 'CheckCircle',
          color: 'text-success'
        };
      case 'en_route':
        return {
          title: language === 'ar' ? 'في الطريق' : 'En route',
          description: language === 'ar' ? 'المنظف في طريقه إليك' : 'Le nettoyeur est en route vers vous',
          icon: 'Navigation',
          color: 'text-primary'
        };
      case 'arrived':
        return {
          title: language === 'ar' ? 'وصل المنظف' : 'Nettoyeur arrivé',
          description: language === 'ar' ? 'المنظف وصل ويبدأ الخدمة' : 'Le nettoyeur est arrivé et commence le service',
          icon: 'MapPin',
          color: 'text-success'
        };
      case 'completed':
        return {
          title: language === 'ar' ? 'تم إنجاز الخدمة' : 'Service terminé',
          description: language === 'ar' ? 'تم إنجاز تنظيف سيارتك بنجاح' : 'Votre véhicule a été nettoyé avec succès',
          icon: 'CheckCircle2',
          color: 'text-success'
        };
      default:
        return {
          title: language === 'ar' ? 'معالجة الطلب...' : 'Traitement en cours...',
          description: '',
          icon: 'Clock',
          color: 'text-muted-foreground'
        };
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const statusInfo = getStatusInfo();

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {language === 'ar' ? 'لم يتم العثور على بيانات الحجز' : 'Données de réservation non trouvées'}
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            {language === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        onLanguageChange={setLanguage}
        currentLocation={language === 'ar' ? 'المغرب' : 'Maroc'}
      />
      <NavigationBreadcrumb language={language} />
      
      <div className="pt-15 pb-32 md:pb-24">
        <div className="max-w-2xl mx-auto px-4">
          {/* Status Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center ${statusInfo.color}`}>
              <Icon name={statusInfo.icon} size={32} />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
              {statusInfo.title}
            </h1>
            <p className="text-muted-foreground">
              {statusInfo.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {language === 'ar' ? 'تقدم الحجز' : 'Progression'}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: status === 'pending' ? '25%' : 
                         status === 'accepted' ? '50%' : 
                         status === 'en_route' ? '75%' : 
                         status === 'arrived' ? '90%' : 
                         status === 'completed' ? '100%' : '0%'
                }}
              ></div>
            </div>
          </div>

          {/* Status Steps */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="space-y-4">
              {[
                { key: 'pending', label: language === 'ar' ? 'طلب الحجز' : 'Demande envoyée' },
                { key: 'accepted', label: language === 'ar' ? 'تم القبول' : 'Acceptée' },
                { key: 'en_route', label: language === 'ar' ? 'في الطريق' : 'En route' },
                { key: 'arrived', label: language === 'ar' ? 'وصل' : 'Arrivé' },
                { key: 'completed', label: language === 'ar' ? 'مكتمل' : 'Terminé' }
              ].map((step, index) => {
                const isActive = status === step.key;
                const isCompleted = ['accepted', 'en_route', 'arrived', 'completed'].includes(status) && 
                                   ['pending', 'accepted', 'en_route', 'arrived'].indexOf(step.key) < 
                                   ['pending', 'accepted', 'en_route', 'arrived', 'completed'].indexOf(status);
                
                return (
                  <div key={step.key} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-success text-white' :
                      isActive ? 'bg-primary text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`font-medium ${
                      isActive ? 'text-primary' :
                      isCompleted ? 'text-success' :
                      'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <h3 className="font-heading font-medium text-foreground mb-3">
              {language === 'ar' ? 'تفاصيل الحجز' : 'Détails de la réservation'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {language === 'ar' ? 'المنظف' : 'Nettoyeur'}
                </span>
                <span className="font-medium text-foreground">
                  {bookingData.cleaner?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {language === 'ar' ? 'الخدمة' : 'Service'}
                </span>
                <span className="font-medium text-foreground">
                  {bookingData.selectedService?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {language === 'ar' ? 'المجموع' : 'Total'}
                </span>
                <span className="font-data font-semibold text-foreground">
                  {bookingData.totalPrice} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {status === 'accepted' || status === 'en_route' ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`tel:${bookingData.cleaner?.phone}`)}
                iconName="Phone"
                iconPosition="left"
              >
                {language === 'ar' ? 'اتصال بالمنظف' : 'Appeler le nettoyeur'}
              </Button>
            ) : null}
            
            {status === 'completed' ? (
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate('/booking-review', { state: { bookingData } })}
                >
                  {language === 'ar' ? 'تقييم الخدمة' : 'Évaluer le service'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  {language === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                {language === 'ar' ? 'إلغاء الحجز' : 'Annuler la réservation'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPending;
