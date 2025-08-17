import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalHeader = ({ 
  showViewToggle = true, 
  currentLocation = null, 
  onLanguageChange = () => {},
  onViewChange = () => {},
  currentView = 'map'
}) => {
  const [language, setLanguage] = useState('fr');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    onLanguageChange(savedLanguage);
  }, [onLanguageChange]);

  const handleLanguageToggle = () => {
    const newLanguage = language === 'fr' ? 'ar' : 'fr';
    setLanguage(newLanguage);
    localStorage.setItem('cleanfinder-language', newLanguage);
    onLanguageChange(newLanguage);
    
    // Update document direction for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const handleViewToggle = (view) => {
    onViewChange(view);
    if (view === 'map') {
      navigate('/service-discovery-map-view');
    } else {
      navigate('/service-discovery-list-view');
    }
  };

  const handleLocationRefresh = () => {
    setIsLocationLoading(true);
    // Simulate location refresh
    setTimeout(() => {
      setIsLocationLoading(false);
    }, 1500);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getLocationText = () => {
    if (isLocationLoading) {
      return language === 'ar' ? 'جاري تحديد الموقع...' : 'Localisation...';
    }
    if (currentLocation) {
      return currentLocation;
    }
    return language === 'ar' ? 'المغرب' : 'Maroc';
  };

  const isDiscoveryPage = location.pathname === '/service-discovery-map-view' || 
                         location.pathname === '/service-discovery-list-view' ||
                         location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border">
      <div className="flex items-center justify-between h-15 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <div className="ml-2 rtl:ml-0 rtl:mr-2">
              <h1 className="font-heading font-bold text-lg text-foreground leading-none">
                CleanFinder
              </h1>
              <p className="font-caption text-xs text-muted-foreground leading-none">
                {language === 'ar' ? 'المغرب' : 'Morocco'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation - View Toggle */}
        {showViewToggle && isDiscoveryPage && (
          <div className="hidden md:flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={currentView === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewToggle('map')}
              iconName="Map"
              iconPosition="left"
              iconSize={16}
              className="rounded-md"
            >
              {language === 'ar' ? 'خريطة' : 'Carte'}
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewToggle('list')}
              iconName="List"
              iconPosition="left"
              iconSize={16}
              className="rounded-md"
            >
              {language === 'ar' ? 'قائمة' : 'Liste'}
            </Button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Location Indicator */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLocationRefresh}
            disabled={isLocationLoading}
            iconName={isLocationLoading ? "Loader2" : "MapPin"}
            iconPosition="left"
            iconSize={16}
            className={`text-muted-foreground hover:text-foreground ${isLocationLoading ? 'animate-spin' : ''}`}
          >
            <span className="hidden sm:inline font-caption text-sm">
              {getLocationText()}
            </span>
          </Button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageToggle}
            className="min-w-[3rem] font-data text-sm"
          >
            {language === 'ar' ? 'FR' : 'ع'}
          </Button>

          {/* Mobile View Toggle */}
          {showViewToggle && isDiscoveryPage && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewToggle(currentView === 'map' ? 'list' : 'map')}
                iconName={currentView === 'map' ? 'List' : 'Map'}
                iconSize={20}
              />
            </div>
          )}

          {/* Search Access */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search-and-filter-interface')}
            iconName="Search"
            iconSize={20}
            className="text-muted-foreground hover:text-foreground"
          />

          {/* Authentication Section */}
          {user ? (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (user.user_metadata?.user_type === 'cleaner') {
                    navigate('/cleaner-dashboard');
                  } else {
                    navigate('/client-profile');
                  }
                }}
                iconName="User"
                iconPosition="left"
                iconSize={16}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="hidden sm:inline ml-2">
                  {user.user_metadata?.user_type === 'cleaner' ? 'Dashboard' : 'Profile'}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="hidden sm:inline">Déconnexion</span>
                <Icon name="LogOut" size={16} className="sm:hidden" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="hidden sm:inline">Connexion</span>
                <Icon name="LogIn" size={16} className="sm:hidden" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/register')}
              >
                <span className="hidden sm:inline">S'inscrire</span>
                <Icon name="UserPlus" size={16} className="sm:hidden" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View Toggle Bar */}
      {showViewToggle && isDiscoveryPage && (
        <div className="md:hidden border-t border-border bg-muted/50">
          <div className="flex items-center justify-center p-2">
            <div className="flex items-center bg-background rounded-lg p-1 shadow-subtle">
              <Button
                variant={currentView === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewToggle('map')}
                iconName="Map"
                iconPosition="left"
                iconSize={16}
                className="rounded-md text-xs"
              >
                {language === 'ar' ? 'خريطة' : 'Carte'}
              </Button>
              <Button
                variant={currentView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewToggle('list')}
                iconName="List"
                iconPosition="left"
                iconSize={16}
                className="rounded-md text-xs"
              >
                {language === 'ar' ? 'قائمة' : 'Liste'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;