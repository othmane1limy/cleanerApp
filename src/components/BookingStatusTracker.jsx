
import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import { bookingService } from '../lib/supabase';

const BookingStatusTracker = ({ bookingId, language = 'fr' }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadBooking();
    setupSubscription();

    return () => {
      if (subscription) {
        bookingService.unsubscribeFromBookings(subscription);
      }
    };
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const { data, error } = await bookingService.getBookingById(bookingId);
      if (!error && data) {
        setBooking(data);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSubscription = () => {
    if (bookingId) {
      const sub = bookingService.subscribeToBookings(
        bookingId,
        'client',
        (payload) => {
          console.log('Booking status update:', payload);
          loadBooking();
        }
      );
      setSubscription(sub);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: language === 'ar' ? 'قيد الانتظار' : 'En attente',
        icon: 'Clock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      confirmed: {
        label: language === 'ar' ? 'مؤكد' : 'Confirmé',
        icon: 'Check',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      on_way: {
        label: language === 'ar' ? 'في الطريق' : 'En route',
        icon: 'Car',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      arrived: {
        label: language === 'ar' ? 'وصل' : 'Arrivé',
        icon: 'MapPin',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100'
      },
      in_progress: {
        label: language === 'ar' ? 'قيد التنفيذ' : 'En cours',
        icon: 'Play',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      },
      completed: {
        label: language === 'ar' ? 'مكتمل' : 'Terminé',
        icon: 'CheckCircle',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      cancelled: {
        label: language === 'ar' ? 'ملغي' : 'Annulé',
        icon: 'X',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    };

    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Icon name="Loader2" size={24} className="animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">
          {language === 'ar' ? 'لم يتم العثور على الحجز' : 'Réservation non trouvée'}
        </p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(booking.status);

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {language === 'ar' ? 'حالة الحجز' : 'Statut de la réservation'}
        </h3>
        <div className={`px-3 py-1 rounded-full flex items-center space-x-2 ${statusInfo.bgColor}`}>
          <Icon name={statusInfo.icon} size={16} className={statusInfo.color} />
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {language === 'ar' ? 'رقم الحجز' : 'Référence'}
          </span>
          <span className="font-medium">#{booking.id.slice(-6)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {language === 'ar' ? 'التاريخ' : 'Date'}
          </span>
          <span className="font-medium">
            {new Date(booking.scheduled_date).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {language === 'ar' ? 'الوقت' : 'Heure'}
          </span>
          <span className="font-medium">{booking.scheduled_time}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {language === 'ar' ? 'المنظف' : 'Nettoyeur'}
          </span>
          <span className="font-medium">
            {booking.cleaner_profiles?.business_name || 
             `${booking.cleaner_profiles?.first_name} ${booking.cleaner_profiles?.last_name}`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {language === 'ar' ? 'السعر' : 'Prix'}
          </span>
          <span className="font-semibold">{booking.total_price} DH</span>
        </div>
      </div>

      {booking.status === 'confirmed' || booking.status === 'on_way' ? (
        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => window.open(`tel:${booking.cleaner_profiles?.phone}`)}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Icon name="Phone" size={16} />
            <span>
              {language === 'ar' ? 'الاتصال بالمنظف' : 'Appeler le nettoyeur'}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default BookingStatusTracker;
