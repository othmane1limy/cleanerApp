import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProfileHero = ({ cleaner, language, distance }) => {
  const getStatusText = (isOnline) => {
    if (language === 'ar') {
      return isOnline ? 'متصل الآن' : 'غير متصل';
    }
    return isOnline ? 'En ligne' : 'Hors ligne';
  };

  const getServiceTypeText = (type) => {
    if (language === 'ar') {
      return type === 'mobile' ? 'خدمة متنقلة' : 'في الموقع';
    }
    return type === 'mobile' ? 'Service mobile' : 'À l\'atelier';
  };

  return (
    <div className="relative bg-gradient-to-b from-primary/5 to-background">
      <div className="px-4 lg:px-6 pt-6 pb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-interactive">
              <Image
                src={cleaner?.profileImage}
                alt={cleaner?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status Badge */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 rounded-full border-3 border-white flex items-center justify-center ${
              cleaner?.isOnline ? 'bg-success' : 'bg-muted-foreground'
            }`}>
              <Icon 
                name={cleaner?.isOnline ? "Zap" : "ZapOff"} 
                size={12} 
                color="white" 
              />
            </div>
          </div>

          {/* Name and Basic Info */}
          <div className="space-y-2">
            <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
              {cleaner?.name}
            </h1>
            
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              {/* Rating */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Icon name="Star" size={16} className="text-warning fill-current" />
                <span className="font-data text-sm font-medium text-foreground">
                  {cleaner?.rating}
                </span>
                <span className="font-body text-sm text-muted-foreground">
                  ({cleaner?.totalReviews} {language === 'ar' ? 'تقييم' : 'avis'})
                </span>
              </div>

              {/* Distance */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Icon name="MapPin" size={16} className="text-muted-foreground" />
                <span className="font-data text-sm text-muted-foreground">
                  {distance} km
                </span>
              </div>
            </div>

            {/* Status and Service Type */}
            <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                cleaner?.isOnline 
                  ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
              }`}>
                {getStatusText(cleaner?.isOnline)}
              </span>
              
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Icon 
                  name={cleaner?.serviceType === 'mobile' ? 'Car' : 'Building'} 
                  size={12} 
                  className="mr-1 rtl:mr-0 rtl:ml-1" 
                />
                {getServiceTypeText(cleaner?.serviceType)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse pt-2">
            <div className="text-center">
              <div className="font-data font-bold text-lg text-foreground">
                {cleaner?.completedJobs}
              </div>
              <div className="font-caption text-xs text-muted-foreground">
                {language === 'ar' ? 'مهمة مكتملة' : 'Tâches terminées'}
              </div>
            </div>
            
            <div className="w-px h-8 bg-border"></div>
            
            <div className="text-center">
              <div className="font-data font-bold text-lg text-foreground">
                {cleaner?.responseTime}
              </div>
              <div className="font-caption text-xs text-muted-foreground">
                {language === 'ar' ? 'وقت الاستجابة' : 'Temps de réponse'}
              </div>
            </div>
            
            <div className="w-px h-8 bg-border"></div>
            
            <div className="text-center">
              <div className="font-data font-bold text-lg text-success">
                {cleaner?.experienceYears}
              </div>
              <div className="font-caption text-xs text-muted-foreground">
                {language === 'ar' ? 'سنوات خبرة' : 'Années d\'exp.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;