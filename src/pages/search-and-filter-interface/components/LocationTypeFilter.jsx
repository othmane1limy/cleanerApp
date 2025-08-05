import React from 'react';

import Icon from '../../../components/AppIcon';

const LocationTypeFilter = ({ 
  selectedType = '', 
  onChange = () => {}, 
  language = 'fr' 
}) => {
  const locationTypes = [
    {
      id: 'mobile',
      label: language === 'ar' ? 'خدمة متنقلة' : 'Service mobile',
      description: language === 'ar' ? 'يأتي إليك في موقعك' : 'Vient à votre emplacement',
      icon: 'Truck',
      benefits: language === 'ar' ? 'مريح وسريع' : 'Pratique et rapide'
    },
    {
      id: 'garage',
      label: language === 'ar' ? 'في الكراج' : 'En garage',
      description: language === 'ar' ? 'في مكان العمل المخصص' : 'Dans un lieu de travail dédié',
      icon: 'Building',
      benefits: language === 'ar' ? 'معدات متقدمة' : 'Équipement avancé'
    }
  ];

  return (
    <div className="space-y-3">
      {locationTypes?.map((type) => (
        <div
          key={type?.id}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedType === type?.id
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }`}
          onClick={() => onChange(selectedType === type?.id ? '' : type?.id)}
        >
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedType === type?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Icon name={type?.icon} size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-body font-medium text-sm text-foreground">
                  {type?.label}
                </h4>
                {selectedType === type?.id && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
              
              <p className="font-caption text-xs text-muted-foreground mb-2">
                {type?.description}
              </p>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="Star" size={12} className="text-accent" />
                <span className="font-caption text-xs text-accent">
                  {type?.benefits}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationTypeFilter;