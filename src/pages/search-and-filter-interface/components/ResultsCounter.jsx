import React from 'react';
import Icon from '../../../components/AppIcon';

const ResultsCounter = ({ 
  totalResults = 0, 
  filteredResults = 0, 
  isLoading = false,
  language = 'fr',
  className = ''
}) => {
  const hasFilters = filteredResults !== totalResults;

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
        <Icon name="Loader2" size={16} className="text-primary animate-spin" />
        <span className="font-body text-sm text-muted-foreground">
          {language === 'ar' ? 'جاري البحث...' : 'Recherche en cours...'}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Icon name="Search" size={16} className="text-primary" />
        <div>
          <span className="font-data text-sm font-medium text-foreground">
            {filteredResults} {language === 'ar' ? 'نتيجة' : 'résultats'}
          </span>
          {hasFilters && (
            <span className="font-body text-sm text-muted-foreground ml-1 rtl:ml-0 rtl:mr-1">
              {language === 'ar' ? `من أصل ${totalResults}` : `sur ${totalResults}`}
            </span>
          )}
        </div>
      </div>

      {/* Results Quality Indicator */}
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
        {filteredResults > 50 && (
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-success">
            <Icon name="TrendingUp" size={14} />
            <span className="font-caption text-xs">
              {language === 'ar' ? 'نتائج ممتازة' : 'Excellents résultats'}
            </span>
          </div>
        )}
        
        {filteredResults > 0 && filteredResults <= 10 && (
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-warning">
            <Icon name="AlertTriangle" size={14} />
            <span className="font-caption text-xs">
              {language === 'ar' ? 'نتائج محدودة' : 'Résultats limités'}
            </span>
          </div>
        )}
        
        {filteredResults === 0 && (
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-error">
            <Icon name="AlertCircle" size={14} />
            <span className="font-caption text-xs">
              {language === 'ar' ? 'لا توجد نتائج' : 'Aucun résultat'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsCounter;