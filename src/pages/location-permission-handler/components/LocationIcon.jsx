import React from 'react';
import Icon from '../../../components/AppIcon';

const LocationIcon = ({ language = 'fr', className = '' }) => {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Main location icon container */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="MapPin" size={40} className="text-primary" />
        </div>
        
        {/* Animated pulse rings */}
        <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/20 animate-ping"></div>
        <div className="absolute inset-2 w-20 h-20 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Location text */}
      <div className="text-center">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
          {language === 'ar' ? 'تحديد موقعك' : 'Localiser votre position'}
        </h3>
        <p className="font-body text-sm text-muted-foreground">
          {language === 'ar' ? 'للعثور على أفضل الخدمات القريبة منك' : 'Pour trouver les meilleurs services près de vous'}
        </p>
      </div>
    </div>
  );
};

export default LocationIcon;