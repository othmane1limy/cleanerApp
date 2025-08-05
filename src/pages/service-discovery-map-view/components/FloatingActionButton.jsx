import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FloatingActionButton = ({ 
  language = 'fr',
  cleanersCount = 0
}) => {
  const navigate = useNavigate();

  const handleListViewToggle = () => {
    navigate('/service-discovery-list-view');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="default"
        size="lg"
        onClick={handleListViewToggle}
        className="rounded-full shadow-modal min-w-[120px] spring-animation"
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Icon name="List" size={20} />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium leading-none">
              {language === 'ar' ? 'عرض القائمة' : 'Vue liste'}
            </span>
            <span className="text-xs opacity-80 leading-none">
              {cleanersCount} {language === 'ar' ? 'منظف' : 'nettoyeurs'}
            </span>
          </div>
        </div>
      </Button>
    </div>
  );
};

export default FloatingActionButton;