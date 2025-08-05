import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ServiceTypeFilter = ({ 
  selectedServices = [], 
  onChange = () => {}, 
  language = 'fr' 
}) => {
  const serviceTypes = [
    {
      id: 'interior',
      label: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur',
      description: language === 'ar' ? 'تنظيف المقاعد والسجاد' : 'Nettoyage sièges et tapis',
      icon: 'Car',
      price: '80-120 MAD'
    },
    {
      id: 'exterior',
      label: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur',
      description: language === 'ar' ? 'غسيل وتلميع الخارج' : 'Lavage et lustrage extérieur',
      icon: 'Droplets',
      price: '50-80 MAD'
    },
    {
      id: 'complete',
      label: language === 'ar' ? 'خدمة شاملة' : 'Service complet',
      description: language === 'ar' ? 'داخلي + خارجي' : 'Intérieur + extérieur',
      icon: 'Sparkles',
      price: '120-200 MAD'
    },
    {
      id: 'detailing',
      label: language === 'ar' ? 'تفصيل متقدم' : 'Détailing avancé',
      description: language === 'ar' ? 'تنظيف عميق ومتخصص' : 'Nettoyage profond et spécialisé',
      icon: 'Wrench',
      price: '200-350 MAD'
    },
    {
      id: 'waxing',
      label: language === 'ar' ? 'تشميع وحماية' : 'Cirage et protection',
      description: language === 'ar' ? 'حماية الطلاء والتشميع' : 'Protection peinture et cirage',
      icon: 'Shield',
      price: '100-150 MAD'
    }
  ];

  const handleServiceChange = (serviceId, checked) => {
    if (checked) {
      onChange([...selectedServices, serviceId]);
    } else {
      onChange(selectedServices?.filter(id => id !== serviceId));
    }
  };

  return (
    <div className="space-y-3">
      {serviceTypes?.map((service) => (
        <div key={service?.id} className="flex items-start space-x-3 rtl:space-x-reverse">
          <Checkbox
            checked={selectedServices?.includes(service?.id)}
            onChange={(e) => handleServiceChange(service?.id, e?.target?.checked)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
              <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                <Icon name={service?.icon} size={12} className="text-primary" />
              </div>
              <label className="font-body text-sm font-medium text-foreground cursor-pointer">
                {service?.label}
              </label>
            </div>
            
            <p className="font-caption text-xs text-muted-foreground mb-1">
              {service?.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="font-data text-xs text-accent font-medium">
                {service?.price}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceTypeFilter;