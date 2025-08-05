import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AvailabilityFilter = ({ 
  selectedAvailability = '', 
  onChange = () => {}, 
  language = 'fr' 
}) => {
  const availabilityOptions = [
    {
      id: 'now',
      label: language === 'ar' ? 'متاح الآن' : 'Disponible maintenant',
      description: language === 'ar' ? 'خلال 30 دقيقة' : 'Dans les 30 minutes',
      icon: 'Clock',
      urgent: true,
      count: 12
    },
    {
      id: 'today',
      label: language === 'ar' ? 'اليوم' : 'Aujourd\'hui',
      description: language === 'ar' ? 'خلال اليوم' : 'Dans la journée',
      icon: 'Calendar',
      urgent: false,
      count: 45
    },
    {
      id: 'tomorrow',
      label: language === 'ar' ? 'غداً' : 'Demain',
      description: language === 'ar' ? 'الغد' : 'Le lendemain',
      icon: 'CalendarDays',
      urgent: false,
      count: 78
    },
    {
      id: 'week',
      label: language === 'ar' ? 'هذا الأسبوع' : 'Cette semaine',
      description: language === 'ar' ? 'خلال 7 أيام' : 'Dans les 7 jours',
      icon: 'CalendarRange',
      urgent: false,
      count: 156
    },
    {
      id: 'weekend',
      label: language === 'ar' ? 'نهاية الأسبوع' : 'Week-end',
      description: language === 'ar' ? 'السبت والأحد' : 'Samedi et dimanche',
      icon: 'CalendarCheck',
      urgent: false,
      count: 89
    }
  ];

  const timeSlots = [
    { id: 'morning', label: language === 'ar' ? 'صباحاً' : 'Matin', time: '8h-12h', available: 23 },
    { id: 'afternoon', label: language === 'ar' ? 'بعد الظهر' : 'Après-midi', time: '12h-17h', available: 34 },
    { id: 'evening', label: language === 'ar' ? 'مساءً' : 'Soir', time: '17h-20h', available: 18 }
  ];

  return (
    <div className="space-y-4">
      {/* Main Availability Options */}
      <div className="space-y-3">
        {availabilityOptions?.map((option) => (
          <div
            key={option?.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedAvailability === option?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onChange(selectedAvailability === option?.id ? '' : option?.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedAvailability === option?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : option?.urgent 
                      ? 'bg-warning/10 text-warning' :'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={option?.icon} size={18} />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <h4 className="font-body font-medium text-sm text-foreground">
                      {option?.label}
                    </h4>
                    {option?.urgent && (
                      <span className="bg-warning text-warning-foreground text-xs px-1.5 py-0.5 rounded">
                        {language === 'ar' ? 'عاجل' : 'Urgent'}
                      </span>
                    )}
                  </div>
                  <p className="font-caption text-xs text-muted-foreground">
                    {option?.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-data text-xs text-muted-foreground">
                  {option?.count} {language === 'ar' ? 'متاح' : 'disponibles'}
                </span>
                {selectedAvailability === option?.id && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Time Slots */}
      {selectedAvailability && selectedAvailability !== 'now' && (
        <div className="border-t border-border pt-4">
          <h4 className="font-body text-sm font-medium text-foreground mb-3">
            {language === 'ar' ? 'الأوقات المفضلة:' : 'Créneaux préférés:'}
          </h4>
          
          <div className="grid grid-cols-1 gap-2">
            {timeSlots?.map((slot) => (
              <div
                key={slot?.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon name="Clock" size={16} className="text-primary" />
                  <div>
                    <span className="font-body text-sm text-foreground">
                      {slot?.label}
                    </span>
                    <span className="font-data text-xs text-muted-foreground ml-2 rtl:ml-0 rtl:mr-2">
                      ({slot?.time})
                    </span>
                  </div>
                </div>
                
                <span className="font-caption text-xs text-accent">
                  {slot?.available} {language === 'ar' ? 'متاح' : 'disponibles'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange('now')}
          iconName="Zap"
          iconPosition="left"
          iconSize={14}
          className="flex-1"
        >
          {language === 'ar' ? 'حجز سريع' : 'Réservation rapide'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange('today')}
          iconName="Calendar"
          iconPosition="left"
          iconSize={14}
          className="flex-1"
        >
          {language === 'ar' ? 'اليوم' : 'Aujourd\'hui'}
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityFilter;