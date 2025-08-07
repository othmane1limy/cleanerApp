
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';

const GarageBookingFlow = () => {
  const [language, setLanguage] = useState('fr');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { cleaner, selectedService } = location.state || {};

  // Available add-ons
  const addOns = [
    { id: 1, name: language === 'ar' ? 'تشميع السيارة' : 'Cirage', price: 50, duration: 30 },
    { id: 2, name: language === 'ar' ? 'تنظيف المحرك' : 'Nettoyage moteur', price: 80, duration: 45 },
    { id: 3, name: language === 'ar' ? 'تنظيف الجنوط' : 'Nettoyage jantes', price: 30, duration: 20 },
    { id: 4, name: language === 'ar' ? 'حماية القماش' : 'Protection tissus', price: 40, duration: 15 }
  ];

  // Generate week dates
  const generateWeekDates = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots for a date
  const generateTimeSlots = (date) => {
    const slots = [];
    const dayOfWeek = date.getDay();
    
    // Skip Sundays (garage closed)
    if (dayOfWeek === 0) return [];
    
    // Saturday has different hours
    const startHour = dayOfWeek === 6 ? 9 : 8;
    const endHour = dayOfWeek === 6 ? 16 : 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Skip lunch break (12-14)
      if (hour >= 12 && hour < 14) continue;
      
      const slot = {
        time: `${hour.toString().padStart(2, '0')}:00`,
        isAvailable: Math.random() > 0.3, // Random availability for demo
        duration: 90
      };
      slots.push(slot);
      
      // Add 30-min slot if there's time
      if (hour + 1 <= endHour && !(hour === 11 || hour === 13)) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:30`,
          isAvailable: Math.random() > 0.4,
          duration: 60
        });
      }
    }
    
    return slots;
  };

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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot) return;
    
    const bookingData = {
      cleaner,
      selectedService,
      selectedAddOns,
      totalPrice,
      selectedDate,
      selectedTimeSlot,
      bookingType: 'garage',
      status: 'confirmed'
    };
    navigate('/booking-confirmation', { state: { bookingData } });
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    };
    return date.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', options);
  };

  const getTotalDuration = () => {
    const baseDuration = selectedService?.duration || 60;
    const addOnsDuration = selectedAddOns.reduce((sum, addOn) => sum + addOn.duration, 0);
    return baseDuration + addOnsDuration;
  };

  const weekDates = generateWeekDates(currentWeek);

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
              {language === 'ar' ? 'حجز موعد' : 'Réserver un créneau'}
            </h1>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
              <Icon name="Building" size={16} />
              <span className="text-sm">
                {language === 'ar' ? 'في الكراج' : 'Au garage'}
              </span>
            </div>
          </div>

          {/* Garage Info */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
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
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              <Icon name="MapPin" size={14} />
              <span>{cleaner.address}</span>
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

          {/* Calendar Selection */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-medium text-foreground">
                {language === 'ar' ? 'اختر التاريخ' : 'Choisir la date'}
              </h3>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(prev => prev - 1)}
                  iconName="ChevronLeft"
                  iconSize={16}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(prev => prev + 1)}
                  iconName="ChevronRight"
                  iconSize={16}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const isSelected = selectedDate && 
                  date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                const isPast = date < new Date().setHours(0,0,0,0);
                const isSunday = date.getDay() === 0;
                const isDisabled = isPast || isSunday;
                
                return (
                  <div
                    key={index}
                    className={`p-3 text-center rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary text-white'
                        : isDisabled
                        ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => !isDisabled && handleDateSelect(date)}
                  >
                    <div className="text-xs mb-1">
                      {formatDate(date).split(' ')[0]}
                    </div>
                    <div className={`text-sm font-medium ${isToday && !isSelected ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <h3 className="font-heading font-medium text-foreground mb-4">
                {language === 'ar' ? 'اختر الوقت' : 'Choisir l\'heure'}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {generateTimeSlots(selectedDate).map((slot, index) => {
                  const isSelected = selectedTimeSlot && 
                    selectedTimeSlot.time === slot.time;
                  
                  return (
                    <button
                      key={index}
                      className={`p-3 text-sm rounded-lg border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : slot.isAvailable
                          ? 'border-border hover:border-primary/50 text-foreground'
                          : 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      disabled={!slot.isAvailable}
                      onClick={() => slot.isAvailable && handleTimeSlotSelect(slot)}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
          <Button 
            onClick={handleConfirmBooking}
            className="w-full"
            size="lg"
            disabled={!selectedDate || !selectedTimeSlot}
          >
            {language === 'ar' ? 'تأكيد الحجز' : 'Confirmer la réservation'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GarageBookingFlow;
