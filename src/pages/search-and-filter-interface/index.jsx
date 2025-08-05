import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Import all components
import SearchBar from './components/SearchBar';
import FilterSection from './components/FilterSection';
import ServiceTypeFilter from './components/ServiceTypeFilter';
import LocationTypeFilter from './components/LocationTypeFilter';
import PriceRangeFilter from './components/PriceRangeFilter';
import RatingFilter from './components/RatingFilter';
import AvailabilityFilter from './components/AvailabilityFilter';
import ActiveFiltersChips from './components/ActiveFiltersChips';
import ResultsCounter from './components/ResultsCounter';

const SearchAndFilterInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedServices: [],
    locationType: '',
    priceRange: [0, 500],
    selectedRating: '',
    selectedAvailability: ''
  });

  // Results state
  const [results, setResults] = useState({
    total: 234,
    filtered: 234
  });

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Load initial filters from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const savedFilters = localStorage.getItem('cleanfinder-filters');
    
    if (urlParams?.get('q')) {
      setFilters(prev => ({ ...prev, searchQuery: urlParams?.get('q') }));
    } else if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved filters:', error);
      }
    }
  }, [location.search]);

  // Simulate search results based on filters
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let filteredCount = 234;
      
      // Simulate filtering logic
      if (filters?.searchQuery) filteredCount = Math.max(12, filteredCount - 50);
      if (filters?.selectedServices?.length > 0) filteredCount = Math.max(8, Math.floor(filteredCount * 0.7));
      if (filters?.locationType) filteredCount = Math.floor(filteredCount * 0.6);
      if (filters?.selectedRating) filteredCount = Math.floor(filteredCount * 0.4);
      if (filters?.selectedAvailability === 'now') filteredCount = Math.max(3, Math.floor(filteredCount * 0.2));
      
      setResults({
        total: 234,
        filtered: filteredCount
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Save to localStorage
    localStorage.setItem('cleanfinder-filters', JSON.stringify(newFilters));
  };

  const handleSearch = (query) => {
    handleFilterChange('searchQuery', query);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion?.type === 'cleaner') {
      navigate('/cleaner-profile-detail');
    } else {
      handleFilterChange('searchQuery', suggestion?.text);
    }
  };

  const handleRemoveFilter = (key, value) => {
    handleFilterChange(key, value);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      selectedServices: [],
      locationType: '',
      priceRange: [0, 500],
      selectedRating: '',
      selectedAvailability: ''
    };
    setFilters(clearedFilters);
    localStorage.removeItem('cleanfinder-filters');
  };

  const handleApplyFilters = () => {
    setShowMobileFilters(false);
    // Navigate to results view
    navigate('/service-discovery-list-view');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.searchQuery) count++;
    if (filters?.selectedServices?.length > 0) count++;
    if (filters?.locationType) count++;
    if (filters?.selectedRating) count++;
    if (filters?.selectedAvailability) count++;
    if (filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 500) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        showViewToggle={false}
        onLanguageChange={handleLanguageChange}
      />
      <NavigationBreadcrumb 
        language={language}
        customActions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/service-discovery-map-view')}
            iconName="Map"
            iconPosition="left"
            iconSize={16}
          >
            {language === 'ar' ? 'عرض الخريطة' : 'Vue carte'}
          </Button>
        }
      />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-96 border-r border-border bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Search Bar */}
            <SearchBar
              value={filters?.searchQuery}
              onChange={(value) => handleFilterChange('searchQuery', value)}
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              language={language}
            />

            {/* Active Filters */}
            <ActiveFiltersChips
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
              language={language}
            />

            {/* Results Counter */}
            <ResultsCounter
              totalResults={results?.total}
              filteredResults={results?.filtered}
              isLoading={isLoading}
              language={language}
            />

            {/* Filter Sections */}
            <div className="space-y-0 border border-border rounded-lg overflow-hidden">
              <FilterSection
                title={language === 'ar' ? 'نوع الخدمة' : 'Type de service'}
                activeCount={filters?.selectedServices?.length}
                onClear={() => handleFilterChange('selectedServices', [])}
              >
                <ServiceTypeFilter
                  selectedServices={filters?.selectedServices}
                  onChange={(services) => handleFilterChange('selectedServices', services)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'نوع الموقع' : 'Type de lieu'}
                activeCount={filters?.locationType ? 1 : 0}
                onClear={() => handleFilterChange('locationType', '')}
              >
                <LocationTypeFilter
                  selectedType={filters?.locationType}
                  onChange={(type) => handleFilterChange('locationType', type)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'نطاق السعر' : 'Gamme de prix'}
                activeCount={filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 500 ? 1 : 0}
                onClear={() => handleFilterChange('priceRange', [0, 500])}
              >
                <PriceRangeFilter
                  value={filters?.priceRange}
                  onChange={(range) => handleFilterChange('priceRange', range)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'التقييم' : 'Note'}
                activeCount={filters?.selectedRating ? 1 : 0}
                onClear={() => handleFilterChange('selectedRating', '')}
              >
                <RatingFilter
                  selectedRating={filters?.selectedRating}
                  onChange={(rating) => handleFilterChange('selectedRating', rating)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'التوفر' : 'Disponibilité'}
                activeCount={filters?.selectedAvailability ? 1 : 0}
                onClear={() => handleFilterChange('selectedAvailability', '')}
              >
                <AvailabilityFilter
                  selectedAvailability={filters?.selectedAvailability}
                  onChange={(availability) => handleFilterChange('selectedAvailability', availability)}
                  language={language}
                />
              </FilterSection>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 rtl:space-x-reverse pt-4">
              <Button
                variant="outline"
                onClick={handleClearAllFilters}
                className="flex-1"
              >
                {language === 'ar' ? 'مسح الكل' : 'Effacer tout'}
              </Button>
              <Button
                variant="default"
                onClick={handleApplyFilters}
                className="flex-1"
              >
                {language === 'ar' ? 'عرض النتائج' : 'Voir les résultats'}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden flex-1">
          {/* Mobile Search Header */}
          <div className="p-4 bg-card border-b border-border">
            <SearchBar
              value={filters?.searchQuery}
              onChange={(value) => handleFilterChange('searchQuery', value)}
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              language={language}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <ResultsCounter
                totalResults={results?.total}
                filteredResults={results?.filtered}
                isLoading={isLoading}
                language={language}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                iconName="SlidersHorizontal"
                iconPosition="left"
                iconSize={16}
              >
                {language === 'ar' ? 'فلاتر' : 'Filtres'}
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 rtl:ml-0 rtl:mr-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </div>

            {/* Active Filters */}
            <ActiveFiltersChips
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
              language={language}
              className="mt-4"
            />
          </div>

          {/* Mobile Results Placeholder */}
          <div className="p-4 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              {language === 'ar' ? 'ابحث عن خدمات التنظيف' : 'Recherchez des services de nettoyage'}
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {language === 'ar' ?'استخدم شريط البحث والفلاتر للعثور على أفضل منظفي السيارات في منطقتك' :'Utilisez la barre de recherche et les filtres pour trouver les meilleurs nettoyeurs de voitures dans votre région'
              }
            </p>
            <Button
              variant="default"
              onClick={handleApplyFilters}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={16}
            >
              {language === 'ar' ? 'عرض النتائج' : 'Voir les résultats'}
            </Button>
          </div>
        </div>

        {/* Desktop Results Placeholder */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <div className="text-center max-w-md">
            <Icon name="Search" size={64} className="text-muted-foreground mx-auto mb-6" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
              {language === 'ar' ? 'ابحث وصفي النتائج' : 'Recherchez et filtrez'}
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              {language === 'ar' ?'استخدم الفلاتر على اليسار للعثور على خدمات التنظيف المثالية لسيارتك' :'Utilisez les filtres à gauche pour trouver les services de nettoyage parfaits pour votre voiture'
              }
            </p>
            <div className="flex space-x-3 rtl:space-x-reverse justify-center">
              <Button
                variant="outline"
                onClick={() => navigate('/service-discovery-list-view')}
                iconName="List"
                iconPosition="left"
                iconSize={16}
              >
                {language === 'ar' ? 'عرض القائمة' : 'Vue liste'}
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/service-discovery-map-view')}
                iconName="Map"
                iconPosition="left"
                iconSize={16}
              >
                {language === 'ar' ? 'عرض الخريطة' : 'Vue carte'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 z-200 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-200 bg-card rounded-t-lg shadow-modal max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon name="SlidersHorizontal" size={20} className="text-primary" />
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
                onClick={() => setShowMobileFilters(false)}
                iconName="X"
                iconSize={20}
              />
            </div>

            {/* Modal Content */}
            <div className="space-y-0 border-b border-border">
              <FilterSection
                title={language === 'ar' ? 'نوع الخدمة' : 'Type de service'}
                activeCount={filters?.selectedServices?.length}
                onClear={() => handleFilterChange('selectedServices', [])}
                isCollapsible={false}
              >
                <ServiceTypeFilter
                  selectedServices={filters?.selectedServices}
                  onChange={(services) => handleFilterChange('selectedServices', services)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'نوع الموقع' : 'Type de lieu'}
                activeCount={filters?.locationType ? 1 : 0}
                onClear={() => handleFilterChange('locationType', '')}
                isCollapsible={false}
              >
                <LocationTypeFilter
                  selectedType={filters?.locationType}
                  onChange={(type) => handleFilterChange('locationType', type)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'نطاق السعر' : 'Gamme de prix'}
                activeCount={filters?.priceRange?.[0] > 0 || filters?.priceRange?.[1] < 500 ? 1 : 0}
                onClear={() => handleFilterChange('priceRange', [0, 500])}
                isCollapsible={false}
              >
                <PriceRangeFilter
                  value={filters?.priceRange}
                  onChange={(range) => handleFilterChange('priceRange', range)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'التقييم' : 'Note'}
                activeCount={filters?.selectedRating ? 1 : 0}
                onClear={() => handleFilterChange('selectedRating', '')}
                isCollapsible={false}
              >
                <RatingFilter
                  selectedRating={filters?.selectedRating}
                  onChange={(rating) => handleFilterChange('selectedRating', rating)}
                  language={language}
                />
              </FilterSection>

              <FilterSection
                title={language === 'ar' ? 'التوفر' : 'Disponibilité'}
                activeCount={filters?.selectedAvailability ? 1 : 0}
                onClear={() => handleFilterChange('selectedAvailability', '')}
                isCollapsible={false}
              >
                <AvailabilityFilter
                  selectedAvailability={filters?.selectedAvailability}
                  onChange={(availability) => handleFilterChange('selectedAvailability', availability)}
                  language={language}
                />
              </FilterSection>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/50">
              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={handleClearAllFilters}
                  className="flex-1"
                >
                  {language === 'ar' ? 'مسح الكل' : 'Effacer tout'}
                </Button>
                <Button
                  variant="default"
                  onClick={handleApplyFilters}
                  className="flex-1"
                >
                  {language === 'ar' ? 'عرض النتائج' : 'Voir les résultats'} ({results?.filtered})
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchAndFilterInterface;