import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapContainer = ({ 
  cleaners = [], 
  userLocation = null, 
  selectedCleaner = null, 
  onCleanerSelect = () => {},
  onLocationChange = () => {},
  language = 'fr',
  filters = {}
}) => {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.5731, lng: -7.5898 }); // Casablanca default
  const [zoom, setZoom] = useState(12);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Mock map implementation with interactive markers
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(14);
    }
  }, [userLocation]);

  const handleMarkerClick = (cleaner) => {
    onCleanerSelect(cleaner);
  };

  const handleMapClick = (event) => {
    const rect = event.currentTarget?.getBoundingClientRect();
    const x = event.clientX - rect?.left;
    const y = event.clientY - rect?.top;
    
    // Convert click position to approximate coordinates (mock)
    const lat = mapCenter?.lat + (0.01 * (rect?.height / 2 - y) / (rect?.height / 2));
    const lng = mapCenter?.lng + (0.01 * (x - rect?.width / 2) / (rect?.width / 2));
    
    onLocationChange({ lat, lng });
  };

  const getMarkerPosition = (cleaner, index) => {
    // Calculate marker position based on cleaner location and map bounds
    const baseX = 20 + (index % 5) * 15;
    const baseY = 20 + Math.floor(index / 5) * 15;
    return {
      left: `${baseX + (cleaner?.location?.lng - mapCenter?.lng) * 1000 + 50}%`,
      top: `${baseY + (mapCenter?.lat - cleaner?.location?.lat) * 1000 + 50}%`
    };
  };

  const getMarkerColor = (cleaner) => {
    if (!cleaner?.isOnline) return 'bg-gray-400';
    switch (cleaner?.serviceType) {
      case 'mobile': return 'bg-blue-500';
      case 'garage': return 'bg-green-500';
      case 'premium': return 'bg-purple-500';
      default: return 'bg-primary';
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Map Loading State */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'تحميل الخريطة...' : 'Chargement de la carte...'}
            </p>
          </div>
        </div>
      )}
      {/* Interactive Map Area */}
      <div 
        ref={mapRef}
        className="w-full h-full cursor-crosshair relative"
        onClick={handleMapClick}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: '#f8fafc'
        }}
      >
        {/* User Location Marker */}
        {userLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg">
              <div className="w-8 h-8 bg-blue-600/20 rounded-full absolute -top-2 -left-2 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Cleaner Markers */}
        {isMapLoaded && cleaners?.map((cleaner, index) => {
          const position = getMarkerPosition(cleaner, index);
          const isSelected = selectedCleaner?.id === cleaner?.id;
          
          return (
            <div
              key={cleaner?.id}
              className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10 transition-all duration-200 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
              style={position}
              onClick={(e) => {
                e?.stopPropagation();
                handleMarkerClick(cleaner);
              }}
            >
              {/* Marker Pin */}
              <div className={`w-8 h-8 ${getMarkerColor(cleaner)} rounded-full border-2 border-white shadow-lg flex items-center justify-center relative`}>
                <Icon 
                  name={cleaner?.serviceType === 'mobile' ? 'Car' : 'Building'} 
                  size={16} 
                  color="white" 
                />
                
                {/* Online Status Indicator */}
                {cleaner?.isOnline && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                )}
                
                {/* Price Badge */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded px-1 py-0.5 shadow-md border">
                  <span className="text-xs font-data text-foreground whitespace-nowrap">
                    {cleaner?.startingPrice} MAD
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-40">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
            className="bg-white shadow-lg"
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(prev => Math.max(prev - 1, 8))}
            className="bg-white shadow-lg"
          >
            <Icon name="Minus" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (userLocation) {
                setMapCenter(userLocation);
                setZoom(14);
              }
            }}
            className="bg-white shadow-lg"
            disabled={!userLocation}
          >
            <Icon name="Navigation" size={16} />
          </Button>
        </div>

        {/* Distance Scale */}
        <div className="absolute bottom-4 left-4 bg-white rounded px-2 py-1 shadow-md border z-40">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-0.5 bg-foreground"></div>
            <span className="text-xs font-data text-foreground">1 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;