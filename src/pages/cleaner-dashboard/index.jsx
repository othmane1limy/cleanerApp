
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cleanerService, bookingService } from '../../lib/supabase';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const CleanerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('fr');
  
  // Form states for editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: 60
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      loadCleanerData();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (profile && !authLoading) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        business_name: profile.business_name || '',
        service_area: profile.service_area || '',
        bio: profile.bio || '',
        is_mobile: profile.is_mobile || true,
        has_garage: profile.has_garage || false,
        garage_address: profile.garage_address || '',
        working_hours: profile.working_hours || { start: '08:00', end: '18:00' }
      });
    }
  }, [profile, authLoading]);

  const loadCleanerData = async () => {
    try {
      setLoading(true);
      
      // Load bookings
      const { data: bookingsData } = await bookingService.getUserBookings(user.id, 'cleaner');
      setBookings(bookingsData || []);

      // Load services
      const { data: servicesData } = await cleanerService.getServices(profile?.id);
      setServices(servicesData || []);
      
    } catch (error) {
      console.error('Error loading cleaner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await cleanerService.updateProfile(profile.id, profileForm);
      if (error) {
        alert(`Erreur: ${error.message}`);
      } else {
        alert('Profil mis à jour avec succès!');
        setIsEditingProfile(false);
        // Reload profile data
        window.location.reload();
      }
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleAddService = async () => {
    try {
      if (!serviceForm.name || !serviceForm.price) {
        alert('Veuillez remplir le nom et le prix du service');
        return;
      }

      const { error } = await cleanerService.addService(profile.id, {
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        duration_minutes: parseInt(serviceForm.duration_minutes)
      });

      if (error) {
        alert(`Erreur: ${error.message}`);
      } else {
        alert('Service ajouté avec succès!');
        setIsAddingService(false);
        setServiceForm({ name: '', description: '', price: '', duration_minutes: 60 });
        loadCleanerData(); // Reload services
      }
    } catch (err) {
      alert(`Erreur: ${err.message}`);
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

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.user_metadata?.user_type !== 'cleaner') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        showViewToggle={false}
        currentLocation={language === 'ar' ? 'المغرب' : 'Maroc'}
        onLanguageChange={setLanguage}
      />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Briefcase" size={32} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile?.business_name || `${profile?.first_name} ${profile?.last_name}`}
                  </h1>
                  <p className="text-muted-foreground">{profile?.service_area}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                  <Icon name="Edit" size={16} className="mr-2" />
                  Modifier le profil
                </Button>
                <Button onClick={() => navigate('/')}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Nouvelle réservation
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Total Réservations</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{services.length}</p>
                <p className="text-sm text-muted-foreground">Services</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card rounded-lg shadow-lg mb-6">
            <div className="flex border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Réservations ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Services ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Profil
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Réservations récentes</h3>
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="border border-border rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.client_profiles?.first_name} {booking.client_profiles?.last_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')} à {booking.scheduled_time}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </div>
                            <p className="font-semibold mt-1">{booking.total_price} DH</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Toutes les réservations</h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-2" />
                      <p>Chargement des réservations...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune réservation trouvée</p>
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
                              Client: {booking.client_profiles?.first_name} {booking.client_profiles?.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Service: {booking.cleaner_services?.name || 'Service de nettoyage'}
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
                              <>
                                <Button variant="default" size="sm">
                                  <Icon name="Check" size={16} className="mr-2" />
                                  Confirmer
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <Icon name="X" size={16} className="mr-2" />
                                  Refuser
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Mes services</h3>
                    <Button onClick={() => setIsAddingService(true)}>
                      <Icon name="Plus" size={16} className="mr-2" />
                      Ajouter un service
                    </Button>
                  </div>
                  
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun service configuré</p>
                      <Button onClick={() => setIsAddingService(true)} className="mt-4">
                        Ajouter votre premier service
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <div key={service.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{service.name}</h4>
                            <span className="font-semibold text-lg">{service.price} DH</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {service.description || 'Aucune description'}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Durée: {service.duration_minutes} min</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {service.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
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
                        <p className="text-sm text-muted-foreground">Nom de l'entreprise</p>
                        <p className="font-medium">{profile?.business_name || 'Non renseigné'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Zone de service</p>
                        <p className="font-medium">{profile?.service_area || 'Non renseignée'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{profile?.phone || 'Non renseigné'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Type de service</p>
                        <p className="font-medium">
                          {profile?.is_mobile ? 'Mobile' : 'Fixe'} 
                          {profile?.has_garage && ' + Garage'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Modifier le profil</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingProfile(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom *</label>
                  <Input
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <Input
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nom de l'entreprise</label>
                <Input
                  value={profileForm.business_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, business_name: e.target.value }))}
                  placeholder="Nom de l'entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Zone de service *</label>
                <Input
                  value={profileForm.service_area}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, service_area: e.target.value }))}
                  placeholder="Zone de service (ville/région)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Description de vos services..."
                  className="w-full p-3 border border-border rounded-md resize-none"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleProfileUpdate} className="flex-1">
                  Mettre à jour
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {isAddingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Ajouter un service</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingService(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du service *</label>
                <Input
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du service..."
                  className="w-full p-3 border border-border rounded-md resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prix (DH) *</label>
                  <Input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Durée (min)</label>
                  <Input
                    type="number"
                    value={serviceForm.duration_minutes}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleAddService} className="flex-1">
                  Ajouter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingService(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanerDashboard;
