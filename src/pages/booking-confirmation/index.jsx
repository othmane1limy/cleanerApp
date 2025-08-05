
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../../components/ui/Icon';
import { Button } from '../../components/ui/Button';
import { GlobalHeader } from '../../components/ui/GlobalHeader';
import { NavigationBreadcrumb } from '../../components/ui/NavigationBreadcrumb';

const BookingConfirmation = () => {
  const [language, setLanguage] = useState('fr');
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData } = location.state || {};

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', options);
  };

  const openGoogleMaps = () => {
    const address = encodeURIComponent(bookingData.cleaner?.address);
    const url = `https://maps.google.com/?q=${address}`;
    window.open(url, '_blank');
  };

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
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
              {language === 'ar' ? 'تم تأكيد الحجز!' : 'Réservation confirmée !'}
            </h1>
            <p className="text-muted-foreground">
              {bookingData.bookingType === 'garage' 
                ? (language === 'ar' ? 'يرجى الحضور إلى الكراج في الوقت المحدد' : 'Veuillez vous présenter au garage à l\'heure prévue')
                : (language === 'ar' ? 'سيتم إرسال إشعار عند قبول الطلب' : 'Vous recevrez une notification une fois la demande acceptée')
              }
            </p>
          </div>

          {/* Booking Reference */}
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'رقم الحجز' : 'Référence'}
                </span>
                <div className="font-data font-bold text-lg text-primary">
                  #BK{Date.now().toString().slice(-6)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الحالة' : 'Statut'}
                </span>
                <div className="font-medium text-success">
                  {bookingData.bookingType === 'garage' 
                    ? (language === 'ar' ? 'مؤكد' : 'Confirmé')
                    : (language === 'ar' ? 'في الانتظار' : 'En attente')
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Cleaner/Garage Info */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                <img 
                  src={bookingData.cleaner?.profileImage} 
                  alt={bookingData.cleaner?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-foreground">
                  {bookingData.cleaner?.name}
                </h3>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm text-muted-foreground">
                    {bookingData.cleaner?.rating} ({bookingData.cleaner?.totalReviews})
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Icon 
                      name={bookingData.bookingType === 'garage' ? 'Building' : 'Car'} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-sm text-muted-foreground">
                      {bookingData.bookingType === 'garage' 
                        ? (language === 'ar' ? 'كراج' : 'Garage')
                        : (language === 'ar' ? 'متنقل' : 'Mobile')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {bookingData.bookingType === 'garage' && (
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">
                    {language === 'ar' ? 'عنوان الكراج' : 'Adresse du garage'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openGoogleMaps}
                    iconName="Navigation"
                    iconPosition="left"
                    iconSize={14}
                  >
                    {language === 'ar' ? 'الاتجاهات' : 'Itinéraire'}
                  </Button>
                </div>
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {bookingData.cleaner?.address}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          {bookingData.bookingType === 'garage' && (
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <h3 className="font-heading font-medium text-foreground mb-3">
                {language === 'ar' ? 'تفاصيل الموعد' : 'Détails du rendez-vous'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">
                      {formatDate(bookingData.selectedDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">
                      {bookingData.selectedTimeSlot?.time}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2 rtl:mr-2">
                      ({bookingData.selectedTimeSlot?.duration} min)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Details */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <h3 className="font-heading font-medium text-foreground mb-3">
              {language === 'ar' ? 'تفاصيل الخدمة' : 'Détails du service'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {bookingData.selectedService?.name}
                </span>
                <span className="font-data text-foreground">
                  {bookingData.selectedService?.price} MAD
                </span>
              </div>
              
              {bookingData.selectedAddOns?.length > 0 && (
                <div className="border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground mb-2 block">
                    {language === 'ar' ? 'خدمات إضافية:' : 'Services additionnels:'}
                  </span>
                  {bookingData.selectedAddOns.map((addOn, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">+ {addOn.name}</span>
                      <span className="font-data text-foreground">
                        +{addOn.price} MAD
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-foreground">
                    {language === 'ar' ? 'المجموع' : 'Total'}
                  </span>
                  <span className="font-data text-lg text-primary">
                    {bookingData.totalPrice} MAD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`tel:${bookingData.cleaner?.phone}`)}
              iconName="Phone"
              iconPosition="left"
            >
              {language === 'ar' ? 'اتصال' : 'Appeler'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://wa.me/${bookingData.cleaner?.whatsapp}`)}
              iconName="MessageCircle"
              iconPosition="left"
            >
              WhatsApp
            </Button>

            <Button
              className="w-full"
              onClick={() => navigate('/')}
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
            </Button>
          </div>

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-heading font-medium text-foreground mb-2">
              {language === 'ar' ? 'ملاحظات مهمة' : 'Notes importantes'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {bookingData.bookingType === 'garage' ? (
                <>
                  <li>• {language === 'ar' ? 'يرجى الوصول قبل 5 دقائق من الموعد' : 'Veuillez arriver 5 minutes avant votre rendez-vous'}</li>
                  <li>• {language === 'ar' ? 'أحضر مفاتيح السيارة' : 'Apportez les clés de votre véhicule'}</li>
                  <li>• {language === 'ar' ? 'الدفع نقداً أو بالبطاقة' : 'Paiement en espèces ou par carte'}</li>
                </>
              ) : (
                <>
                  <li>• {language === 'ar' ? 'سيتم إرسال إشعار عند قبول الطلب' : 'Vous recevrez une notification une fois acceptée'}</li>
                  <li>• {language === 'ar' ? 'تأكد من وجود مصدر مياه' : 'Assurez-vous d\'avoir un point d\'eau'}</li>
                  <li>• {language === 'ar' ? 'الدفع نقداً للمنظف مباشرة' : 'Paiement en espèces directement au nettoyeur'}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
