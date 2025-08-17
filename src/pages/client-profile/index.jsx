import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService, clientService } from '../../lib/supabase';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ClientProfile = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile, checkUserProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      loadClientData();
    }
  }, [user, authLoading, profile]);

  // Handle case where user exists but profile doesn't
  useEffect(() => {
    if (user && !authLoading && !profile) {
      console.log('User exists but no profile found, checking profile...');
      handleMissingProfile();
    }
  }, [user, profile, authLoading]);

  const handleMissingProfile = async () => {
    try {
      setProfileLoading(true);
      console.log('Checking for missing profile...');
      
      const result = await checkUserProfile();
      
      if (!result.hasProfile) {
        console.log('No profile found for user, this might indicate a database issue');
        // You might want to show an error message or redirect to profile creation
      } else {
        console.log('Profile found during check');
      }
    } catch (error) {
      console.error('Error handling missing profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadClientData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      console.log('Loading client data for user:', user.id);
      
      // Load bookings
      const { data: bookingsData, error: bookingsError } = await bookingService.getUserBookings(user.id, 'client');
      
      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError);
      } else {
        console.log('Bookings loaded:', bookingsData?.length || 0);
        setBookings(bookingsData || []);
      }

      // Load favorites (placeholder for now)
      setFavorites([]);
      
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-client-profile');
  };

  const handleRefreshProfile = async () => {
    if (!refreshProfile) return;
    
    try {
      setProfileLoading(true);
      await refreshProfile();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    return texts[status] || status;
  };

  // Show loading screen while authentication is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    navigate('/login');
    return null;
  }

  // Redirect cleaner users
  if (user.user_metadata?.user_type === 'cleaner') {
    navigate('/cleaner-dashboard');
    return null;
  }

  // Show profile missing error with retry option
  if (user && !profile && !profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Icon name="AlertCircle" size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
          <p className="text-muted-foreground mb-4">
            Nous n'arrivons pas à charger votre profil. Cela peut être temporaire.
          </p>
          <div className="space-y-2">
            <Button onClick={handleRefreshProfile} className="w-full">
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Réessayer
            </Button>
            <Button variant="outline" onClick={() => navigate('/edit-client-profile')} className="w-full">
              <Icon name="Edit" size={16} className="mr-2" />
              Compléter le profil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading for profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4" />
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        showViewToggle={false}
        currentLocation={language === 'ar' ? 'المغرب' : 'Maroc'}
        onLanguageChange={setLanguage}
      />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={32} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{profile?.phone}</p>
                </div>
              </div>
              <Button onClick={handleEditProfile} variant="outline">
                <Icon name="Edit" size={16} className="mr-2" />
                Modifier le profil
              </Button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Prénom</p>
                <p className="font-medium">{profile?.first_name || 'Non renseigné'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{profile?.last_name || 'Non renseigné'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{profile?.phone || 'Non renseigné'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{profile?.address || 'Non renseignée'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card rounded-lg shadow-lg mb-6">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Réservations ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'favorites'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Favoris ({favorites.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Prénom</p>
                        <p className="font-medium">{profile?.first_name || 'Non renseigné'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">{profile?.last_name || 'Non renseigné'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{profile?.phone || 'Non renseigné'}</p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="font-medium">{profile?.address || 'Non renseignée'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Historique des réservations</h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-2" />
                      <p>Chargement des réservations...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune réservation trouvée</p>
                      <Button onClick={() => navigate('/')} className="mt-4">
                        Réserver un service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')} à {booking.scheduled_time}
                              </span>
                            </div>
                            <span className="font-semibold text-lg">{booking.total_price} DH</span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium">
                              {booking.cleaner_services?.name || 'Service de nettoyage'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.cleaner_profiles?.business_name || 
                               `${booking.cleaner_profiles?.first_name} ${booking.cleaner_profiles?.last_name}`}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Notes:</span> {booking.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Icon name="Eye" size={16} className="mr-2" />
                              Voir les détails
                            </Button>
                            {booking.status === 'pending' && (
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Icon name="X" size={16} className="mr-2" />
                                Annuler
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Nettoyeurs favoris</h3>
                  {favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun nettoyeur favori</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ajoutez des nettoyeurs à vos favoris pour les retrouver facilement
                      </p>
                      <Button onClick={() => navigate('/')}>
                        Découvrir des nettoyeurs
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((cleaner) => (
                        <div key={cleaner.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon name="User" size={24} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {cleaner.business_name || `${cleaner.first_name} ${cleaner.last_name}`}
                              </p>
                              <p className="text-sm text-muted-foreground">{cleaner.service_area}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Icon name="Star" size={16} className="text-yellow-500" />
                              <span className="text-sm">{cleaner.rating || 0}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/cleaner-profile-detail/${cleaner.user_id}`)}>
                              Voir le profil
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
