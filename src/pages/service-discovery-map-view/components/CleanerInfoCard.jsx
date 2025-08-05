import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CleanerInfoCard = ({ 
  cleaner = null, 
  onClose = () => {},
  language = 'fr',
  userLocation = null
}) => {
  const navigate = useNavigate();

  if (!cleaner) return null;

  const handleViewProfile = () => {
    navigate('/cleaner-profile-detail', { state: { cleaner } });
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars?.push(<Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars?.push(<Icon key="half" name="StarHalf" size={14} className="text-yellow-400 fill-current" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />);
    }
    
    return stars;
  };

  const getServiceTypeLabel = (type) => {
    const labels = {
      mobile: language === 'ar' ? 'خدمة متنقلة' : 'Service mobile',
      garage: language === 'ar' ? 'في الكراج' : 'Au garage',
      premium: language === 'ar' ? 'خدمة مميزة' : 'Service premium'
    };
    return labels?.[type] || type;
  };

  const getAvailabilityText = (isOnline, nextAvailable) => {
    if (isOnline) {
      return language === 'ar' ? 'متاح الآن' : 'Disponible maintenant';
    }
    return language === 'ar' ? `متاح في ${nextAvailable}` : `Disponible à ${nextAvailable}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-modal border-t border-border max-h-[60vh] overflow-hidden">
      {/* Handle Bar */}
      <div className="flex justify-center py-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {language === 'ar' ? 'تفاصيل المنظف' : 'Détails du nettoyeur'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          iconName="X"
          iconSize={20}
          className="text-muted-foreground"
        />
      </div>
      {/* Content */}
      <div className="px-4 pb-6 overflow-y-auto">
        {/* Cleaner Profile */}
        <div className="flex items-start space-x-4 rtl:space-x-reverse mb-4">
          <div className="relative">
            <Image
              src={cleaner?.profileImage}
              alt={cleaner?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
              cleaner?.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-heading font-semibold text-lg text-foreground truncate">
                {cleaner?.name}
              </h4>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="font-data text-sm text-muted-foreground">
                  {cleaner?.distance}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {getRatingStars(cleaner?.rating)}
              </div>
              <span className="font-data text-sm text-muted-foreground">
                {cleaner?.rating} ({cleaner?.reviewCount} {language === 'ar' ? 'تقييم' : 'avis'})
              </span>
            </div>

            {/* Service Type & Availability */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                cleaner?.serviceType === 'mobile' ?'bg-blue-100 text-blue-800' 
                  : cleaner?.serviceType === 'premium' ?'bg-purple-100 text-purple-800' :'bg-green-100 text-green-800'
              }`}>
                {getServiceTypeLabel(cleaner?.serviceType)}
              </span>
              <span className={`text-xs font-medium ${
                cleaner?.isOnline ? 'text-green-600' : 'text-orange-600'
              }`}>
                {getAvailabilityText(cleaner?.isOnline, cleaner?.nextAvailable)}
              </span>
            </div>
          </div>
        </div>

        {/* Services & Pricing */}
        <div className="bg-muted rounded-lg p-3 mb-4">
          <h5 className="font-heading font-medium text-sm text-foreground mb-2">
            {language === 'ar' ? 'الخدمات والأسعار' : 'Services et tarifs'}
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {cleaner?.services?.slice(0, 4)?.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{service?.name}</span>
                <span className="font-data text-sm font-medium text-foreground">
                  {service?.price} MAD
                </span>
              </div>
            ))}
          </div>
          {cleaner?.services?.length > 4 && (
            <p className="text-xs text-muted-foreground mt-2">
              +{cleaner?.services?.length - 4} {language === 'ar' ? 'خدمات أخرى' : 'autres services'}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`tel:${cleaner?.phone}`)}
            iconName="Phone"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            {language === 'ar' ? 'اتصال' : 'Appeler'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://wa.me/${cleaner?.whatsapp}`)}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            WhatsApp
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleViewProfile}
            iconName="User"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            {language === 'ar' ? 'الملف الشخصي' : 'Voir profil'}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>
                {language === 'ar' ? 'وقت الاستجابة:' : 'Temps de réponse:'}
              </span>
            </div>
            <span className="font-data text-foreground">
              {cleaner?.responseTime} {language === 'ar' ? 'دقيقة' : 'min'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
              <Icon name="Calendar" size={14} />
              <span>
                {language === 'ar' ? 'انضم في:' : 'Membre depuis:'}
              </span>
            </div>
            <span className="font-data text-foreground">
              {cleaner?.memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanerInfoCard;