import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';

const CleanerCard = ({ cleaner, onViewProfile }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cleaner.is_mobile && cleaner.has_garage) {
      navigate(`/cleaner-profile/${cleaner.user_id}`);
    } else if (cleaner.is_mobile) {
      navigate('/mobile-booking', { state: { cleaner } });
    } else {
      navigate('/garage-booking', { state: { cleaner } });
    }
  };

  const handleViewProfileClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onViewProfile(cleaner);
  };

  const formatWorkingHours = (hours) => {
    if (!hours) return 'Non spécifié';
    return `${hours.start} - ${hours.end}`;
  };

  const getServiceTypes = () => {
    const types = [];
    if (cleaner.is_mobile) types.push('Mobile');
    if (cleaner.has_garage) types.push('Garage');
    return types.join(' • ');
  };

  const minPrice = cleaner.cleaner_services?.length > 0
    ? Math.min(...cleaner.cleaner_services.map(s => s.price))
    : null;

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {cleaner.profile_image ? (
            <Image
              src={cleaner.profile_image}
              alt={cleaner.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="User" size={24} color="#6B7280" />
          )}
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{cleaner.business_name || `${cleaner.first_name} ${cleaner.last_name}`}</h3>
              <p className="text-muted-foreground text-sm">{cleaner.service_area}</p>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Star" size={16} color="#F59E0B" />
              <span className="font-medium">{cleaner.rating || '0.0'}</span>
              <span className="text-muted-foreground text-sm">({cleaner.total_reviews || 0})</span>
            </div>
          </div>

          {/* Service Types */}
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MapPin" size={14} color="#6B7280" />
            <span className="text-sm text-muted-foreground">{getServiceTypes()}</span>
          </div>

          {/* Working Hours */}
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Clock" size={14} color="#6B7280" />
            <span className="text-sm text-muted-foreground">
              {formatWorkingHours(cleaner.working_hours)}
            </span>
          </div>

          {/* Services */}
          {cleaner.cleaner_services?.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {cleaner.cleaner_services.slice(0, 3).map((service) => (
                  <span
                    key={service.id}
                    className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    {service.name}
                  </span>
                ))}
                {cleaner.cleaner_services.length > 3 && (
                  <span className="inline-block bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                    +{cleaner.cleaner_services.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          {minPrice && (
            <div className="mb-3">
              <span className="text-lg font-semibold text-primary">
                À partir de {minPrice} MAD
              </span>
            </div>
          )}

          {/* Bio */}
          {cleaner.bio && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {cleaner.bio}
            </p>
          )}

          {/* Status */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${cleaner.is_active ? 'bg-success' : 'bg-error'}`}></div>
            <span className={`text-sm ${cleaner.is_active ? 'text-success' : 'text-error'}`}>
              {cleaner.is_active ? 'Disponible' : 'Non disponible'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleBookNow}
              disabled={!cleaner.is_active}
              className="flex-1"
            >
              <Icon name="Calendar" size={16} />
              Réserver
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewProfileClick}
              className="flex-1"
            >
              <Icon name="Eye" size={16} />
              Voir profil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanerCard;