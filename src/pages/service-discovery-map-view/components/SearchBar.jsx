import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchBar = ({ 
  onLocationRequest = () => {},
  onFilterToggle = () => {},
  language = 'fr',
  hasLocationPermission = false,
  isLocationLoading = false,
  activeFiltersCount = 0
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFocus = () => {
    navigate('/search-and-filter-interface');
  };

  const handleLocationClick = () => {
    if (!hasLocationPermission) {
      navigate('/location-permission-handler');
    } else {
      onLocationRequest();
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-40">
      <div className="bg-card rounded-lg shadow-modal border border-border p-3">
        {/* Main Search Row */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Location Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationClick}
            disabled={isLocationLoading}
            className="flex-shrink-0"
          >
            <Icon 
              name={isLocationLoading ? "Loader2" : hasLocationPermission ? "Navigation" : "MapPin"} 
              size={16} 
              className={isLocationLoading ? "animate-spin" : ""}
            />
          </Button>

          {/* Search Input */}
          <div className="flex-1">
            <Input
              type="search"
              placeholder={language === 'ar' ? 'ابحث عن خدمات التنظيف...' : 'Rechercher des services de nettoyage...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              onFocus={handleSearchFocus}
              className="border-0 bg-muted focus:bg-background"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onFilterToggle}
            className="flex-shrink-0 relative"
          >
            <Icon name="SlidersHorizontal" size={16} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-data w-5 h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-3 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-xs"
          >
            <Icon name="Car" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
            {language === 'ar' ? 'متنقل' : 'Mobile'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-xs"
          >
            <Icon name="Building" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
            {language === 'ar' ? 'كراج' : 'Garage'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-xs"
          >
            <Icon name="Clock" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
            {language === 'ar' ? 'متاح الآن' : 'Disponible'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 text-xs"
          >
            <Icon name="Star" size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
            4.5+
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;