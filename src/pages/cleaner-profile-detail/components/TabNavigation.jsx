import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, language, counts = {} }) => {
  const tabs = [
    {
      id: 'services',
      label: language === 'ar' ? 'الخدمات' : 'Services',
      icon: 'Wrench',
      count: counts?.services
    },
    {
      id: 'gallery',
      label: language === 'ar' ? 'المعرض' : 'Galerie',
      icon: 'Camera',
      count: counts?.photos
    },
    {
      id: 'reviews',
      label: language === 'ar' ? 'التقييمات' : 'Avis',
      icon: 'Star',
      count: counts?.reviews
    },
    {
      id: 'availability',
      label: language === 'ar' ? 'التوفر' : 'Disponibilité',
      icon: 'Calendar',
      count: null
    }
  ];

  return (
    <div className="bg-background border-b border-border sticky top-15 z-40">
      {/* Desktop Tab Navigation */}
      <div className="hidden md:block">
        <div className="px-4 lg:px-6">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(tab?.id)}
                iconName={tab?.icon}
                iconPosition="left"
                iconSize={16}
                className={`px-4 py-2 rounded-none border-b-2 ${
                  activeTab === tab?.id
                    ? 'border-primary bg-primary/5 text-primary' :'border-transparent hover:border-primary/30'
                }`}
              >
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span>{tab?.label}</span>
                  {tab?.count !== null && tab?.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-data ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tab?.count}
                    </span>
                  )}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Tab Navigation */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-3 border-b-2 smooth-transition ${
                activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon 
                name={tab?.icon} 
                size={20} 
                className={activeTab === tab?.id ? 'text-primary' : 'text-muted-foreground'} 
              />
              <span className="font-caption text-xs mt-1 whitespace-nowrap">
                {tab?.label}
              </span>
              {tab?.count !== null && tab?.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-data mt-1 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content Indicator */}
      <div className="px-4 lg:px-6 py-2 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Icon 
              name={tabs?.find(tab => tab?.id === activeTab)?.icon || 'Info'} 
              size={16} 
              className="text-primary" 
            />
            <span className="font-heading font-medium text-sm text-foreground">
              {tabs?.find(tab => tab?.id === activeTab)?.label}
            </span>
            {tabs?.find(tab => tab?.id === activeTab)?.count !== null && 
             tabs?.find(tab => tab?.id === activeTab)?.count !== undefined && (
              <span className="font-data text-sm text-muted-foreground">
                ({tabs?.find(tab => tab?.id === activeTab)?.count})
              </span>
            )}
          </div>

          {/* Quick Actions based on active tab */}
          {activeTab === 'services' && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Filter"
              iconSize={14}
              className="text-muted-foreground"
            >
              {language === 'ar' ? 'تصفية' : 'Filtrer'}
            </Button>
          )}

          {activeTab === 'gallery' && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Grid"
              iconSize={14}
              className="text-muted-foreground"
            >
              {language === 'ar' ? 'عرض الشبكة' : 'Vue grille'}
            </Button>
          )}

          {activeTab === 'reviews' && (
            <Button
              variant="ghost"
              size="sm"
              iconName="SortDesc"
              iconSize={14}
              className="text-muted-foreground"
            >
              {language === 'ar' ? 'ترتيب' : 'Trier'}
            </Button>
          )}

          {activeTab === 'availability' && (
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconSize={14}
              className="text-muted-foreground"
            >
              {language === 'ar' ? 'تحديث' : 'Actualiser'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;