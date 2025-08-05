import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ currentSort, onSortChange, language = 'fr' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    {
      value: 'distance',
      label: language === 'ar' ? 'المسافة' : 'Distance',
      icon: 'MapPin'
    },
    {
      value: 'rating',
      label: language === 'ar' ? 'التقييم' : 'Note',
      icon: 'Star'
    },
    {
      value: 'price_low',
      label: language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Prix: croissant',
      icon: 'TrendingUp'
    },
    {
      value: 'price_high',
      label: language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Prix: décroissant',
      icon: 'TrendingDown'
    },
    {
      value: 'availability',
      label: language === 'ar' ? 'التوفر' : 'Disponibilité',
      icon: 'Clock'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  const getCurrentSortLabel = () => {
    const current = sortOptions?.find(option => option?.value === currentSort);
    return current ? current?.label : (language === 'ar' ? 'ترتيب' : 'Trier');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        iconName="ArrowUpDown"
        iconPosition="right"
        iconSize={16}
        className="min-w-32"
      >
        {getCurrentSortLabel()}
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-modal z-50">
          <div className="py-1">
            {sortOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleSortSelect(option?.value)}
                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 text-left hover:bg-muted smooth-transition ${
                  currentSort === option?.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <Icon 
                  name={option?.icon} 
                  size={16} 
                  className={currentSort === option?.value ? 'text-primary' : 'text-muted-foreground'} 
                />
                <span className="font-medium text-sm">{option?.label}</span>
                {currentSort === option?.value && (
                  <Icon name="Check" size={16} className="text-primary ml-auto rtl:ml-0 rtl:mr-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;