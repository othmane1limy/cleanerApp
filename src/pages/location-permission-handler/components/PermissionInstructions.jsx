import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PermissionInstructions = ({ 
  language = 'fr', 
  onRetry = () => {},
  onManualEntry = () => {},
  className = '' 
}) => {
  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent?.includes('Chrome')) {
      return {
        browser: 'Chrome',
        steps: language === 'ar' ? [
          'انقر على أيقونة القفل في شريط العناوين',
          'اختر "السماح" للموقع',
          'أعد تحميل الصفحة'
        ] : [
          'Cliquez sur l\'icône de cadenas dans la barre d\'adresse',
          'Sélectionnez "Autoriser" pour la localisation',
          'Rechargez la page'
        ]
      };
    } else if (userAgent?.includes('Firefox')) {
      return {
        browser: 'Firefox',
        steps: language === 'ar' ? [
          'انقر على أيقونة الدرع في شريط العناوين',
          'اختر "السماح بالموقع"',
          'أعد تحميل الصفحة'
        ] : [
          'Cliquez sur l\'icône de bouclier dans la barre d\'adresse',
          'Sélectionnez "Autoriser la localisation"',
          'Rechargez la page'
        ]
      };
    } else if (userAgent?.includes('Safari')) {
      return {
        browser: 'Safari',
        steps: language === 'ar' ? [
          'اذهب إلى Safari > التفضيلات',
          'انقر على "مواقع الويب"',
          'اختر "السماح" للموقع'
        ] : [
          'Allez dans Safari > Préférences',
          'Cliquez sur "Sites web"',
          'Sélectionnez "Autoriser" pour la localisation'
        ]
      };
    } else {
      return {
        browser: language === 'ar' ? 'المتصفح' : 'Navigateur',
        steps: language === 'ar' ? [
          'ابحث عن إعدادات الموقع في متصفحك',
          'اسمح بالوصول للموقع لهذا الموقع',
          'أعد تحميل الصفحة'
        ] : [
          'Recherchez les paramètres de localisation dans votre navigateur',
          'Autorisez l\'accès à la localisation pour ce site',
          'Rechargez la page'
        ]
      };
    }
  };

  const instructions = getBrowserInstructions();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="AlertTriangle" size={32} className="text-warning" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          {language === 'ar' ? 'إذن الموقع مطلوب' : 'Autorisation de localisation requise'}
        </h3>
        <p className="font-body text-muted-foreground">
          {language === 'ar' ?'لتمكيننا من إظهار أفضل الخدمات القريبة منك' :'Pour nous permettre d\'afficher les meilleurs services près de vous'
          }
        </p>
      </div>
      {/* Browser-specific Instructions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-heading font-medium text-foreground mb-3 flex items-center space-x-2 rtl:space-x-reverse">
          <Icon name="Settings" size={18} className="text-primary" />
          <span>
            {language === 'ar' 
              ? `تعليمات ${instructions?.browser}`
              : `Instructions pour ${instructions?.browser}`
            }
          </span>
        </h4>
        
        <ol className="space-y-2">
          {instructions?.steps?.map((step, index) => (
            <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-data flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="font-body text-sm text-foreground">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {/* Alternative Options */}
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={onRetry}
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={20}
          className="h-12"
        >
          {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onManualEntry}
          iconName="Search"
          iconPosition="left"
          iconSize={20}
          className="h-12"
        >
          {language === 'ar' ? 'إدخال الموقع يدوياً' : 'Saisir la localisation manuellement'}
        </Button>
      </div>
      {/* Additional Help */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-heading font-medium text-foreground mb-1">
              {language === 'ar' ? 'تحتاج مساعدة؟' : 'Besoin d\'aide ?'}
            </h5>
            <p className="font-body text-sm text-muted-foreground">
              {language === 'ar' ?'إذا كنت تواجه مشاكل في تمكين الموقع، يمكنك إدخال موقعك يدوياً أو استخدام الموقع الافتراضي.' :'Si vous rencontrez des problèmes pour activer la localisation, vous pouvez saisir votre position manuellement ou utiliser la localisation par défaut.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionInstructions;