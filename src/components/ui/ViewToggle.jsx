import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';


const ViewToggle = ({ 
  currentView = 'map', 
  onViewChange = () => {},
  language = 'fr',
  className = '',
  variant = 'default' // 'default', 'floating', 'compact'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewChange = (view) => {
    onViewChange(view);
    if (view === 'map') {
      navigate('/service-discovery-map-view');
    } else {
      navigate('/service-discovery-list-view');
    }
  };

  const isDiscoveryPage = location.pathname === '/service-discovery-map-view' || 
                         location.pathname === '/service-discovery-list-view' ||
                         location.pathname === '/';

  if (!isDiscoveryPage) return null;

  // Floating variant for mobile map overlay
  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-20 right-4 z-50 ${className}`}>
        <div className="flex flex-col space-y-2 bg-card rounded-lg shadow-modal p-1">
          <Button
            variant={currentView === 'map' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleViewChange('map')}
            className="w-10 h-10 spring-animation"
          >
            <Icon name="Map" size={18} />
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleViewChange('list')}
            className="w-10 h-10 spring-animation"
          >
            <Icon name="List" size={18} />
          </Button>
        </div>
      </div>
    );
  }

  // Compact variant for tight spaces
  if (variant === 'compact') {
    return (
      <div className={`flex items-center ${className}`}>
        <Button
          variant={currentView === 'map' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleViewChange('map')}
          iconName="Map"
          iconSize={16}
          className="rounded-r-none"
        />
        <Button
          variant={currentView === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleViewChange('list')}
          iconName="List"
          iconSize={16}
          className="rounded-l-none border-l-0"
        />
      </div>
    );
  }

  // Default variant with labels
  return (
    <div className={`flex items-center bg-muted rounded-lg p-1 ${className}`}>
      <Button
        variant={currentView === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('map')}
        iconName="Map"
        iconPosition="left"
        iconSize={16}
        className="rounded-md smooth-transition"
      >
        {language === 'ar' ? 'خريطة' : 'Carte'}
      </Button>
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleViewChange('list')}
        iconName="List"
        iconPosition="left"
        iconSize={16}
        className="rounded-md smooth-transition"
      >
        {language === 'ar' ? 'قائمة' : 'Liste'}
      </Button>
    </div>
  );
};

export default ViewToggle;