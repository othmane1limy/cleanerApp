
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cleanerService, bookingService } from '../../lib/supabase';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const CleanerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(profile || {});
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', description: '', duration: '' });
  const [newImage, setNewImage] = useState({ image_url: '', caption: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load services
      const { data: servicesData, error: servicesError } = await cleanerService.getServices(user.id);
      if (!servicesError) setServices(servicesData || []);

      // Load gallery
      const { data: galleryData, error: galleryError } = await cleanerService.getGallery(user.id);
      if (!galleryError) setGallery(galleryData || []);

      // Load bookings
      const { data: bookingsData, error: bookingsError } = await bookingService.getUserBookings(user.id, 'cleaner');
      if (!bookingsError) setBookings(bookingsData || []);

    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await cleanerService.updateProfile(user.id, profileData);
      if (error) {
        setError('Erreur lors de la mise à jour du profil');
      } else {
        setIsEditing(false);
        setError('');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addService = async () => {
    if (!newService.name || !newService.price) return;
    
    setLoading(true);
    try {
      const { data, error } = await cleanerService.addService(user.id, {
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration) || null
      });
      
      if (!error) {
        setServices([...services, data]);
        setNewService({ name: '', price: '', description: '', duration: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      const { error } = await cleanerService.deleteService(serviceId);
      if (!error) {
        setServices(services.filter(service => service.id !== serviceId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addGalleryImage = async () => {
    if (!newImage.image_url) return;
    
    setLoading(true);
    try {
      const { data, error } = await cleanerService.addGalleryImage(user.id, newImage);
      if (!error) {
        setGallery([data, ...gallery]);
        setNewImage({ image_url: '', caption: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryImage = async (imageId) => {
    try {
      const { error } = await cleanerService.deleteGalleryImage(imageId);
      if (!error) {
        setGallery(gallery.filter(image => image.id !== imageId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async () => {
    const newStatus = !profileData.is_active;
    setLoading(true);
    try {
      const { error } = await cleanerService.updateProfile(user.id, { is_active: newStatus });
      if (!error) {
        setProfileData(prev => ({ ...prev, is_active: newStatus }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const { error } = await bookingService.updateBookingStatus(bookingId, status);
      if (!error) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !profileData.id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader showViewToggle={false} />
      
      <div className="pt-16 max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Gérez votre profil et vos services</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={profileData.is_active ? "success" : "outline"}
              onClick={toggleStatus}
              disabled={loading}
            >
              <Icon name={profileData.is_active ? "CheckCircle" : "Circle"} size={16} />
              {profileData.is_active ? 'En ligne' : 'Hors ligne'}
            </Button>
            <Button variant="outline" onClick={signOut}>
              Déconnexion
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {['profile', 'services', 'gallery', 'bookings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'profile' && 'Profil'}
                {tab === 'services' && 'Services'}
                {tab === 'gallery' && 'Galerie'}
                {tab === 'bookings' && 'Réservations'}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-card rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Informations du profil</h2>
              <Button
                variant={isEditing ? "success" : "outline"}
                onClick={isEditing ? updateProfile : () => setIsEditing(true)}
                disabled={loading}
              >
                {isEditing ? 'Sauvegarder' : 'Modifier'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom de l'entreprise"
                value={profileData.business_name || ''}
                onChange={(e) => setProfileData({...profileData, business_name: e.target.value})}
                disabled={!isEditing}
              />
              <Input
                label="Zone de service"
                value={profileData.service_area || ''}
                onChange={(e) => setProfileData({...profileData, service_area: e.target.value})}
                disabled={!isEditing}
              />
              <Input
                label="Téléphone"
                value={profileData.phone || ''}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
              />
              <Input
                label="CIN"
                value={profileData.national_id || ''}
                onChange={(e) => setProfileData({...profileData, national_id: e.target.value})}
                disabled={!isEditing}
              />
              {profileData.is_mobile && (
                <Input
                  label="Immatriculation véhicule"
                  value={profileData.vehicle_registration || ''}
                  onChange={(e) => setProfileData({...profileData, vehicle_registration: e.target.value})}
                  disabled={!isEditing}
                />
              )}
              {profileData.has_garage && (
                <Input
                  label="Adresse du garage"
                  value={profileData.garage_address || ''}
                  onChange={(e) => setProfileData({...profileData, garage_address: e.target.value})}
                  disabled={!isEditing}
                />
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                className="w-full p-3 border border-border rounded-md"
                rows={4}
                value={profileData.bio || ''}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                disabled={!isEditing}
                placeholder="Décrivez vos services et votre expérience..."
              />
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Add Service */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Ajouter un service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Nom du service"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                />
                <Input
                  placeholder="Prix (MAD)"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                />
                <Input
                  placeholder="Durée (minutes)"
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                />
                <Button onClick={addService} disabled={loading}>
                  <Icon name="Plus" size={16} />
                  Ajouter
                </Button>
              </div>
              <div className="mt-4">
                <Input
                  placeholder="Description du service"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
              </div>
            </div>

            {/* Services List */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mes services</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-4 border border-border rounded-md">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                      <p className="text-primary font-semibold">{service.price} MAD</p>
                      {service.duration && (
                        <p className="text-muted-foreground text-xs">{service.duration} minutes</p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
                {services.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">Aucun service ajouté</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Add Image */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Ajouter une image</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="URL de l'image"
                  value={newImage.image_url}
                  onChange={(e) => setNewImage({...newImage, image_url: e.target.value})}
                />
                <Input
                  placeholder="Légende (optionnel)"
                  value={newImage.caption}
                  onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
                />
                <Button onClick={addGalleryImage} disabled={loading}>
                  <Icon name="Plus" size={16} />
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Galerie photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gallery.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.image_url}
                      alt={image.caption || 'Gallery image'}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGalleryImage(image.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                    {image.caption && (
                      <p className="mt-2 text-sm text-muted-foreground">{image.caption}</p>
                    )}
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    Aucune image dans la galerie
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Réservations</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {booking.client_profiles?.first_name} {booking.client_profiles?.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Service: {booking.cleaner_services?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(booking.scheduled_date).toLocaleDateString('fr-FR')} à {booking.scheduled_time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Type: {booking.booking_type === 'mobile' ? 'Service mobile' : 'Au garage'}
                      </p>
                      {booking.location_address && (
                        <p className="text-sm text-muted-foreground">
                          Adresse: {booking.location_address}
                        </p>
                      )}
                      <p className="font-semibold text-primary">
                        {booking.total_amount} MAD
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-warning/10 text-warning' :
                        booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                        booking.status === 'completed' ? 'bg-accent/10 text-accent' :
                        'bg-error/10 text-error'
                      }`}>
                        {booking.status === 'pending' ? 'En attente' :
                         booking.status === 'confirmed' ? 'Confirmé' :
                         booking.status === 'completed' ? 'Terminé' :
                         booking.status}
                      </span>
                      {booking.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Refuser
                          </Button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                        >
                          Marquer terminé
                        </Button>
                      )}
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-muted-foreground text-center py-8">Aucune réservation</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanerDashboard;
