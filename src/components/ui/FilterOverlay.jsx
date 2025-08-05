import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';
import Icon from '../AppIcon';

const FilterOverlay = ({ 
  isOpen = false, 
  onClose = () => {},
  onApplyFilters = () => {},
  language = 'fr',
  initialFilters = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    searchQuery: '',
    serviceType: '',
    priceRange: '',
    rating: '',
    distance: '',
    availability: '',
    specialties: [],
    ...initialFilters
  });

  const serviceTypes = [
    { value: 'exterior', label: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur' },
    { value: 'interior', label: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur' },
    { value: 'complete', label: language === 'ar' ? 'خدمة شاملة' : 'Service complet' },
    { value: 'detailing', label: language === 'ar' ? 'تفصيل متقدم' : 'Détailing avancé' }
  ];

  const priceRanges = [
    { value: '0-50', label: '0-50 MAD' },
    { value: '50-100', label: '50-100 MAD' },
    { value: '100-200', label: '100-200 MAD' },
    { value: '200+', label: '200+ MAD' }
  ];

  const ratingOptions = [
    { value: '4+', label: language === 'ar' ? '4+ نجوم' : '4+ étoiles' },
    { value: '3+', label: language === 'ar' ? '3+ نجوم' : '3+ étoiles' },
    { value: '2+', label: language === 'ar' ? '2+ نجوم' : '2+ étoiles' }
  ];

  const distanceOptions = [
    { value: '1', label: language === 'ar' ? 'أقل من 1 كم' : 'Moins de 1 km' },
    { value: '5', label: language === 'ar' ? 'أقل من 5 كم' : 'Moins de 5 km' },
    { value: '10', label: language === 'ar' ? 'أقل من 10 كم' : 'Moins de 10 km' },
    { value: '20', label: language === 'ar' ? 'أقل من 20 كم' : 'Moins de 20 km' }
  ];

  const availabilityOptions = [
    { value: 'now', label: language === 'ar' ? 'متاح الآن' : 'Disponible maintenant' },
    { value: 'today', label: language === 'ar' ? 'اليوم' : 'Aujourd\'hui' },
    { value: 'tomorrow', label: language === 'ar' ? 'غداً' : 'Demain' },
    { value: 'week', label: language === 'ar' ? 'هذا الأسبوع' : 'Cette semaine' }
  ];

  const specialtyOptions = [
    { value: 'eco', label: language === 'ar' ? 'صديق للبيئة' : 'Écologique' },
    { value: 'luxury', label: language === 'ar' ? 'سيارات فاخرة' : 'Voitures de luxe' },
    { value: 'mobile', label: language === 'ar' ? 'خدمة متنقلة' : 'Service mobile' },
    { value: 'express', label: language === 'ar' ? 'خدمة سريعة' : 'Service express' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSpecialtyChange = (specialty, checked) => {
    setFilters(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev?.specialties, specialty]
        : prev?.specialties?.filter(s => s !== specialty)
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      serviceType: '',
      priceRange: '',
      rating: '',
      distance: '',
      availability: '',
      specialties: []
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.searchQuery) count++;
    if (filters?.serviceType) count++;
    if (filters?.priceRange) count++;
    if (filters?.rating) count++;
    if (filters?.distance) count++;
    if (filters?.availability) count++;
    if (filters?.specialties?.length > 0) count++;
    return count;
  };

  // Handle search navigation
  const handleSearchFocus = () => {
    if (location.pathname !== '/search-and-filter-interface') {
      navigate('/search-and-filter-interface');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="md:hidden fixed inset-0 z-200 bg-black/50" onClick={onClose} />
      {/* Filter Panel */}
      <div className={`
        fixed z-200 bg-card border-border
        md:static md:w-80 md:border-r md:bg-card
        ${isOpen ? 'bottom-0 left-0 right-0 md:translate-x-0' : 'translate-y-full md:translate-x-0'}
        md:h-screen md:overflow-y-auto
        transition-transform duration-300 ease-out
        rounded-t-lg md:rounded-none
        shadow-modal md:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon name="Filter" size={20} className="text-primary" />
            <h2 className="font-heading font-semibold text-lg">
              {language === 'ar' ? 'تصفية النتائج' : 'Filtrer les résultats'}
            </h2>
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-data px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="md:hidden"
          />
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6 max-h-[70vh] md:max-h-none overflow-y-auto">
          {/* Search */}
          <div>
            <Input
              label={language === 'ar' ? 'البحث' : 'Recherche'}
              type="search"
              placeholder={language === 'ar' ? 'ابحث عن خدمات...' : 'Rechercher des services...'}
              value={filters?.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
              onFocus={handleSearchFocus}
            />
          </div>

          {/* Service Type */}
          <div>
            <Select
              label={language === 'ar' ? 'نوع الخدمة' : 'Type de service'}
              options={serviceTypes}
              value={filters?.serviceType}
              onChange={(value) => handleFilterChange('serviceType', value)}
              placeholder={language === 'ar' ? 'اختر نوع الخدمة' : 'Choisir le type'}
            />
          </div>

          {/* Price Range */}
          <div>
            <Select
              label={language === 'ar' ? 'نطاق السعر' : 'Gamme de prix'}
              options={priceRanges}
              value={filters?.priceRange}
              onChange={(value) => handleFilterChange('priceRange', value)}
              placeholder={language === 'ar' ? 'اختر النطاق السعري' : 'Choisir la gamme'}
            />
          </div>

          {/* Rating */}
          <div>
            <Select
              label={language === 'ar' ? 'التقييم' : 'Note'}
              options={ratingOptions}
              value={filters?.rating}
              onChange={(value) => handleFilterChange('rating', value)}
              placeholder={language === 'ar' ? 'الحد الأدنى للتقييم' : 'Note minimum'}
            />
          </div>

          {/* Distance */}
          <div>
            <Select
              label={language === 'ar' ? 'المسافة' : 'Distance'}
              options={distanceOptions}
              value={filters?.distance}
              onChange={(value) => handleFilterChange('distance', value)}
              placeholder={language === 'ar' ? 'المسافة القصوى' : 'Distance maximale'}
            />
          </div>

          {/* Availability */}
          <div>
            <Select
              label={language === 'ar' ? 'التوفر' : 'Disponibilité'}
              options={availabilityOptions}
              value={filters?.availability}
              onChange={(value) => handleFilterChange('availability', value)}
              placeholder={language === 'ar' ? 'متى تحتاج الخدمة؟' : 'Quand avez-vous besoin?'}
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              {language === 'ar' ? 'التخصصات' : 'Spécialités'}
            </label>
            <div className="space-y-2">
              {specialtyOptions?.map((specialty) => (
                <Checkbox
                  key={specialty?.value}
                  label={specialty?.label}
                  checked={filters?.specialties?.includes(specialty?.value)}
                  onChange={(e) => handleSpecialtyChange(specialty?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
            >
              {language === 'ar' ? 'مسح الكل' : 'Effacer tout'}
            </Button>
            <Button
              variant="default"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              {language === 'ar' ? 'تطبيق الفلاتر' : 'Appliquer les filtres'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterOverlay;