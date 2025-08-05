import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import FilterOverlay from '../../components/ui/FilterOverlay';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CleanerCard from './components/CleanerCard';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';
import PullToRefresh from './components/PullToRefresh';

const ServiceDiscoveryListView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [language, setLanguage] = useState('fr');
  const [cleaners, setCleaners] = useState([]);
  const [filteredCleaners, setFilteredCleaners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('distance');
  const [hasError, setHasError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    searchQuery: '',
    serviceType: '',
    priceRange: '',
    rating: '',
    distance: '',
    availability: '',
    specialties: []
  });

  // Mock data for cleaners
  const mockCleaners = [
    {
      id: 1,
      name: "Ahmed Benali",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 127,
      distance: 0.8,
      isOnline: true,
      isMobile: true,
      hasGarage: false,
      startingPrice: 45,
      isPromoted: true,
      services: ["Lavage extérieur", "Nettoyage intérieur", "Cire", "Aspirateur"],
      specialties: ["eco", "mobile"],
      availability: "now"
    },
    {
      id: 2,
      name: "Fatima Zahra",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 203,
      distance: 1.2,
      isOnline: true,
      isMobile: false,
      hasGarage: true,
      startingPrice: 35,
      isPromoted: false,
      services: ["Service complet", "Détailing", "Protection céramique"],
      specialties: ["luxury", "express"],
      availability: "today"
    },
    {
      id: 3,
      name: "Youssef Alami",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      reviewCount: 89,
      distance: 2.1,
      isOnline: false,
      isMobile: true,
      hasGarage: true,
      startingPrice: 55,
      isPromoted: false,
      services: ["Lavage premium", "Nettoyage moteur", "Polissage"],
      specialties: ["mobile", "luxury"],
      availability: "tomorrow"
    },
    {
      id: 4,
      name: "Khadija Mansouri",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviewCount: 156,
      distance: 1.8,
      isOnline: true,
      isMobile: true,
      hasGarage: false,
      startingPrice: 40,
      isPromoted: true,
      services: ["Éco-lavage", "Nettoyage bio", "Service rapide"],
      specialties: ["eco", "express"],
      availability: "now"
    },
    {
      id: 5,
      name: "Omar Benjelloun",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 4.5,
      reviewCount: 74,
      distance: 3.2,
      isOnline: true,
      isMobile: false,
      hasGarage: true,
      startingPrice: 65,
      isPromoted: false,
      services: ["Détailing complet", "Restauration peinture", "Protection"],
      specialties: ["luxury"],
      availability: "week"
    },
    {
      id: 6,
      name: "Aicha Idrissi",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 198,
      distance: 1.5,
      isOnline: true,
      isMobile: true,
      hasGarage: true,
      startingPrice: 50,
      isPromoted: false,
      services: ["Service mobile", "Nettoyage intérieur", "Désinfection"],
      specialties: ["mobile", "eco"],
      availability: "today"
    }
  ];

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Initialize data
  useEffect(() => {
    loadCleaners();
    getUserLocation();
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [cleaners, activeFilters, currentSort]);

  const loadCleaners = async (isRefresh = false) => {
    try {
      setIsLoading(isRefresh ? false : true);
      setHasError(false);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCleaners(mockCleaners);
      setHasMoreData(false); // No pagination in mock data
    } catch (error) {
      console.error('Error loading cleaners:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location (Casablanca)
          setUserLocation({
            lat: 33.5731,
            lng: -7.5898
          });
        }
      );
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...cleaners];

    // Apply filters
    if (activeFilters?.searchQuery) {
      const query = activeFilters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(cleaner => 
        cleaner?.name?.toLowerCase()?.includes(query) ||
        cleaner?.services?.some(service => service?.toLowerCase()?.includes(query))
      );
    }

    if (activeFilters?.serviceType) {
      filtered = filtered?.filter(cleaner => {
        const serviceMap = {
          exterior: ['Lavage extérieur'],
          interior: ['Nettoyage intérieur'],
          complete: ['Service complet'],
          detailing: ['Détailing']
        };
        return cleaner?.services?.some(service => 
          serviceMap?.[activeFilters?.serviceType]?.some(s => service?.includes(s))
        );
      });
    }

    if (activeFilters?.priceRange) {
      const [min, max] = activeFilters?.priceRange?.split('-')?.map(p => 
        p?.includes('+') ? Infinity : parseInt(p)
      );
      filtered = filtered?.filter(cleaner => 
        cleaner?.startingPrice >= min && (max === Infinity || cleaner?.startingPrice <= max)
      );
    }

    if (activeFilters?.rating) {
      const minRating = parseFloat(activeFilters?.rating?.replace('+', ''));
      filtered = filtered?.filter(cleaner => cleaner?.rating >= minRating);
    }

    if (activeFilters?.distance) {
      const maxDistance = parseFloat(activeFilters?.distance);
      filtered = filtered?.filter(cleaner => cleaner?.distance <= maxDistance);
    }

    if (activeFilters?.availability) {
      filtered = filtered?.filter(cleaner => cleaner?.availability === activeFilters?.availability);
    }

    if (activeFilters?.specialties?.length > 0) {
      filtered = filtered?.filter(cleaner => 
        activeFilters?.specialties?.some(specialty => cleaner?.specialties?.includes(specialty))
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (currentSort) {
        case 'distance':
          return a?.distance - b?.distance;
        case 'rating':
          return b?.rating - a?.rating;
        case 'price_low':
          return a?.startingPrice - b?.startingPrice;
        case 'price_high':
          return b?.startingPrice - a?.startingPrice;
        case 'availability':
          const availabilityOrder = { now: 0, today: 1, tomorrow: 2, week: 3 };
          return (availabilityOrder?.[a?.availability] || 4) - (availabilityOrder?.[b?.availability] || 4);
        default:
          return 0;
      }
    });

    setFilteredCleaners(filtered);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const handleViewChange = (view) => {
    if (view === 'map') {
      navigate('/service-discovery-map-view');
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (filterKey) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: filterKey === 'specialties' ? [] : ''
    }));
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      serviceType: '',
      priceRange: '',
      rating: '',
      distance: '',
      availability: '',
      specialties: []
    };
    setActiveFilters(clearedFilters);
  };

  const handleRefresh = useCallback(async () => {
    await loadCleaners(true);
  }, []);

  const handleRetry = () => {
    setHasError(false);
    loadCleaners();
  };

  const handleViewProfile = (cleaner) => {
    navigate('/cleaner-profile-detail', { state: { cleaner } });
  };

  const getEmptyStateType = () => {
    if (hasError) return 'error';
    if (!userLocation) return 'no_location';
    return 'no_results';
  };

  const hasActiveFilters = Object.values(activeFilters)?.some(value => 
    value && value !== '' && !(Array.isArray(value) && value?.length === 0)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader
        showViewToggle={true}
        currentLocation={language === 'ar' ? 'المغرب' : 'Maroc'}
        onLanguageChange={handleLanguageChange}
        onViewChange={handleViewChange}
        currentView="list"
      />
      {/* Main Content */}
      <div className="pt-15 md:pt-15">
        {/* Filter Chips */}
        {hasActiveFilters && (
          <FilterChips
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
            language={language}
          />
        )}

        {/* Controls Bar */}
        <div className="bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Results Count */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-medium text-sm text-foreground">
                {isLoading ? (
                  language === 'ar' ? 'جاري البحث...' : 'Recherche...'
                ) : (
                  `${filteredCleaners?.length} ${language === 'ar' ? 'منظف' : 'nettoyeurs'}`
                )}
              </span>
              {userLocation && (
                <span className="text-xs text-muted-foreground">
                  • {language === 'ar' ? 'بالقرب منك' : 'près de vous'}
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <SortDropdown
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                language={language}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                iconName="Filter"
                iconPosition="left"
                iconSize={16}
              >
                {language === 'ar' ? 'فلتر' : 'Filtrer'}
                {hasActiveFilters && (
                  <span className="ml-1 rtl:ml-0 rtl:mr-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {Object.values(activeFilters)?.filter(value => 
                      value && value !== '' && !(Array.isArray(value) && value?.length === 0)
                    )?.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <PullToRefresh onRefresh={handleRefresh} language={language}>
            <div className="p-4">
              {isLoading ? (
                <LoadingSkeleton count={6} />
              ) : filteredCleaners?.length === 0 ? (
                <EmptyState
                  type={getEmptyStateType()}
                  onRetry={handleRetry}
                  onClearFilters={handleClearAllFilters}
                  language={language}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCleaners?.map((cleaner) => (
                    <CleanerCard
                      key={cleaner?.id}
                      cleaner={cleaner}
                      language={language}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {!isLoading && filteredCleaners?.length > 0 && hasMoreData && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {/* Load more logic */}}
                    loading={isLoadingMore}
                    disabled={isLoadingMore}
                  >
                    {language === 'ar' ? 'تحميل المزيد' : 'Charger plus'}
                  </Button>
                </div>
              )}
            </div>
          </PullToRefresh>
        </div>
      </div>
      {/* Filter Overlay */}
      <FilterOverlay
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        language={language}
        initialFilters={activeFilters}
      />
      {/* Floating Action Button - Mobile Only */}
      <div className="md:hidden fixed bottom-20 right-4 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={() => navigate('/service-discovery-map-view')}
          className="w-12 h-12 rounded-full shadow-modal"
        >
          <Icon name="Map" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ServiceDiscoveryListView;