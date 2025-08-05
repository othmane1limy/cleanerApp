import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ManualLocationEntry = ({ 
  language = 'fr', 
  onLocationSelected = () => {},
  onBack = () => {},
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  // Popular Moroccan cities with coordinates
  const popularCities = [
    { 
      name: 'Casablanca', 
      nameAr: 'الدار البيضاء',
      latitude: 33.5731, 
      longitude: -7.5898,
      region: 'Grand Casablanca-Settat'
    },
    { 
      name: 'Rabat', 
      nameAr: 'الرباط',
      latitude: 34.0209, 
      longitude: -6.8416,
      region: 'Rabat-Salé-Kénitra'
    },
    { 
      name: 'Marrakech', 
      nameAr: 'مراكش',
      latitude: 31.6295, 
      longitude: -7.9811,
      region: 'Marrakech-Safi'
    },
    { 
      name: 'Fès', 
      nameAr: 'فاس',
      latitude: 34.0181, 
      longitude: -5.0078,
      region: 'Fès-Meknès'
    },
    { 
      name: 'Tanger', 
      nameAr: 'طنجة',
      latitude: 35.7595, 
      longitude: -5.8340,
      region: 'Tanger-Tétouan-Al Hoceïma'
    },
    { 
      name: 'Agadir', 
      nameAr: 'أكادير',
      latitude: 30.4278, 
      longitude: -9.5981,
      region: 'Souss-Massa'
    }
  ];

  // Mock neighborhoods for major cities
  const neighborhoods = {
    'Casablanca': [
      { name: 'Maarif', nameAr: 'المعاريف', lat: 33.5731, lng: -7.5898 },
      { name: 'Ain Diab', nameAr: 'عين الذياب', lat: 33.5731, lng: -7.6298 },
      { name: 'Bourgogne', nameAr: 'بورغون', lat: 33.5931, lng: -7.5898 },
      { name: 'Gauthier', nameAr: 'غوتييه', lat: 33.5631, lng: -7.5698 }
    ],
    'Rabat': [
      { name: 'Agdal', nameAr: 'أكدال', lat: 34.0109, lng: -6.8316 },
      { name: 'Hassan', nameAr: 'حسان', lat: 34.0309, lng: -6.8516 },
      { name: 'Souissi', nameAr: 'السويسي', lat: 34.0009, lng: -6.8116 }
    ]
  };

  useEffect(() => {
    if (searchQuery?.length > 2) {
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = popularCities?.filter(city => 
          city?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          city?.nameAr?.includes(searchQuery)
        );
        
        // Add neighborhoods if searching within a city
        const cityNeighborhoods = [];
        Object.keys(neighborhoods)?.forEach(cityName => {
          if (cityName?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
            cityNeighborhoods?.push(...neighborhoods?.[cityName]?.map(n => ({
              ...n,
              city: cityName,
              isNeighborhood: true
            })));
          }
        });
        
        setSuggestions([...filtered, ...cityNeighborhoods]);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    const locationData = {
      latitude: location.latitude || location.lat,
      longitude: location.longitude || location.lng,
      city: location.city || location.name,
      name: language === 'ar' ? location.nameAr : location.name,
      method: 'manual',
      timestamp: Date.now()
    };

    localStorage.setItem('cleanfinder-location', JSON.stringify(locationData));
    
    setSelectedLocation(locationData);
    onLocationSelected(locationData);
    
    // Navigate to map view
    setTimeout(() => {
      navigate('/service-discovery-map-view');
    }, 500);
  };

  const handleQuickSelect = (city) => {
    handleLocationSelect(city);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Back Button */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          iconName="ArrowLeft"
          iconSize={20}
          className="text-muted-foreground hover:text-foreground rtl:rotate-180"
        />
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {language === 'ar' ? 'اختر موقعك' : 'Choisissez votre localisation'}
        </h3>
      </div>
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder={language === 'ar' ? 'ابحث عن مدينة أو حي...' : 'Rechercher une ville ou un quartier...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="pr-10 rtl:pr-4 rtl:pl-10"
        />
        <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2">
          {isSearching ? (
            <Icon name="Loader2" size={20} className="text-muted-foreground animate-spin" />
          ) : (
            <Icon name="Search" size={20} className="text-muted-foreground" />
          )}
        </div>
      </div>
      {/* Search Suggestions */}
      {suggestions?.length > 0 && (
        <div className="bg-card border border-border rounded-lg shadow-subtle max-h-60 overflow-y-auto">
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(suggestion)}
              className="w-full flex items-center space-x-3 rtl:space-x-reverse p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={suggestion?.isNeighborhood ? "Home" : "MapPin"} 
                  size={16} 
                  className="text-primary" 
                />
              </div>
              <div className="flex-1 text-left rtl:text-right">
                <p className="font-heading font-medium text-foreground">
                  {language === 'ar' ? suggestion?.nameAr : suggestion?.name}
                </p>
                {suggestion?.isNeighborhood && (
                  <p className="font-body text-sm text-muted-foreground">
                    {suggestion?.city}
                  </p>
                )}
                {suggestion?.region && (
                  <p className="font-body text-sm text-muted-foreground">
                    {suggestion?.region}
                  </p>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground rtl:rotate-180" />
            </button>
          ))}
        </div>
      )}
      {/* Popular Cities */}
      {searchQuery?.length === 0 && (
        <div>
          <h4 className="font-heading font-medium text-foreground mb-4">
            {language === 'ar' ? 'المدن الشائعة' : 'Villes populaires'}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {popularCities?.map((city, index) => (
              <button
                key={index}
                onClick={() => handleQuickSelect(city)}
                className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="MapPin" size={20} className="text-accent" />
                </div>
                <div className="flex-1 text-left rtl:text-right">
                  <p className="font-heading font-medium text-foreground text-sm">
                    {language === 'ar' ? city?.nameAr : city?.name}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {city?.region}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm text-foreground">
              {language === 'ar' ?'اختر موقعك لنعرض لك أفضل خدمات تنظيف السيارات القريبة منك.' :'Choisissez votre localisation pour afficher les meilleurs services de nettoyage automobile près de chez vous.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualLocationEntry;