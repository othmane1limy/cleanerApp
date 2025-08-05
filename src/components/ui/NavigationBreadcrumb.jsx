import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const NavigationBreadcrumb = ({ 
  language = 'fr',
  customTitle = null,
  customActions = null,
  showBackButton = true
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/service-discovery-map-view': case'/':
        return {
          title: language === 'ar' ? 'عرض الخريطة' : 'Vue carte',
          subtitle: language === 'ar' ? 'اعثر على خدمات التنظيف القريبة' : 'Trouvez des services de nettoyage à proximité',
          showBack: false,
          icon: 'Map'
        };
      case '/service-discovery-list-view':
        return {
          title: language === 'ar' ? 'عرض القائمة' : 'Vue liste',
          subtitle: language === 'ar' ? 'تصفح جميع الخدمات المتاحة' : 'Parcourir tous les services disponibles',
          showBack: false,
          icon: 'List'
        };
      case '/cleaner-profile-detail':
        return {
          title: language === 'ar' ? 'تفاصيل المنظف' : 'Profil du nettoyeur',
          subtitle: language === 'ar' ? 'معلومات مفصلة والحجز' : 'Informations détaillées et réservation',
          showBack: true,
          icon: 'User',
          backPath: '/service-discovery-map-view'
        };
      case '/location-permission-handler':
        return {
          title: language === 'ar' ? 'إذن الموقع' : 'Autorisation de localisation',
          subtitle: language === 'ar' ? 'نحتاج إلى موقعك لإظهار الخدمات القريبة' : 'Nous avons besoin de votre localisation pour afficher les services à proximité',
          showBack: false,
          icon: 'MapPin'
        };
      case '/search-and-filter-interface':
        return {
          title: language === 'ar' ? 'البحث والتصفية' : 'Recherche et filtres',
          subtitle: language === 'ar' ? 'ابحث وصفي النتائج' : 'Recherchez et filtrez les résultats',
          showBack: true,
          icon: 'Search',
          backPath: '/service-discovery-map-view'
        };
      default:
        return {
          title: language === 'ar' ? 'CleanFinder' : 'CleanFinder',
          subtitle: language === 'ar' ? 'خدمات تنظيف السيارات' : 'Services de nettoyage automobile',
          showBack: false,
          icon: 'Sparkles'
        };
    }
  };

  const pageInfo = getPageInfo();
  const shouldShowBack = showBackButton && pageInfo?.showBack;

  const handleBack = () => {
    if (pageInfo?.backPath) {
      navigate(pageInfo?.backPath);
    } else {
      navigate(-1);
    }
  };

  // Don't render on main discovery pages (they handle their own context)
  if (location.pathname === '/service-discovery-map-view' || 
      location.pathname === '/service-discovery-list-view' ||
      location.pathname === '/') {
    return null;
  }

  return (
    <div className="bg-background border-b border-border">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Back Button and Title */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {shouldShowBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                iconName="ArrowLeft"
                iconSize={20}
                className="text-muted-foreground hover:text-foreground rtl:rotate-180"
              />
            )}
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={pageInfo?.icon} size={18} className="text-primary" />
              </div>
              
              <div>
                <h1 className="font-heading font-semibold text-lg text-foreground leading-none">
                  {customTitle || pageInfo?.title}
                </h1>
                <p className="font-body text-sm text-muted-foreground leading-none mt-1">
                  {pageInfo?.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Custom Actions */}
          {customActions && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {customActions}
            </div>
          )}
        </div>

        {/* Context Actions for Specific Pages */}
        {location.pathname === '/cleaner-profile-detail' && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4">
            <Button
              variant="outline"
              size="sm"
              iconName="Heart"
              iconPosition="left"
              iconSize={16}
            >
              {language === 'ar' ? 'حفظ' : 'Sauvegarder'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              iconPosition="left"
              iconSize={16}
            >
              {language === 'ar' ? 'مشاركة' : 'Partager'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
              iconPosition="left"
              iconSize={16}
            >
              {language === 'ar' ? 'اتصال' : 'Appeler'}
            </Button>
          </div>
        )}

        {location.pathname === '/search-and-filter-interface' && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                iconName="MapPin"
                iconPosition="left"
                iconSize={16}
                className="text-muted-foreground"
              >
                {language === 'ar' ? 'المغرب' : 'Maroc'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                iconName="SlidersHorizontal"
                iconSize={16}
              >
                {language === 'ar' ? 'فلاتر متقدمة' : 'Filtres avancés'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBreadcrumb;