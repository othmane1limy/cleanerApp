import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const CleanerCard = ({ cleaner, language = 'fr', onViewProfile }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(cleaner);
    } else {
      navigate('/cleaner-profile-detail', { state: { cleaner } });
    }
  };

  const getServiceBadges = () => {
    const badges = [];
    if (cleaner?.isMobile) {
      badges?.push({
        key: 'mobile',
        label: language === 'ar' ? 'متنقل' : 'Mobile',
        icon: 'Car',
        color: 'bg-accent text-accent-foreground'
      });
    }
    if (cleaner?.hasGarage) {
      badges?.push({
        key: 'garage',
        label: language === 'ar' ? 'ورشة' : 'Garage',
        icon: 'Building',
        color: 'bg-secondary text-secondary-foreground'
      });
    }
    return badges;
  };

  const formatPrice = (price) => {
    return `${price} MAD`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={14} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-subtle hover:shadow-interactive smooth-transition">
      {/* Header Section */}
      <div className="flex items-start space-x-3 rtl:space-x-reverse mb-3">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={cleaner?.profileImage}
              alt={cleaner?.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
            cleaner?.isOnline ? 'bg-success' : 'bg-muted-foreground'
          }`} />
        </div>

        {/* Cleaner Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-base text-foreground truncate">
                {cleaner?.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse mt-1">
                <div className="flex items-center space-x-0.5 rtl:space-x-reverse">
                  {renderStars(cleaner?.rating)}
                </div>
                <span className="font-data text-sm text-muted-foreground">
                  {cleaner?.rating} ({cleaner?.reviewCount})
                </span>
              </div>

              {/* Distance */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse mt-1">
                <Icon name="MapPin" size={12} className="text-muted-foreground" />
                <span className="font-caption text-sm text-muted-foreground">
                  {cleaner?.distance} {language === 'ar' ? 'كم' : 'km'}
                </span>
              </div>
            </div>

            {/* Online Status */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              cleaner?.isOnline 
                ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
            }`}>
              {cleaner?.isOnline 
                ? (language === 'ar' ? 'متاح' : 'En ligne')
                : (language === 'ar' ? 'غير متاح' : 'Hors ligne')
              }
            </div>
          </div>
        </div>
      </div>
      {/* Service Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {getServiceBadges()?.map((badge) => (
          <div
            key={badge?.key}
            className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}
          >
            <Icon name={badge?.icon} size={12} />
            <span>{badge?.label}</span>
          </div>
        ))}
      </div>
      {/* Services */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {cleaner?.services?.slice(0, 3)?.map((service, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
            >
              {service}
            </span>
          ))}
          {cleaner?.services?.length > 3 && (
            <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
              +{cleaner?.services?.length - 3} {language === 'ar' ? 'أخرى' : 'autres'}
            </span>
          )}
        </div>
      </div>
      {/* Pricing */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-caption text-sm text-muted-foreground">
            {language === 'ar' ? 'يبدأ من' : 'À partir de'}
          </span>
          <div className="font-data font-semibold text-lg text-foreground">
            {formatPrice(cleaner?.startingPrice)}
          </div>
        </div>

        {cleaner?.isPromoted && (
          <div className="bg-warning/10 text-warning px-2 py-1 rounded text-xs font-medium">
            {language === 'ar' ? 'مميز' : 'Promu'}
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewProfile}
          className="flex-1"
        >
          {language === 'ar' ? 'عرض الملف' : 'Voir profil'}
        </Button>
        
        <Button
          variant="default"
          size="sm"
          disabled={!cleaner?.isOnline}
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          className="flex-1"
        >
          {language === 'ar' ? 'حجز' : 'Réserver'}
        </Button>
      </div>
    </div>
  );
};

export default CleanerCard;