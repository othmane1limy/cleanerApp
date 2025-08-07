import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../lib/supabase';

const MobileBookingFlow = () => {
  const [language, setLanguage] = useState('fr');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const cleaner = location.state?.cleaner;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    selectedService: null,
    selectedDate: '',
    selectedTime: '',
    locationAddress: '',
    phoneNumber: '',
    specialRequests: ''
  });

  // Available add-ons
  const addOns = [
    { id: 1, name: language === 'ar' ? 'تشميع السيارة' : 'Cirage', price: 50, duration: 30 },
    { id: 2, name: language === 'ar' ? 'تنظيف المحرك' : 'Nettoyage moteur', price: 80, duration: 45 },
    { id: 3, name: language === 'ar' ? 'تنظيف الجنوط' : 'Nettoyage jantes', price: 30, duration: 20 },
    { id: 4, name: language === 'ar' ? 'حماية القماش' : 'Protection tissus', price: 40, duration: 15 }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    // Calculate total price
    const basePrice = selectedService?.price || 0;
    const addOnsPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    setTotalPrice(basePrice + addOnsPrice);
  }, [selectedAddOns, selectedService]);

  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      setError(language === 'ar' ? 'يجب أن تكون مسجلاً للدخول للحجز' : 'Vous devez être connecté pour réserver');
      return;
    }
    if (!cleaner || !selectedService) {
      setError(language === 'ar' ? 'بيانات الحجز غير مكتملة' : 'Données de réservation incomplètes');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const booking = {
        client_id: user.id,
        cleaner_id: cleaner.user_id,
        service_id: selectedService.id, // Assuming selectedService has an 'id'
        booking_type: 'mobile',
        scheduled_date: new Date().toISOString().split('T')[0], // Example: use current date
        scheduled_time: new Date().toTimeString().split(' ')[0], // Example: use current time
        location_address: cleaner.address, // Placeholder, ideally from user input
        total_amount: totalPrice,
        notes: selectedAddOns.map(addon => addon.name).join(', ') // Example: join add-on names as notes
      };

      // Assuming bookingService.createBooking is implemented in supabase.js
      // and returns { data, error }
      const { data, error } = await bookingService.createBooking(booking);

      if (error) {
        setError(language === 'ar' ? 'خطأ في إنشاء الحجز' : 'Erreur lors de la création de la réservation');
        console.error('Supabase booking error:', error);
      } else {
        navigate('/booking-confirmation', { state: { bookingId: data.id } });
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ غير متوقع' : 'Une erreur inattendue est survenue');
      console.error('Booking flow error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDuration = () => {
    const baseDuration = selectedService?.duration || 60;
    const addOnsDuration = selectedAddOns.reduce((sum, addOn) => sum + addOn.duration, 0);
    return baseDuration + addOnsDuration;
  };

  if (!cleaner || !selectedService) {
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
              {language === 'ar' ? 'تأكيد الخدمة' : 'Confirmation du service'}
            </h1>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
              <Icon name="Car" size={16} />
              <span className="text-sm">
                {language === 'ar' ? 'خدمة متنقلة' : 'Service mobile'}
              </span>
            </div>
          </div>

          {/* Cleaner Info */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                <img
                  src={cleaner.profileImage}
                  alt={cleaner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-foreground">{cleaner.name}</h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm text-muted-foreground">
                    {cleaner.rating} ({cleaner.totalReviews})
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {cleaner.distance} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Service */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <h3 className="font-heading font-medium text-foreground mb-3">
              {language === 'ar' ? 'الخدمة المختارة' : 'Service sélectionné'}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">{selectedService.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground mt-1">
                  <Icon name="Clock" size={14} />
                  <span>{selectedService.duration} min</span>
                </div>
              </div>
              <span className="font-data font-semibold text-lg text-foreground">
                {selectedService.price} MAD
              </span>
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <h3 className="font-heading font-medium text-foreground mb-3">
              {language === 'ar' ? 'خدمات إضافية (اختيارية)' : 'Services additionnels (optionnels)'}
            </h3>
            <div className="space-y-3">
              {addOns.map((addOn) => {
                const isSelected = selectedAddOns.find(item => item.id === addOn.id);
                return (
                  <div
                    key={addOn.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleAddOnToggle(addOn)}
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <Icon name="Check" size={12} color="white" />}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{addOn.name}</span>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          <span>+{addOn.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-data font-semibold text-foreground">
                      +{addOn.price} MAD
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading font-medium text-foreground">
                {language === 'ar' ? 'المجموع' : 'Total'}
              </span>
              <span className="font-data font-bold text-xl text-primary">
                {totalPrice} MAD
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>
                {language === 'ar' ? 'مدة تقديرية:' : 'Durée estimée:'} {getTotalDuration()} min
              </span>
            </div>
          </div>

          {/* Action Button */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <Button
            onClick={handleConfirmBooking}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading
              ? (language === 'ar' ? 'جاري الحجز...' : 'Réservation en cours...')
              : (language === 'ar' ? 'تأكيد الحجز' : 'Confirmer la réservation')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBookingFlow;