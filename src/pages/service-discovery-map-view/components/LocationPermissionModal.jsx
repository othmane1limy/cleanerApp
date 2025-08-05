import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationPermissionModal = ({ 
  isOpen = false,
  onClose = () => {},
  onAllow = () => {},
  onDeny = () => {},
  language = 'fr'
}) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate('/location-permission-handler');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-100" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-modal border border-border max-w-sm w-full mx-4">
          {/* Header */}
          <div className="text-center p-6 pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MapPin" size={32} className="text-primary" />
            </div>
            
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
              {language === 'ar' ? 'تحديد موقعك' : 'Localiser votre position'}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === 'ar' ?'نحتاج إلى موقعك لإظهار أقرب خدمات تنظيف السيارات إليك وحساب المسافات بدقة.' :'Nous avons besoin de votre localisation pour afficher les services de nettoyage automobile les plus proches et calculer les distances avec précision.'
              }
            </p>
          </div>

          {/* Benefits */}
          <div className="px-6 pb-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Navigation" size={16} className="text-green-600" />
                </div>
                <span className="text-sm text-foreground">
                  {language === 'ar' ? 'العثور على أقرب الخدمات' : 'Trouver les services les plus proches'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={16} className="text-blue-600" />
                </div>
                <span className="text-sm text-foreground">
                  {language === 'ar' ? 'حساب أوقات الوصول الدقيقة' : 'Calculer les temps d\'arrivée précis'}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Route" size={16} className="text-purple-600" />
                </div>
                <span className="text-sm text-foreground">
                  {language === 'ar' ? 'الحصول على اتجاهات القيادة' : 'Obtenir des directions de conduite'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-2 space-y-3">
            <Button
              variant="default"
              onClick={onAllow}
              className="w-full"
              iconName="MapPin"
              iconPosition="left"
              iconSize={16}
            >
              {language === 'ar' ? 'السماح بالوصول للموقع' : 'Autoriser la localisation'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onDeny}
              className="w-full"
            >
              {language === 'ar' ? 'المتابعة بدون موقع' : 'Continuer sans localisation'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleLearnMore}
              className="w-full text-sm"
            >
              {language === 'ar' ? 'معرفة المزيد' : 'En savoir plus'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationPermissionModal;