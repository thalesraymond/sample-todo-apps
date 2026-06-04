import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import './Auth.css';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err instanceof Error ? err.message : 'Non-error thrown');
    }
  };

  return (
    <div className="auth-container">
      <Card title="Login" className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-alert" role="alert">{error}</div>}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
