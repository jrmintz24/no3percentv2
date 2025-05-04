import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

const SignInPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, currentUser, userProfile } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      const redirectPath = getRoleBasedRoute(userProfile);
      navigate(redirectPath);
    }
  }, [currentUser, userProfile, navigate]);
  
  const getRoleBasedRoute = (profile) => {
    if (profile?.isAdmin) {
      return '/admin/dashboard';
    }
    
    switch (profile?.userType) {
      case 'buyer':
        return '/buyer/dashboard';
      case 'seller':
        return '/seller/dashboard';
      case 'agent':
        return '/agent/dashboard';
      default:
        return '/';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Sign in the user
      const userCredential = await login(email, password);
      
      // Get the user document from Firestore to determine role
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const redirectPath = getRoleBasedRoute(userData);
        navigate(redirectPath);
      } else {
        // If no user document exists, redirect to home
        navigate('/');
      }
      
    } catch (err) {
      console.error('Error during sign in:', err);
      setError('Failed to sign in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Card>
        <CardHeader>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Sign In to Your Account
          </h1>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardBody>
            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                padding: '1rem', 
                borderRadius: '0.375rem', 
                marginBottom: '1rem' 
              }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <label 
                  htmlFor="password" 
                  style={{ fontWeight: '500' }}
                >
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  style={{ 
                    fontSize: '0.875rem', 
                    color: '#2563eb',
                    textDecoration: 'none'
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db'
                }}
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div style={{ marginBottom: '1rem' }}>
              <Button 
                type="submit" 
                fullWidth
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>Sign Up</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;