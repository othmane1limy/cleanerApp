import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll, language = 'fr' }) => {
  const getFilterLabel = (key, value) => {
    const labels = {
      fr: {
        serviceType: {
          exterior: 'Lavage extérieur',
          interior: 'Nettoyage intérieur',
          complete: 'Service complet',
          detailing: 'Détailing avancé'
        },
        priceRange: {
          '0-50': '0-50 MAD',
          '50-100': '50-100 MAD',
          '100-200': '100-200 MAD',
          '200+': '200+ MAD'
        },
        rating: {
          '4+': '4+ étoiles',
          '3+': '3+ étoiles',
          '2+': '2+ étoiles'
        },
        distance: {
          '1': 'Moins de 1 km',
          '5': 'Moins de 5 km',
          '10': 'Moins de 10 km',
          '20': 'Moins de 20 km'
        },
        availability: {
          now: 'Disponible maintenant',
          today: 'Aujourd\'hui',
          tomorrow: 'Demain',
          week: 'Cette semaine'
        },
        specialties: {
          eco: 'Écologique',
          luxury: 'Voitures de luxe',
          mobile: 'Service mobile',
          express: 'Service express'
        }
      },
      ar: {
        serviceType: {
          exterior: 'غسيل خارجي',
          interior: 'تنظيف داخلي',
          complete: 'خدمة شاملة',
          detailing: 'تفصيل متقدم'
        },
        priceRange: {
          '0-50': '0-50 درهم',
          '50-100': '50-100 درهم',
          '100-200': '100-200 درهم',
          '200+': '200+ درهم'
        },
        rating: {
          '4+': '4+ نجوم',
          '3+': '3+ نجوم',
          '2+': '2+ نجوم'
        },
        distance: {
          '1': 'أقل من 1 كم',
          '5': 'أقل من 5 كم',
          '10': 'أقل من 10 كم',
          '20': 'أقل من 20 كم'
        },
        availability: {
          now: 'متاح الآن',
          today: 'اليوم',
          tomorrow: 'غداً',
          week: 'هذا الأسبوع'
        },
        specialties: {
          eco: 'صديق للبيئة',
          luxury: 'سيارات فاخرة',
          mobile: 'خدمة متنقلة',
          express: 'خدمة سريعة'
        }
      }
    };

    if (key === 'specialties' && Array.isArray(value)) {
      return value?.map(v => labels?.[language]?.[key]?.[v] || v)?.join(', ');
    }

    return labels?.[language]?.[key]?.[value] || value;
  };

  const getActiveFilterChips = () => {
    const chips = [];
    
    Object.entries(activeFilters)?.forEach(([key, value]) => {
      if (value && value !== '' && !(Array.isArray(value) && value?.length === 0)) {
        chips?.push({
          key,
          value,
          label: getFilterLabel(key, value)
        });
      }
    });

    return chips;
  };

  const chips = getActiveFilterChips();

  if (chips?.length === 0) return null;

  return (
    <div className="bg-background border-b border-border px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm text-foreground">
          {language === 'ar' ? 'الفلاتر النشطة' : 'Filtres actifs'}
        </span>
        
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
      <div className="flex flex-wrap gap-2">
        {chips?.map((chip) => (
          <div
            key={`${chip?.key}-${chip?.value}`}
            className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            <span className="font-medium truncate max-w-32">
              {chip?.label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveFilter(chip?.key)}
              className="w-4 h-4 p-0 hover:bg-primary/20 rounded-full"
            >
              <Icon name="X" size={12} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;