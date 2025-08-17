import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
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

    try {
      console.log('Attempting login for:', formData.email);
      
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        setError(`Erreur de connexion: ${error.message}`);
        return;
      }

      if (data?.user) {
        console.log('Login successful:', data.user);
        
        const userType = data.user.user_metadata?.user_type;
        console.log('User type:', userType);
        
        // Show success message
        console.log('Redirecting user...');
        
        // Redirect based on user type
        if (userType === 'cleaner') {
          navigate('/cleaner-dashboard');
        } else {
          navigate('/client-profile');
        }
      } else {
        setError('Réponse inattendue du serveur');
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError(`Erreur inattendue: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Connexion</h2>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 space-y-6">
          {error && (
            <div className="bg-error/10 border border-error text-error p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
              className="w-full"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;