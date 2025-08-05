import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServicesList = ({ services, language }) => {
  const getServiceIcon = (type) => {
    const iconMap = {
      exterior: 'Droplets',
      interior: 'Home',
      complete: 'Sparkles',
      detailing: 'Star',
      waxing: 'Shield',
      engine: 'Wrench'
    };
    return iconMap?.[type] || 'Car';
  };

  const getDurationText = (duration) => {
    if (language === 'ar') {
      return `${duration} دقيقة`;
    }
    return `${duration} min`;
  };

  return (
    <div className="space-y-4">
      {services?.map((service) => (
        <div key={service?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-interactive smooth-transition">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
              {/* Service Icon */}
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={getServiceIcon(service?.type)} 
                  size={20} 
                  className="text-primary" 
                />
              </div>

              {/* Service Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-semibold text-base text-foreground">
                    {service?.name}
                  </h3>
                  <div className="text-right rtl:text-left">
                    <div className="font-data font-bold text-lg text-foreground">
                      {service?.price} MAD
                    </div>
                    {service?.originalPrice && (
                      <div className="font-data text-sm text-muted-foreground line-through">
                        {service?.originalPrice} MAD
                      </div>
                    )}
                  </div>
                </div>

                <p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed">
                  {service?.description}
                </p>

                {/* Service Features */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="font-caption text-xs text-muted-foreground">
                        {getDurationText(service?.duration)}
                      </span>
                    </div>

                    {service?.isPopular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                        <Icon name="TrendingUp" size={10} className="mr-1 rtl:mr-0 rtl:ml-1" />
                        {language === 'ar' ? 'شائع' : 'Populaire'}
                      </span>
                    )}

                    {service?.isEco && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        <Icon name="Leaf" size={10} className="mr-1 rtl:mr-0 rtl:ml-1" />
                        {language === 'ar' ? 'صديق للبيئة' : 'Écologique'}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={14}
                    className="flex-shrink-0"
                  >
                    {language === 'ar' ? 'إضافة' : 'Ajouter'}
                  </Button>
                </div>

                {/* Included Features */}
                {service?.includes && service?.includes?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-2">
                      {service?.includes?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Icon name="Check" size={12} className="text-success flex-shrink-0" />
                          <span className="font-caption text-xs text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Package Deals */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4 mt-6">
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <Icon name="Package" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-base text-foreground">
            {language === 'ar' ? 'عروض الباقات' : 'Offres groupées'}
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-foreground">
              {language === 'ar' ? 'خدمة شاملة + تلميع' : 'Service complet + Cirage'}
            </span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-data text-sm text-muted-foreground line-through">
                280 MAD
              </span>
              <span className="font-data font-bold text-base text-primary">
                220 MAD
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-foreground">
              {language === 'ar' ? '3 خدمات خارجية' : '3 Lavages extérieurs'}
            </span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-data text-sm text-muted-foreground line-through">
                180 MAD
              </span>
              <span className="font-data font-bold text-base text-primary">
                150 MAD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesList;