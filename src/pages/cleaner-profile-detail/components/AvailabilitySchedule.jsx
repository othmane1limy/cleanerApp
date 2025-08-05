import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AvailabilitySchedule = ({ schedule, language, timeZone = 'Africa/Casablanca' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const getDayName = (date, short = false) => {
    const options = { 
      weekday: short ? 'short' : 'long',
      locale: language === 'ar' ? 'ar-MA' : 'fr-MA'
    };
    return date?.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-MA', options);
  };

  const getMonthName = (date) => {
    const options = { 
      month: 'long',
      locale: language === 'ar' ? 'ar-MA' : 'fr-MA'
    };
    return date?.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-MA', options);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time?.split(':');
    const date = new Date();
    date?.setHours(parseInt(hours), parseInt(minutes));
    
    return date?.toLocaleTimeString(language === 'ar' ? 'ar-MA' : 'fr-MA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date?.setDate(date?.getDate() + i);
      days?.push(date);
    }
    return days;
  };

  const getDaySchedule = (date) => {
    const dayName = date?.toLocaleDateString('en-US', { weekday: 'lowercase' });
    return schedule?.[dayName] || { isAvailable: false, slots: [] };
  };

  const getAvailabilityStatus = (daySchedule) => {
    if (!daySchedule?.isAvailable) {
      return {
        status: 'closed',
        text: language === 'ar' ? 'مغلق' : 'Fermé',
        color: 'text-muted-foreground'
      };
    }

    const availableSlots = daySchedule?.slots?.filter(slot => slot?.isAvailable);
    if (availableSlots?.length === 0) {
      return {
        status: 'booked',
        text: language === 'ar' ? 'محجوز بالكامل' : 'Complet',
        color: 'text-error'
      };
    }

    return {
      status: 'available',
      text: language === 'ar' ? `${availableSlots?.length} فترة متاحة` : `${availableSlots?.length} créneaux`,
      color: 'text-success'
    };
  };

  const next7Days = getNext7Days();
  const selectedDaySchedule = getDaySchedule(selectedDate);

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <h3 className="font-heading font-semibold text-base text-foreground mb-3">
          {language === 'ar' ? 'اختر التاريخ' : 'Choisir la date'}
        </h3>
        
        <div className="flex space-x-2 rtl:space-x-reverse overflow-x-auto pb-2">
          {next7Days?.map((date, index) => {
            const daySchedule = getDaySchedule(date);
            const availabilityStatus = getAvailabilityStatus(daySchedule);
            const isSelected = date?.toDateString() === selectedDate?.toDateString();
            const isToday = date?.toDateString() === new Date()?.toDateString();
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 p-3 rounded-lg border-2 smooth-transition min-w-[80px] ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className={`font-data text-xs mb-1 ${
                    isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}>
                    {isToday 
                      ? (language === 'ar' ? 'اليوم' : 'Aujourd\'hui')
                      : getDayName(date, true)
                    }
                  </div>
                  <div className={`font-heading font-bold text-lg ${
                    isSelected ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    {date?.getDate()}
                  </div>
                  <div className={`font-caption text-xs ${availabilityStatus?.color} ${
                    isSelected ? 'text-primary-foreground' : ''
                  }`}>
                    {availabilityStatus?.status === 'available' && (
                      <Icon name="Check" size={12} className="mx-auto" />
                    )}
                    {availabilityStatus?.status === 'closed' && (
                      <Icon name="X" size={12} className="mx-auto" />
                    )}
                    {availabilityStatus?.status === 'booked' && (
                      <Icon name="Clock" size={12} className="mx-auto" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Selected Date Info */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-semibold text-lg text-foreground">
              {getDayName(selectedDate)} {selectedDate?.getDate()} {getMonthName(selectedDate)}
            </h4>
            <p className="font-body text-sm text-muted-foreground">
              {getAvailabilityStatus(selectedDaySchedule)?.text}
            </p>
          </div>
          
          <div className="text-right rtl:text-left">
            <Icon 
              name={selectedDaySchedule?.isAvailable ? "Calendar" : "CalendarX"} 
              size={24} 
              className={selectedDaySchedule?.isAvailable ? "text-primary" : "text-muted-foreground"} 
            />
          </div>
        </div>
      </div>
      {/* Time Slots */}
      {selectedDaySchedule?.isAvailable ? (
        <div>
          <h3 className="font-heading font-semibold text-base text-foreground mb-3">
            {language === 'ar' ? 'الأوقات المتاحة' : 'Créneaux disponibles'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedDaySchedule?.slots?.map((slot, index) => (
              <button
                key={index}
                onClick={() => slot?.isAvailable && setSelectedTimeSlot(slot)}
                disabled={!slot?.isAvailable}
                className={`p-3 rounded-lg border-2 smooth-transition ${
                  selectedTimeSlot?.startTime === slot?.startTime
                    ? 'border-primary bg-primary text-primary-foreground'
                    : slot?.isAvailable
                    ? 'border-border bg-card hover:border-primary/50' :'border-border bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className="font-data font-medium text-sm">
                    {formatTime(slot?.startTime)}
                  </div>
                  <div className="font-caption text-xs mt-1">
                    {slot?.isAvailable 
                      ? (language === 'ar' ? 'متاح' : 'Disponible')
                      : (language === 'ar' ? 'محجوز' : 'Réservé')
                    }
                  </div>
                  {slot?.duration && (
                    <div className="font-caption text-xs opacity-70">
                      {slot?.duration} {language === 'ar' ? 'دقيقة' : 'min'}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedDaySchedule?.slots?.filter(slot => slot?.isAvailable)?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h4 className="font-heading font-medium text-lg text-foreground mb-2">
                {language === 'ar' ? 'لا توجد أوقات متاحة' : 'Aucun créneau disponible'}
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                {language === 'ar' ?'جميع الأوقات محجوزة لهذا اليوم' :'Tous les créneaux sont réservés pour cette date'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="CalendarX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="font-heading font-medium text-lg text-foreground mb-2">
            {language === 'ar' ? 'غير متاح في هذا اليوم' : 'Non disponible ce jour'}
          </h4>
          <p className="font-body text-sm text-muted-foreground">
            {language === 'ar' ?'يرجى اختيار يوم آخر' :'Veuillez choisir une autre date'
            }
          </p>
        </div>
      )}
      {/* Selected Time Slot Info */}
      {selectedTimeSlot && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-semibold text-base text-foreground mb-1">
                {language === 'ar' ? 'الوقت المحدد' : 'Créneau sélectionné'}
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                {getDayName(selectedDate)} {selectedDate?.getDate()} {getMonthName(selectedDate)} - {formatTime(selectedTimeSlot?.startTime)}
              </p>
              {selectedTimeSlot?.duration && (
                <p className="font-caption text-xs text-muted-foreground mt-1">
                  {language === 'ar' ? 'المدة:' : 'Durée:'} {selectedTimeSlot?.duration} {language === 'ar' ? 'دقيقة' : 'minutes'}
                </p>
              )}
            </div>
            
            <Button
              variant="default"
              size="sm"
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
            >
              {language === 'ar' ? 'احجز الآن' : 'Réserver'}
            </Button>
          </div>
        </div>
      )}
      {/* Working Hours Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-heading font-semibold text-base text-foreground mb-3 flex items-center space-x-2 rtl:space-x-reverse">
          <Icon name="Clock" size={16} className="text-primary" />
          <span>{language === 'ar' ? 'ساعات العمل' : 'Horaires de travail'}</span>
        </h3>
        
        <div className="space-y-2">
          {Object.entries(schedule)?.map(([day, daySchedule]) => {
            const dayName = language === 'ar' 
              ? {
                  monday: 'الاثنين',
                  tuesday: 'الثلاثاء', 
                  wednesday: 'الأربعاء',
                  thursday: 'الخميس',
                  friday: 'الجمعة',
                  saturday: 'السبت',
                  sunday: 'الأحد'
                }?.[day]
              : {
                  monday: 'Lundi',
                  tuesday: 'Mardi',
                  wednesday: 'Mercredi', 
                  thursday: 'Jeudi',
                  friday: 'Vendredi',
                  saturday: 'Samedi',
                  sunday: 'Dimanche'
                }?.[day];

            return (
              <div key={day} className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground">
                  {dayName}
                </span>
                <span className="font-data text-sm text-muted-foreground">
                  {daySchedule?.isAvailable 
                    ? `${formatTime(daySchedule?.startTime || '08:00')} - ${formatTime(daySchedule?.endTime || '18:00')}`
                    : (language === 'ar' ? 'مغلق' : 'Fermé')
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySchedule;