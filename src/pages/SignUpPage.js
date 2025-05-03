import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../components/common/Card';
import { Button } from '../components/common/Button';

// Helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const initialUserType = query.get('type') || '';
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState(initialUserType);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, currentUser } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (!userType) {
      return setError('Please select a user type');
    }
    
    try {
      setError('');
      setLoading(true);
      
      await signup(email, password, displayName, userType);
      
      // Redirect to appropriate dashboard
      navigate(`/${userType}`);
    } catch (err) {
      console.error('Error during sign up:', err);
      setError('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Card>
        <CardHeader>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Create Your Account
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
                htmlFor="displayName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Full Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db'
                }}
              />
            </div>
            
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
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Password
              </label>
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
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="confirmPassword" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                I am a:
              </label>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="buyer"
                    checked={userType === 'buyer'}
                    onChange={() => setUserType('buyer')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Buyer
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="seller"
                    checked={userType === 'seller'}
                    onChange={() => setUserType('seller')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Seller
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="userType"
                    value="agent"
                    checked={userType === 'agent'}
                    onChange={() => setUserType('agent')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Agent
                </label>
              </div>
            </div>
          </CardBody>
          
          <CardFooter>
            <div style={{ marginBottom: '1rem' }}>
              <Button 
                type="submit" 
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              Already have an account? <Link to="/signin" style={{ color: '#2563eb', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;