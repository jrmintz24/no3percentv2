import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { signup, currentUser } = useAuth();
  
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

  const userTypeOptions = [
    {
      value: 'buyer',
      label: 'Home Buyer',
      icon: '🏠',
      description: 'Find your dream home with expert agents',
      benefits: ['Get rebates', 'Compare agents', 'Save money']
    },
    {
      value: 'seller',
      label: 'Home Seller',
      icon: '💰',
      description: 'Sell your property for more, pay less',
      benefits: ['Save on commission', 'Choose services', 'Control the process']
    },
    {
      value: 'agent',
      label: 'Real Estate Agent',
      icon: '🏆',
      description: 'Connect with motivated clients',
      benefits: ['Quality leads', 'Grow your business', 'Set your rates']
    }
  ];
  
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
                  color: '#2563eb',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}
              >
                RealEstateMatch
              </Link>
              <h1 style={{ 
                fontSize: isMobile ? '1.75rem' : '2rem', 
                fontWeight: '800', 
                marginBottom: '0.5rem',
                color: '#0f172a'
              }}>
                Create Your Account
              </h1>
              <p style={{ 
                color: '#64748b', 
                fontSize: isMobile ? '1rem' : '1.125rem',
                marginBottom: '2rem'
              }}>
                Join thousands saving money on real estate
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
              {/* User Type Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  I want to:
                </label>
                
                <div style={{ 
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {userTypeOptions.map((option) => (
                    <label 
                      key={option.value}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        border: `2px solid ${userType === option.value ? '#3b82f6' : '#e5e7eb'}`,
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        backgroundColor: userType === option.value ? '#eff6ff' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={option.value}
                        checked={userType === option.value}
                        onChange={() => setUserType(option.value)}
                        style={{ display: 'none' }}
                      />
                      <div style={{ 
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: userType === option.value ? '#dbeafe' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                        fontSize: '1.5rem',
                        flexShrink: 0
                      }}>
                        {option.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          {option.label}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          wordBreak: 'break-word'
                        }}>
                          {option.description}
                        </div>
                      </div>
                      <div style={{ 
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '50%',
                        border: `2px solid ${userType === option.value ? '#3b82f6' : '#d1d5db'}`,
                        backgroundColor: userType === option.value ? '#3b82f6' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }}>
                        {userType === option.value && (
                          <div style={{ 
                            width: '0.5rem',
                            height: '0.5rem',
                            borderRadius: '50%',
                            backgroundColor: 'white'
                          }} />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Name Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="displayName" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: '#374151'
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
                  placeholder="Enter your full name"
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
                <label 
                  htmlFor="password" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: '#374151'
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
                  placeholder="Create a password"
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
              
              {/* Confirm Password Input */}
              <div style={{ marginBottom: '2rem' }}>
                <label 
                  htmlFor="confirmPassword" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: '#374151'
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
                  placeholder="Confirm your password"
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
                {loading ? 'Creating Account...' : 'Create My Account'}
              </Button>
              
              {/* Sign In Link */}
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                Already have an account?{' '}
                <Link 
                  to="/signin" 
                  style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Sign In
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
                Join the Future of Real Estate
              </h2>
              
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '3rem',
                opacity: '0.9',
                lineHeight: '1.6'
              }}>
                Experience a transparent, competitive marketplace where you control every aspect of your real estate journey.
              </p>
              
              <div style={{ marginBottom: '3rem' }}>
                {userTypeOptions.map((option) => (
                  <div 
                    key={option.value}
                    style={{ 
                      marginBottom: '2rem',
                      opacity: userType === option.value ? '1' : '0.6',
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                      {option.label} Benefits
                    </h3>
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0,
                      margin: 0 
                    }}>
                      {option.benefits.map((benefit, index) => (
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
                ))}
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
                      Happy Users
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
              Why Join?
            </h2>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {userTypeOptions.map((option) => (
                <div 
                  key={option.value}
                  style={{ 
                    opacity: userType === option.value ? '1' : '0.7'
                  }}
                >
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem'
                  }}>
                    {option.icon} {option.label}
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0,
                    margin: 0 
                  }}>
                    {option.benefits.map((benefit, index) => (
                      <li 
                        key={index}
                        style={{ 
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span>✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              textAlign: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>10K+</div>
                <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Users</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>$2.5M+</div>
                <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Saved</div>
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>4.9/5</div>
                <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;