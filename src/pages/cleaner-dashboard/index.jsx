
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
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
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
      loadServices();
    }
  }, [profile]);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('cleaner_services')
      .select('*')
      .eq('cleaner_id', user.id);
    
    if (!error) {
      setServices(data);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('cleaner_profiles')
      .update(profileData)
      .eq('user_id', user.id);
    
    if (!error) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const addService = async () => {
    const { error } = await supabase
      .from('cleaner_services')
      .insert({
        cleaner_id: user.id,
        ...newService
      });
    
    if (!error) {
      setNewService({ name: '', price: '', description: '' });
      loadServices();
    }
  };

  const deleteService = async (serviceId) => {
    const { error } = await supabase
      .from('cleaner_services')
      .delete()
      .eq('id', serviceId);
    
    if (!error) {
      loadServices();
    }
  };

  const toggleStatus = async () => {
    const newStatus = !profileData.is_active;
    const { error } = await supabase
      .from('cleaner_profiles')
      .update({ is_active: newStatus })
      .eq('user_id', user.id);
    
    if (!error) {
      setProfileData(prev => ({ ...prev, is_active: newStatus }));
    }
  };

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
              iconName={profileData.is_active ? "CheckCircle" : "Circle"}
            >
              {profileData.is_active ? 'En ligne' : 'Hors ligne'}
            </Button>
            <Button variant="outline" onClick={signOut}>
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-6">
          {[
            { id: 'profile', label: 'Profil', icon: 'User' },
            { id: 'services', label: 'Services', icon: 'Briefcase' },
            { id: 'bookings', label: 'Réservations', icon: 'Calendar' },
            { id: 'analytics', label: 'Statistiques', icon: 'BarChart' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Informations du profil</h2>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? updateProfile() : setIsEditing(true)}
                loading={loading}
              >
                {isEditing ? 'Sauvegarder' : 'Modifier'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Nom de l'entreprise"
                  value={profileData.business_name || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, business_name: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Zone de service"
                  value={profileData.service_area || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, service_area: e.target.value }))}
                  disabled={!isEditing}
                />
                <Input
                  label="Téléphone"
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.is_mobile || false}
                      onChange={(e) => setProfileData(prev => ({ ...prev, is_mobile: e.target.checked }))}
                      disabled={!isEditing}
                      className="mr-2"
                    />
                    Service mobile
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.has_garage || false}
                      onChange={(e) => setProfileData(prev => ({ ...prev, has_garage: e.target.checked }))}
                      disabled={!isEditing}
                      className="mr-2"
                    />
                    Garage fixe
                  </label>
                </div>
                
                {profileData.has_garage && (
                  <Input
                    label="Adresse du garage"
                    value={profileData.garage_address || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, garage_address: e.target.value }))}
                    disabled={!isEditing}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Mes services</h2>
            </div>

            {/* Add New Service */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Ajouter un service</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Nom du service"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Prix (MAD)"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                />
                <Button onClick={addService} disabled={!newService.name || !newService.price}>
                  Ajouter
                </Button>
              </div>
              <Input
                placeholder="Description du service"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                className="mt-4"
              />
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="bg-card p-4 rounded-lg border flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <p className="text-primary font-medium">{service.price} MAD</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteService(service.id)}
                    iconName="Trash2"
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'bookings' && (
          <div className="text-center py-12">
            <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Réservations</h3>
            <p className="text-muted-foreground">La gestion des réservations sera disponible bientôt.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <Icon name="BarChart" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
            <p className="text-muted-foreground">Les analytics seront disponibles bientôt.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanerDashboard;
