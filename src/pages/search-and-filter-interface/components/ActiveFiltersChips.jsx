import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActiveFiltersChips = ({ 
  filters = {}, 
  onRemoveFilter = () => {}, 
  onClearAll = () => {},
  language = 'fr',
  className = ''
}) => {
  const getFilterChips = () => {
    const chips = [];

    // Search query
    if (filters?.searchQuery) {
      chips?.push({
        id: 'searchQuery',
        label: `"${filters?.searchQuery}"`,
        type: 'search'
      });
    }

    // Service types
    if (filters?.selectedServices && filters?.selectedServices?.length > 0) {
      const serviceLabels = {
        interior: language === 'ar' ? 'تنظيف داخلي' : 'Intérieur',
        exterior: language === 'ar' ? 'غسيل خارجي' : 'Extérieur',
        complete: language === 'ar' ? 'خدمة شاملة' : 'Complet',
        detailing: language === 'ar' ? 'تفصيل متقدم' : 'Détailing',
        waxing: language === 'ar' ? 'تشميع' : 'Cirage'
      };

      filters?.selectedServices?.forEach(service => {
        chips?.push({
          id: `service-${service}`,
          label: serviceLabels?.[service] || service,
          type: 'service',
          filterKey: 'selectedServices',
          value: service
        });
      });
    }

    // Location type
    if (filters?.locationType) {
      const locationLabel = filters?.locationType === 'mobile' 
        ? (language === 'ar' ? 'خدمة متنقلة' : 'Service mobile')
        : (language === 'ar' ? 'في الكراج' : 'En garage');
      
      chips?.push({
        id: 'locationType',
        label: locationLabel,
        type: 'location'
      });
    }

    // Price range
    if (filters?.priceRange && filters?.priceRange?.length === 2) {
      chips?.push({
        id: 'priceRange',
        label: `${filters?.priceRange?.[0]}-${filters?.priceRange?.[1]} MAD`,
        type: 'price'
      });
    }

    // Rating
    if (filters?.selectedRating) {
      chips?.push({
        id: 'selectedRating',
        label: `${filters?.selectedRating}+ ${language === 'ar' ? 'نجوم' : 'étoiles'}`,
        type: 'rating'
      });
    }

    // Availability
    if (filters?.selectedAvailability) {
      const availabilityLabels = {
        now: language === 'ar' ? 'متاح الآن' : 'Maintenant',
        today: language === 'ar' ? 'اليوم' : 'Aujourd\'hui',
        tomorrow: language === 'ar' ? 'غداً' : 'Demain',
        week: language === 'ar' ? 'هذا الأسبوع' : 'Cette semaine',
        weekend: language === 'ar' ? 'نهاية الأسبوع' : 'Week-end'
      };

      chips?.push({
        id: 'selectedAvailability',
        label: availabilityLabels?.[filters?.selectedAvailability] || filters?.selectedAvailability,
        type: 'availability'
      });
    }

    return chips;
  };

  const handleRemoveChip = (chip) => {
    if (chip?.filterKey && chip?.value) {
      // Handle array filters (like selectedServices)
      const currentValues = filters?.[chip?.filterKey] || [];
      const newValues = currentValues?.filter(v => v !== chip?.value);
      onRemoveFilter(chip?.filterKey, newValues);
    } else {
      // Handle single value filters
      onRemoveFilter(chip?.id, '');
    }
  };

  const getChipIcon = (type) => {
    switch (type) {
      case 'search': return 'Search';
      case 'service': return 'Wrench';
      case 'location': return 'MapPin';
      case 'price': return 'DollarSign';
      case 'rating': return 'Star';
      case 'availability': return 'Clock';
      default: return 'Filter';
    }
  };

  const chips = getFilterChips();

  if (chips?.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="font-body text-sm text-muted-foreground">
        {language === 'ar' ? 'الفلاتر النشطة:' : 'Filtres actifs:'}
      </span>
      {chips?.map((chip) => (
        <div
          key={chip?.id}
          className="flex items-center space-x-1 rtl:space-x-reverse bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5 text-sm"
        >
          <Icon name={getChipIcon(chip?.type)} size={12} />
          <span className="font-body text-xs">
            {chip?.label}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveChip(chip)}
            iconName="X"
            iconSize={12}
            className="h-4 w-4 p-0 ml-1 rtl:ml-0 rtl:mr-1 hover:bg-primary/20"
          />
        </div>
      ))}
      {chips?.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          {language === 'ar' ? 'مسح الكل' : 'Tout effacer'}
        </Button>
      )}
    </div>
  );
};

export default ActiveFiltersChips;