import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { clientService } from '../../lib/supabase';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const EditClientProfile = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    if (profile && !authLoading) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.phone.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    try {
      const { error } = await clientService.updateProfile(user.id, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      });

      if (error) {
        setError(`Erreur lors de la mise à jour: ${error.message}`);
      } else {
        setSuccess('Profil mis à jour avec succès!');
        setTimeout(() => {
          navigate('/client-profile');
        }, 2000);
      }
    } catch (err) {
      setError(`Erreur inattendue: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

  if (user.user_metadata?.user_type === 'cleaner') {
    navigate('/cleaner-dashboard');
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client-profile')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Modifier le profil</h1>
                <p className="text-muted-foreground">Mettez à jour vos informations personnelles</p>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error text-error p-4 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success text-success p-4 rounded-md text-sm mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prénom *
                  </label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom *
                  </label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone *
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Votre numéro de téléphone"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Adresse
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Votre adresse complète"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/client-profile')}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditClientProfile;
