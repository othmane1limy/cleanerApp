import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ 
  activeFilters = {},
  onRemoveFilter = () => {},
  onClearAll = () => {},
  language = 'fr'
}) => {
  const getFilterChips = () => {
    const chips = [];
    
    if (activeFilters?.serviceType) {
      const serviceLabels = {
        mobile: language === 'ar' ? 'خدمة متنقلة' : 'Service mobile',
        garage: language === 'ar' ? 'في الكراج' : 'Au garage',
        premium: language === 'ar' ? 'خدمة مميزة' : 'Service premium'
      };
      chips?.push({
        key: 'serviceType',
        label: serviceLabels?.[activeFilters?.serviceType] || activeFilters?.serviceType,
        icon: activeFilters?.serviceType === 'mobile' ? 'Car' : 'Building'
      });
    }

    if (activeFilters?.priceRange) {
      chips?.push({
        key: 'priceRange',
        label: `${activeFilters?.priceRange} MAD`,
        icon: 'DollarSign'
      });
    }

    if (activeFilters?.rating) {
      chips?.push({
        key: 'rating',
        label: `${activeFilters?.rating}+ ${language === 'ar' ? 'نجوم' : 'étoiles'}`,
        icon: 'Star'
      });
    }

    if (activeFilters?.distance) {
      chips?.push({
        key: 'distance',
        label: `< ${activeFilters?.distance} km`,
        icon: 'MapPin'
      });
    }

    if (activeFilters?.availability) {
      const availabilityLabels = {
        now: language === 'ar' ? 'متاح الآن' : 'Disponible maintenant',
        today: language === 'ar' ? 'اليوم' : 'Aujourd\'hui',
        tomorrow: language === 'ar' ? 'غداً' : 'Demain'
      };
      chips?.push({
        key: 'availability',
        label: availabilityLabels?.[activeFilters?.availability] || activeFilters?.availability,
        icon: 'Clock'
      });
    }

    if (activeFilters?.specialties && activeFilters?.specialties?.length > 0) {
      activeFilters?.specialties?.forEach(specialty => {
        const specialtyLabels = {
          eco: language === 'ar' ? 'صديق للبيئة' : 'Écologique',
          luxury: language === 'ar' ? 'سيارات فاخرة' : 'Voitures de luxe',
          express: language === 'ar' ? 'خدمة سريعة' : 'Service express'
        };
        chips?.push({
          key: `specialty-${specialty}`,
          label: specialtyLabels?.[specialty] || specialty,
          icon: 'Award'
        });
      });
    }

    return chips;
  };

  const chips = getFilterChips();

  if (chips?.length === 0) return null;

  return (
    <div className="absolute top-20 left-4 right-4 z-30">
      <div className="bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {language === 'ar' ? 'الفلاتر النشطة' : 'Filtres actifs'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {language === 'ar' ? 'مسح الكل' : 'Effacer tout'}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {chips?.map((chip) => (
            <div
              key={chip?.key}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
            >
              <Icon name={chip?.icon} size={12} />
              <span className="font-medium">{chip?.label}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFilter(chip?.key)}
                className="p-0 h-auto w-auto ml-1 rtl:ml-0 rtl:mr-1 text-primary hover:text-primary/80"
              >
                <Icon name="X" size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;