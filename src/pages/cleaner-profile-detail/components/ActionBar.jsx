import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const ActionBar = ({ cleaner, language, onCall, onDirections, onBooking, onShare, onSave }) => {
  const navigate = useNavigate();

  const formatPhoneNumber = (phone) => {
    // Format Moroccan phone number for display
    if (phone?.startsWith('+212')) {
      const number = phone?.substring(4);
      return `+212 ${number?.substring(0, 1)} ${number?.substring(1, 3)} ${number?.substring(3, 5)} ${number?.substring(5)}`;
    }
    return phone;
  };

  const getCallText = () => {
    return language === 'ar' ? 'اتصال' : 'Appeler';
  };

  const getDirectionsText = () => {
    return language === 'ar' ? 'الاتجاهات' : 'Itinéraire';
  };

  const getBookingText = () => {
    return language === 'ar' ? 'احجز الآن' : 'Réserver';
  };

  const handleBooking = () => {
    // Placeholder for actual booking logic or navigation
    // This would typically navigate to a booking screen or open a modal
    if (onBooking) {
      onBooking();
    }
  };

  const getBookingIcon = () => {
    // Placeholder for dynamic icon based on booking type or context
    return 'Calendar';
  };

  return (
    <>
      {/* Desktop Action Bar */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-modal">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Quick Info */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div>
                <div className="font-heading font-semibold text-base text-foreground">
                  {cleaner?.name}
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="font-data text-sm text-muted-foreground">
                    {cleaner?.rating} ({cleaner?.totalReviews})
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-data text-sm text-muted-foreground">
                    {cleaner?.distance} km
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                iconName="Heart"
                iconSize={16}
                className="hidden lg:flex"
              >
                {language === 'ar' ? 'حفظ' : 'Sauvegarder'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onShare}
                iconName="Share"
                iconSize={16}
                className="hidden lg:flex"
              >
                {language === 'ar' ? 'مشاركة' : 'Partager'}
              </Button>

              {/* Primary Actions */}
              <Button
                variant="outline"
                onClick={onCall}
                iconName="Phone"
                iconPosition="left"
                iconSize={16}
              >
                {getCallText()}
              </Button>

              <Button
                variant="outline"
                onClick={onDirections}
                iconName="Navigation"
                iconPosition="left"
                iconSize={16}
              >
                {getDirectionsText()}
              </Button>

              <Button
                variant="default"
                onClick={() => navigate('/mobile-booking')}
                iconName={getBookingIcon()}
                iconPosition="left"
                iconSize={16}
                size="lg"
                className="px-8"
              >
                {getBookingText()}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-modal">
        <div className="px-4 py-3">
          {/* Top Row - Secondary Actions */}
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              iconName="Heart"
              iconSize={16}
              className="flex-1"
            >
              {language === 'ar' ? 'حفظ' : 'Sauvegarder'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              iconName="Share"
              iconSize={16}
              className="flex-1"
            >
              {language === 'ar' ? 'مشاركة' : 'Partager'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDirections}
              iconName="Navigation"
              iconSize={16}
              className="flex-1"
            >
              {getDirectionsText()}
            </Button>
          </div>

          {/* Bottom Row - Primary Actions */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              variant="outline"
              onClick={onCall}
              iconName="Phone"
              iconPosition="left"
              iconSize={18}
              className="flex-1"
            >
              {getCallText()}
            </Button>

            <Button
              variant="default"
              onClick={() => navigate('/mobile-booking')}
              iconName="Calendar"
              iconPosition="left"
              iconSize={18}
              className="flex-1"
            >
              {getBookingText()}
            </Button>
          </div>
        </div>

        {/* Safe Area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-card"></div>
      </div>
      {/* Floating Quick Actions (Mobile) */}
      <div className="md:hidden fixed bottom-24 right-4 z-40 flex flex-col space-y-2">
        {cleaner?.isOnline && (
          <Button
            variant="default"
            size="icon"
            onClick={onCall}
            className="w-12 h-12 rounded-full shadow-modal bg-success hover:bg-success/90"
          >
            <Icon name="Phone" size={20} color="white" />
          </Button>
        )}
      </div>
      {/* Contact Info Modal Trigger (Hidden but accessible) */}
      <div className="sr-only">
        <span>{formatPhoneNumber(cleaner?.phone)}</span>
        <span>{cleaner?.email}</span>
      </div>
    </>
  );
};

export default ActionBar;