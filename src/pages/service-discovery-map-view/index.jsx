import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import FilterOverlay from '../../components/ui/FilterOverlay';
import MapContainer from './components/MapContainer';
import CleanerInfoCard from './components/CleanerInfoCard';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import FloatingActionButton from './components/FloatingActionButton';
import LocationPermissionModal from './components/LocationPermissionModal';

const ServiceDiscoveryMapView = () => {
  const [language, setLanguage] = useState('fr');
  const [userLocation, setUserLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // Mock cleaners data
  const mockCleaners = [
    {
      id: 1,
      name: "Ahmed Benali",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      reviewCount: 127,
      distance: "0.8 km",
      startingPrice: 45,
      isOnline: true,
      serviceType: "mobile",
      nextAvailable: "15:30",
      responseTime: 12,
      memberSince: "2022",
      phone: "+212661234567",
      whatsapp: "212661234567",
      location: { lat: 33.5731, lng: -7.5898 },
      services: [
        { name: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur', price: 45 },
        { name: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur', price: 65 },
        { name: language === 'ar' ? 'خدمة شاملة' : 'Service complet', price: 95 },
        { name: language === 'ar' ? 'تشميع' : 'Cirage', price: 120 },
        { name: language === 'ar' ? 'تنظيف المحرك' : 'Nettoyage moteur', price: 80 }
      ]
    },
    {
      id: 2,
      name: "Youssef Alami",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      reviewCount: 89,
      distance: "1.2 km",
      startingPrice: 50,
      isOnline: false,
      serviceType: "garage",
      nextAvailable: "16:00",
      responseTime: 8,
      memberSince: "2021",
      phone: "+212662345678",
      whatsapp: "212662345678",
      location: { lat: 33.5831, lng: -7.5798 },
      services: [
        { name: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur', price: 50 },
        { name: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur', price: 70 },
        { name: language === 'ar' ? 'تفصيل متقدم' : 'Détailing avancé', price: 150 }
      ]
    },
    {
      id: 3,
      name: "Fatima Zahra",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      reviewCount: 156,
      distance: "2.1 km",
      startingPrice: 60,
      isOnline: true,
      serviceType: "premium",
      nextAvailable: "14:45",
      responseTime: 5,
      memberSince: "2020",
      phone: "+212663456789",
      whatsapp: "212663456789",
      location: { lat: 33.5631, lng: -7.5998 },
      services: [
        { name: language === 'ar' ? 'خدمة مميزة' : 'Service premium', price: 120 },
        { name: language === 'ar' ? 'تنظيف بيئي' : 'Nettoyage écologique', price: 85 },
        { name: language === 'ar' ? 'حماية الطلاء' : 'Protection peinture', price: 200 }
      ]
    },
    {
      id: 4,
      name: "Omar Tazi",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      reviewCount: 203,
      distance: "1.8 km",
      startingPrice: 40,
      isOnline: true,
      serviceType: "mobile",
      nextAvailable: "15:15",
      responseTime: 15,
      memberSince: "2023",
      phone: "+212664567890",
      whatsapp: "212664567890",
      location: { lat: 33.5931, lng: -7.5698 },
      services: [
        { name: language === 'ar' ? 'غسيل سريع' : 'Lavage rapide', price: 40 },
        { name: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur', price: 60 },
        { name: language === 'ar' ? 'خدمة شاملة' : 'Service complet', price: 90 }
      ]
    },
    {
      id: 5,
      name: "Rachid Bennani",
      profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      rating: 4.5,
      reviewCount: 74,
      distance: "3.2 km",
      startingPrice: 55,
      isOnline: false,
      serviceType: "garage",
      nextAvailable: "17:30",
      responseTime: 20,
      memberSince: "2022",
      phone: "+212665678901",
      whatsapp: "212665678901",
      location: { lat: 33.5531, lng: -7.6098 },
      services: [
        { name: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur', price: 55 },
        { name: language === 'ar' ? 'تنظيف المقاعد' : 'Nettoyage sièges', price: 75 },
        { name: language === 'ar' ? 'تشميع' : 'Cirage', price: 110 }
      ]
    }
  ];

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Check for existing location permission
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' })?.then((result) => {
        if (result?.state === 'granted') {
          setHasLocationPermission(true);
          requestLocation();
        } else if (result?.state === 'prompt') {
          setShowLocationModal(true);
        }
      });
    }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocationLoading(true);
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude
        });
        setHasLocationPermission(true);
        setIsLocationLoading(false);
        setShowLocationModal(false);
      },
      (error) => {
        console.error('Location error:', error);
        setIsLocationLoading(false);
        setHasLocationPermission(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLocationAllow = () => {
    requestLocation();
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
    setHasLocationPermission(false);
    // Set default location to Casablanca
    setUserLocation({ lat: 33.5731, lng: -7.5898 });
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setIsFilterOpen(false);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...activeFilters };
    if (filterKey?.startsWith('specialty-')) {
      const specialty = filterKey?.replace('specialty-', '');
      newFilters.specialties = newFilters?.specialties?.filter(s => s !== specialty) || [];
    } else {
      delete newFilters?.[filterKey];
    }
    setActiveFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.keys(activeFilters)?.forEach(key => {
      if (key === 'specialties') {
        count += activeFilters?.[key]?.length || 0;
      } else if (activeFilters?.[key]) {
        count++;
      }
    });
    return count;
  };

  const filteredCleaners = mockCleaners?.filter(cleaner => {
    // Apply filters logic here
    if (activeFilters?.serviceType && cleaner?.serviceType !== activeFilters?.serviceType) {
      return false;
    }
    if (activeFilters?.rating) {
      const minRating = parseFloat(activeFilters?.rating?.replace('+', ''));
      if (cleaner?.rating < minRating) return false;
    }
    // Add more filter logic as needed
    return true;
  });

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Global Header */}
      <GlobalHeader
        showViewToggle={true}
        currentView="map"
        onLanguageChange={handleLanguageChange}
        currentLocation={language === 'ar' ? 'المغرب' : 'Maroc'}
      />
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Map Container */}
        <MapContainer
          cleaners={filteredCleaners}
          userLocation={userLocation}
          selectedCleaner={selectedCleaner}
          onCleanerSelect={setSelectedCleaner}
          onLocationChange={setUserLocation}
          language={language}
          filters={activeFilters}
        />

        {/* Search Bar */}
        <SearchBar
          onLocationRequest={requestLocation}
          onFilterToggle={() => setIsFilterOpen(true)}
          language={language}
          hasLocationPermission={hasLocationPermission}
          isLocationLoading={isLocationLoading}
          activeFiltersCount={getActiveFilterCount()}
        />

        {/* Filter Chips */}
        <FilterChips
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
          language={language}
        />

        {/* Floating Action Button */}
        <FloatingActionButton
          language={language}
          cleanersCount={filteredCleaners?.length}
        />

        {/* Cleaner Info Card */}
        <CleanerInfoCard
          cleaner={selectedCleaner}
          onClose={() => setSelectedCleaner(null)}
          language={language}
          userLocation={userLocation}
        />

        {/* Filter Overlay */}
        <FilterOverlay
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          language={language}
          initialFilters={activeFilters}
        />

        {/* Location Permission Modal */}
        <LocationPermissionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onAllow={handleLocationAllow}
          onDeny={handleLocationDeny}
          language={language}
        />
      </div>
    </div>
  );
};

export default ServiceDiscoveryMapView;