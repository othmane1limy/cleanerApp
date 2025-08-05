import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ 
  type = 'no_results', 
  onRetry, 
  onClearFilters, 
  language = 'fr' 
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no_results':
        return {
          icon: 'Search',
          title: language === 'ar' ? 'لا توجد نتائج' : 'Aucun résultat',
          description: language === 'ar' ?'لم نجد أي منظفات تطابق معايير البحث الخاصة بك. جرب تعديل الفلاتر أو توسيع نطاق البحث.' :'Nous n\'avons trouvé aucun nettoyeur correspondant à vos critères. Essayez de modifier les filtres ou d\'élargir votre recherche.',
          primaryAction: {
            label: language === 'ar' ? 'مسح الفلاتر' : 'Effacer les filtres',
            action: onClearFilters
          },
          secondaryAction: {
            label: language === 'ar' ? 'إعادة المحاولة' : 'Réessayer',
            action: onRetry
          }
        };
      
      case 'no_location':
        return {
          icon: 'MapPin',
          title: language === 'ar' ? 'الموقع غير متاح' : 'Localisation indisponible',
          description: language === 'ar' ?'نحتاج إلى موقعك لإظهار المنظفات القريبة منك. يرجى تمكين خدمات الموقع.' :'Nous avons besoin de votre localisation pour afficher les nettoyeurs à proximité. Veuillez activer les services de localisation.',
          primaryAction: {
            label: language === 'ar' ? 'تمكين الموقع' : 'Activer la localisation',
            action: onRetry
          }
        };
      
      case 'error':
        return {
          icon: 'AlertCircle',
          title: language === 'ar' ? 'حدث خطأ' : 'Une erreur s\'est produite',
          description: language === 'ar' ?'لم نتمكن من تحميل قائمة المنظفات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' :'Impossible de charger la liste des nettoyeurs. Veuillez vérifier votre connexion internet et réessayer.',
          primaryAction: {
            label: language === 'ar' ? 'إعادة المحاولة' : 'Réessayer',
            action: onRetry
          }
        };
      
      default:
        return {
          icon: 'Search',
          title: language === 'ar' ? 'لا توجد بيانات' : 'Aucune donnée',
          description: language === 'ar' ? 'لا توجد بيانات للعرض حالياً.' : 'Aucune donnée à afficher pour le moment.',
          primaryAction: {
            label: language === 'ar' ? 'إعادة تحميل' : 'Recharger',
            action: onRetry
          }
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon name={content?.icon} size={32} className="text-muted-foreground" />
      </div>
      {/* Title */}
      <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
        {content?.title}
      </h3>
      {/* Description */}
      <p className="font-body text-muted-foreground text-center max-w-sm mb-6 leading-relaxed">
        {content?.description}
      </p>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {content?.primaryAction && (
          <Button
            variant="default"
            onClick={content?.primaryAction?.action}
            className="min-w-32"
          >
            {content?.primaryAction?.label}
          </Button>
        )}
        
        {content?.secondaryAction && (
          <Button
            variant="outline"
            onClick={content?.secondaryAction?.action}
            className="min-w-32"
          >
            {content?.secondaryAction?.label}
          </Button>
        )}
      </div>
      {/* Additional Help Text */}
      {type === 'no_results' && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md">
          <h4 className="font-medium text-sm text-foreground mb-2">
            {language === 'ar' ? 'نصائح للبحث:' : 'Conseils de recherche:'}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 text-left rtl:text-right">
            <li>• {language === 'ar' ? 'جرب توسيع نطاق المسافة' : 'Essayez d\'élargir la distance'}</li>
            <li>• {language === 'ar' ? 'قم بإزالة بعض الفلاتر' : 'Supprimez quelques filtres'}</li>
            <li>• {language === 'ar' ? 'تحقق من الإملاء' : 'Vérifiez l\'orthographe'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;