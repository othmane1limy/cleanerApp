
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Register = () => {
  const [userType, setUserType] = useState('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Cleaner specific fields
    nationalId: '',
    vehicleRegistration: '',
    businessLicense: '',
    businessName: '',
    serviceArea: '',
    isMobile: true,
    hasGarage: false,
    garageAddress: '',
    workingHours: {
      start: '08:00',
      end: '18:00'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Additional validation for cleaner accounts
    if (userType === 'cleaner') {
      if (!formData.nationalId.trim() || !formData.serviceArea.trim()) {
        setError('Veuillez remplir tous les champs obligatoires pour les nettoyeurs');
        setLoading(false);
        return;
      }
    }

    const userData = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone: formData.phone.trim(),
      ...(userType === 'cleaner' && {
        national_id: formData.nationalId.trim(),
        vehicle_registration: formData.vehicleRegistration.trim(),
        business_license: formData.businessLicense.trim(),
        business_name: formData.businessName.trim(),
        service_area: formData.serviceArea.trim(),
        is_mobile: formData.isMobile,
        has_garage: formData.hasGarage,
        garage_address: formData.garageAddress.trim(),
        working_hours: formData.workingHours
      })
    };

    try {
      console.log('Starting registration process...');
      
      const { data, error } = await signUp(
        formData.email.trim(),
        formData.password,
        userType,
        userData
      );
      
      console.log('Registration response:', { data, error });
      
      if (error) {
        console.error('Registration error:', error);
        setError(`Erreur lors de l'inscription: ${error.message}`);
      } else if (data?.user) {
        // Success - profile created automatically by database trigger
        setError('');
        alert(`✅ Compte créé avec succès! 

👤 Votre profil a été créé automatiquement.
🔗 Vous pouvez maintenant vous connecter à l'application.`);
        
        // Redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setError('Réponse inattendue du serveur. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('Registration exception:', err);
      setError(`Erreur inattendue: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={24} color="white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Créer un compte</h2>
          <p className="mt-2 text-muted-foreground">
            Rejoignez CleanFinder aujourd'hui
          </p>
        </div>

        {/* User Type Selection */}
        <div className="mb-8">
          <p className="text-sm font-medium text-foreground mb-4">Type de compte</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUserType('client')}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                userType === 'client'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Icon name="User" size={24} className="mx-auto mb-2" />
              <p className="font-medium">Client</p>
              <p className="text-xs">Je recherche des services de nettoyage</p>
            </button>
            <button
              type="button"
              onClick={() => setUserType('cleaner')}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                userType === 'cleaner'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Icon name="Briefcase" size={24} className="mx-auto mb-2" />
              <p className="font-medium">Nettoyeur</p>
              <p className="text-xs">Je propose des services de nettoyage</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error/10 border border-error text-error p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <Input
              name="email"
              type="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              name="phone"
              type="tel"
              placeholder="Numéro de téléphone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Cleaner Specific Fields */}
          {userType === 'cleaner' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations professionnelles</h3>
              
              <Input
                name="businessName"
                placeholder="Nom de l'entreprise"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />

              <Input
                name="nationalId"
                placeholder="Numéro CIN"
                value={formData.nationalId}
                onChange={handleInputChange}
                required
              />

              <Input
                name="businessLicense"
                placeholder="Numéro de licence commerciale"
                value={formData.businessLicense}
                onChange={handleInputChange}
              />

              <Input
                name="serviceArea"
                placeholder="Zone de service (ville/région)"
                value={formData.serviceArea}
                onChange={handleInputChange}
                required
              />

              {/* Service Type */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Type de service</p>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isMobile"
                      checked={formData.isMobile}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Service mobile
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasGarage"
                      checked={formData.hasGarage}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Garage fixe
                  </label>
                </div>
              </div>

              {formData.isMobile && (
                <Input
                  name="vehicleRegistration"
                  placeholder="Immatriculation du véhicule"
                  value={formData.vehicleRegistration}
                  onChange={handleInputChange}
                  required
                />
              )}

              {formData.hasGarage && (
                <Input
                  name="garageAddress"
                  placeholder="Adresse du garage"
                  value={formData.garageAddress}
                  onChange={handleInputChange}
                  required
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="workingHours.start"
                  type="time"
                  placeholder="Heure de début"
                  value={formData.workingHours.start}
                  onChange={handleInputChange}
                />
                <Input
                  name="workingHours.end"
                  type="time"
                  placeholder="Heure de fin"
                  value={formData.workingHours.end}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="h-12"
          >
            Créer mon compte
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
