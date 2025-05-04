import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { login, currentUser, userProfile } = useAuth();
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        minHeight: '100vh'
      }}>
        {/* Left side - Form */}
        <div style={{ 
          padding: isMobile ? '1.5rem' : '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white'
        }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Link 
                to="/"
                style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 'bold', 
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}
              >
                <span style={{ color: '#000000' }}>no</span>
                <span style={{ color: '#ef4444' }}>3%</span>
              </Link>
              <h1 style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem', 
                fontWeight: '800', 
                marginBottom: '0.5rem',
                color: '#0f172a'
              }}>
                Welcome Back
              </h1>
              <p style={{ 
                color: '#64748b', 
                fontSize: isMobile ? '1rem' : '1.125rem',
                marginBottom: '2rem'
              }}>
                Sign in to access your real estate dashboard
              </p>
            </div>
            
            {error && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ 
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {/* Password Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <label 
                    htmlFor="password" 
                    style={{ 
                      fontWeight: '500',
                      color: '#374151'
                    }}
                  >
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      fontSize: '0.875rem', 
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500'
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
                  placeholder="Enter your password"
                  style={{ 
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                fullWidth
                disabled={loading}
                style={{
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem'
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              {/* Sign Up Link */}
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right side - Benefits - Hide on mobile */}
        {!isMobile && (
          <div style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            padding: '2rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                Welcome Back to Your Real Estate Control Center
              </h2>
              
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '3rem',
                opacity: '0.9',
                lineHeight: '1.6'
              }}>
                Pick up where you left off. Access your listings, proposals, and messages all in one place.
              </p>
              
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🏠</span>
                    For Buyers
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0,
                    margin: 0 
                  }}>
                    {['Review agent proposals', 'Track your home search', 'Manage saved listings'].map((benefit, index) => (
                      <li 
                        key={index}
                        style={{ 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1rem'
                        }}
                      >
                        <span style={{ color: '#93c5fd' }}>✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>💰</span>
                    For Sellers
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0,
                    margin: 0 
                  }}>
                    {['Compare agent offers', 'Track listing performance', 'Manage showings'].map((benefit, index) => (
                      <li 
                        key={index}
                        style={{ 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1rem'
                        }}
                      >
                        <span style={{ color: '#93c5fd' }}>✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🏆</span>
                    For Agents
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0,
                    margin: 0 
                  }}>
                    {['Find new clients', 'Submit proposals', 'Build your business'].map((benefit, index) => (
                      <li 
                        key={index}
                        style={{ 
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1rem'
                        }}
                      >
                        <span style={{ color: '#93c5fd' }}>✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                paddingTop: '2rem'
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      10,000+
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>
                      Active Users
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      $2.5M+
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>
                      Saved
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      4.9/5
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: '0.8' }}>
                      Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Benefits - Show on mobile */}
        {isMobile && (
          <div style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            padding: '2rem 1.5rem',
            color: 'white'
          }}>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Welcome Back!
            </h2>
            
            <p style={{ 
              fontSize: '1rem', 
              marginBottom: '2rem',
              textAlign: 'center',
              opacity: '0.9'
            }}>
              Your real estate dashboard awaits
            </p>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5rem'
            }}>
              <div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem'
                }}>
                  🏠 For Buyers
                </h3>
                <p style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Review proposals, track searches, manage listings
                </p>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem'
                }}>
                  💰 For Sellers
                </h3>
                <p style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Compare offers, track performance, manage showings
                </p>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem'
                }}>
                  🏆 For Agents
                </h3>
                <p style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Find clients, submit proposals, grow your business
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInPage;