import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsList = ({ language = 'fr', className = '' }) => {
  const benefits = [
    {
      icon: 'Navigation',
      titleFr: 'Nettoyeurs les plus proches',
      titleAr: 'أقرب منظفات السيارات',
      descriptionFr: 'Trouvez instantanément les services de nettoyage dans votre zone',
      descriptionAr: 'اعثر فوراً على خدمات التنظيف في منطقتك'
    },
    {
      icon: 'Clock',
      titleFr: 'Calcul de distance précis',
      titleAr: 'حساب دقيق للمسافة',
      descriptionFr: 'Temps de trajet et coûts de déplacement exacts',
      descriptionAr: 'وقت السفر وتكاليف التنقل الدقيقة'
    },
    {
      icon: 'Star',
      titleFr: 'Recommandations personnalisées',
      titleAr: 'توصيات شخصية',
      descriptionFr: 'Services adaptés à votre localisation et préférences',
      descriptionAr: 'خدمات مناسبة لموقعك وتفضيلاتك'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {benefits?.map((benefit, index) => (
        <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={benefit?.icon} size={20} className="text-accent" />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-medium text-foreground mb-1">
              {language === 'ar' ? benefit?.titleAr : benefit?.titleFr}
            </h4>
            <p className="font-body text-sm text-muted-foreground">
              {language === 'ar' ? benefit?.descriptionAr : benefit?.descriptionFr}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BenefitsList;