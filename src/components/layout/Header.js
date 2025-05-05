// src/components/layout/Header.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import NotificationBell from '../notifications/NotificationBell';

const Header = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hasActiveTransactions, setHasActiveTransactions] = useState(false);
  const [activeTransactions, setActiveTransactions] = useState([]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if user has active transactions
  useEffect(() => {
    const checkForActiveTransactions = async () => {
      if (!currentUser) return;
      
      try {
        // For clients (buyers/sellers)
        const clientTransactionsQuery = query(
          collection(db, 'transactions'),
          where('clientId', '==', currentUser.uid),
          where('status', '==', 'active')
        );
        
        // For agents
        const agentTransactionsQuery = query(
          collection(db, 'transactions'),
          where('agentId', '==', currentUser.uid),
          where('status', '==', 'active')
        );
        
        const [clientResults, agentResults] = await Promise.all([
          getDocs(clientTransactionsQuery),
          getDocs(agentTransactionsQuery)
        ]);

        // Store transactions for potential use in dropdown
        const transactions = [];
        clientResults.forEach(doc => transactions.push({ id: doc.id, ...doc.data() }));
        agentResults.forEach(doc => transactions.push({ id: doc.id, ...doc.data() }));
        setActiveTransactions(transactions);
        
        setHasActiveTransactions(!clientResults.empty || !agentResults.empty);
      } catch (error) {
        console.error("Error checking for transactions:", error);
      }
    };
    
    checkForActiveTransactions();
  }, [currentUser]);
  
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
        alignItems: 'center',
        padding: '0 1rem'
      }}>
        <div>
          <Link 
            to="/" 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontSize: '1.75rem',
              fontWeight: 'bold'
            }}
          >
            <span style={{ color: '#000000' }}>no</span>
            <span style={{ color: '#ef4444' }}>3%</span>
          </Link>
        </div>
        
        {!isMobile && (
          <nav style={{ 
            display: 'flex', 
            gap: '2rem',
            alignItems: 'center'
          }}>
            {!currentUser ? (
              <>
                <Link 
                  to="/buyers" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  For Buyers
                </Link>
                <Link 
                  to="/sellers" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  For Sellers
                </Link>
                <Link 
                  to="/agents" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  For Agents
                </Link>
                <Link 
                  to="/services" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Services
                </Link>
                <Link 
                  to="/faq" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  FAQ
                </Link>
                <div style={{ height: '20px', width: '1px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }} />
                <Link 
                  to="/signin" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  style={{ 
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  Get Started
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
                
                {/* Transaction Link - Always visible, with prominent styling when there are active transactions */}
                <Link 
                  to="/transaction"
                  style={{
                    backgroundColor: hasActiveTransactions ? '#dcfce7' : 'transparent',
                    border: hasActiveTransactions ? '1px solid #86efac' : 'none',
                    color: hasActiveTransactions ? '#166534' : '#4b5563',
                    padding: hasActiveTransactions ? '0.5rem 1rem' : '0',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: hasActiveTransactions ? '600' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {hasActiveTransactions && (
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#10b981',
                      display: 'inline-block'
                    }}></span>
                  )}
                  Transactions
                  {hasActiveTransactions && (
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '9999px',
                      minWidth: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {activeTransactions.length}
                    </span>
                  )}
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
                      to="/buyer/create-listing" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Create Listing
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
                      to="/seller/create-listing" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Create Listing
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
                
                {/* Notification Bell */}
                <NotificationBell />
                
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
        )}
        
        {/* Mobile menu button */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Transaction Icon for Mobile - Only shows with active transactions */}
            {currentUser && hasActiveTransactions && (
              <Link 
                to="/transaction"
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '9999px',
                  minWidth: '1.5rem',
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginLeft: '0.25rem'
                }}>
                  {activeTransactions.length}
                </span>
              </Link>
            )}
            
            {/* Notification Bell for mobile */}
            {currentUser && <NotificationBell />}
            
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
        )}
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div 
          style={{ 
            padding: '1rem', 
            borderTop: '1px solid #e5e7eb',
            maxHeight: 'calc(100vh - 80px)',
            overflow: 'auto' 
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
                  to="/buyers" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Buyers
                </Link>
                <Link 
                  to="/sellers" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Sellers
                </Link>
                <Link 
                  to="/agents" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Agents
                </Link>
                <Link 
                  to="/services" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link 
                  to="/faq" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0.5rem 0' }} />
                <Link 
                  to="/signin" 
                  style={{ 
                    color: '#4b5563',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  style={{ 
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginTop: '0.5rem'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
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
                
                {/* Transaction Link for mobile */}
                <Link 
                  to="/transaction"
                  style={{
                    backgroundColor: hasActiveTransactions ? '#dcfce7' : 'transparent',
                    border: hasActiveTransactions ? '1px solid #86efac' : 'none',
                    color: hasActiveTransactions ? '#166534' : '#4b5563',
                    padding: hasActiveTransactions ? '0.75rem' : '0.5rem 0',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: hasActiveTransactions ? '600' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {hasActiveTransactions && (
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#10b981',
                        display: 'inline-block'
                      }}></span>
                    )}
                    Transactions
                  </div>
                  {hasActiveTransactions && (
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '9999px',
                      minWidth: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {activeTransactions.length}
                    </span>
                  )}
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
                      to="/buyer/create-listing" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Listing
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
                      to="/seller/create-listing" 
                      style={{ 
                        color: '#4b5563',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Listing
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