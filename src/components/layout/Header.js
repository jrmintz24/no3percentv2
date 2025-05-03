import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  // Check if user is admin
  const isAdmin = userProfile?.isAdmin === true;
  
  return (
    <header style={{ 
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Link 
            to="/" 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#2563eb',
              textDecoration: 'none'
            }}
          >
            RealEstateMatch
          </Link>
        </div>
        
        <div className="hidden md:block">
          <nav style={{ 
            display: 'flex', 
            gap: '2rem'
          }}>
            {!currentUser ? (
              <>
                <Link 
                  to="/signin" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to={userProfile?.userType ? `/${userProfile.userType}` : '/'} 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Dashboard
                </Link>
                
                {userProfile?.userType === 'agent' && (
                  <>
                    <Link 
                      to="/agent/search" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Search
                    </Link>
                    <Link 
                      to="/agent/proposals" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      My Proposals
                    </Link>
                    <Link 
                      to="/agent/messages" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {userProfile?.userType === 'buyer' && (
                  <>
                    <Link 
                      to="/buyer/my-listings" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      My Listings
                    </Link>
                    <Link 
                      to="/buyer/proposals" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Proposals
                    </Link>
                    <Link 
                      to="/buyer/messages" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {userProfile?.userType === 'seller' && (
                  <>
                    <Link 
                      to="/seller/my-listings" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      My Listings
                    </Link>
                    <Link 
                      to="/seller/proposals" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Proposals
                    </Link>
                    <Link 
                      to="/seller/messages" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {/* Admin section */}
                {isAdmin && (
                  <Link 
                    to="/admin/verification-requests" 
                    style={{ 
                      color: '#4b5563',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Verification Requests
                  </Link>
                )}
                
                <Link 
                  to={`/${userProfile?.userType}/profile`} 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  My Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.5rem', width: '1.5rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden"
          style={{ 
            padding: '1rem', 
            borderTop: '1px solid #e5e7eb' 
          }}
        >
          <nav style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem' 
          }}>
            {!currentUser ? (
              <>
                <Link 
                  to="/signin" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to={userProfile?.userType ? `/${userProfile.userType}` : '/'} 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {userProfile?.userType === 'agent' && (
                  <>
                    <Link 
                      to="/agent/search" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Search
                    </Link>
                    <Link 
                      to="/agent/proposals" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Proposals
                    </Link>
                    <Link 
                      to="/agent/messages" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {userProfile?.userType === 'buyer' && (
                  <>
                    <Link 
                      to="/buyer/my-listings" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Listings
                    </Link>
                    <Link 
                      to="/buyer/proposals" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Proposals
                    </Link>
                    <Link 
                      to="/buyer/messages" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {userProfile?.userType === 'seller' && (
                  <>
                    <Link 
                      to="/seller/my-listings" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Listings
                    </Link>
                    <Link 
                      to="/seller/proposals" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Proposals
                    </Link>
                    <Link 
                      to="/seller/messages" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </>
                )}
                
                {/* Admin section for mobile */}
                {isAdmin && (
                  <Link 
                    to="/admin/verification-requests" 
                    style={{ 
                      color: '#4b5563',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Verification Requests
                  </Link>
                )}
                
                <Link 
                  to={`/${userProfile?.userType}/profile`} 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;