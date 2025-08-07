
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      const userType = data.user.user_metadata?.user_type;
      if (userType === 'cleaner') {
        navigate('/cleaner-dashboard');
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={24} color="white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Se connecter</h2>
          <p className="mt-2 text-muted-foreground">
            Connectez-vous à votre compte CleanFinder
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error/10 border border-error text-error p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="h-12"
          >
            Se connecter
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
