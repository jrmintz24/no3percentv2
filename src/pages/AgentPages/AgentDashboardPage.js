// src/pages/AgentPages/AgentDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TokenDashboard from '../../components/agents/TokenManagement/TokenDashboard';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { subscriptionTiers } from '../../config/subscriptions';

const AgentDashboardPage = () => {
  const { currentUser, userProfile, getUserSubscriptionTier } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    proposals: 0,
    listings: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [recentMessages, setRecentMessages] = useState([]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        
        // Fetch count of agent's active proposals
        const proposalsQuery = query(
          collection(db, 'proposals'),
          where('agentId', '==', currentUser.uid)
        );
        const proposalsSnapshot = await getDocs(proposalsQuery);
        
        // Fetch count of available listings (both buyer and seller)
        const buyerListingsQuery = query(collection(db, 'buyerListings'));
        const sellerListingsQuery = query(collection(db, 'sellerListings'));
        
        const buyerListingsSnapshot = await getDocs(buyerListingsQuery);
        const sellerListingsSnapshot = await getDocs(sellerListingsQuery);
        
        // Count active client relationships (accepted proposals)
        const clientsQuery = query(
          collection(db, 'proposals'),
          where('agentId', '==', currentUser.uid),
          where('status', '==', 'Accepted')
        );
        const clientsSnapshot = await getDocs(clientsQuery);

        // Fetch recent messages
        const messagesQuery = query(
          collection(db, 'messageChannels'),
          where('participants', 'array-contains', currentUser.uid),
          orderBy('lastMessageTime', 'desc'),
          limit(5)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = [];
        
        messagesSnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        
        setStats({
          proposals: proposalsSnapshot.size,
          listings: buyerListingsSnapshot.size + sellerListingsSnapshot.size,
          clients: clientsSnapshot.size,
        });
        
        setRecentMessages(messages);
      } catch (error) {
        console.error("Error fetching agent dashboard stats:", error);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  // Get the current subscription tier
  const currentTier = getUserSubscriptionTier(userProfile);
  
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem 1rem' 
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '1rem' : '0',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: isMobile ? '1.25rem' : '1.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Agent Dashboard
        </h1>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem' 
        }}>
          <Button to="/agent/subscription" variant="secondary" style={isMobile ? { width: '100%' } : {}}>
            Manage Subscription
          </Button>
          <Button to="/agent/buy-tokens" style={isMobile ? { width: '100%' } : {}}>
            Buy More Tokens
          </Button>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: isMobile ? '1rem' : '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        borderLeft: '4px solid #2563eb'
      }}>
        <h2 style={{ 
          fontSize: isMobile ? '1rem' : '1.25rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem' 
        }}>
          Welcome, {userProfile?.displayName || 'Agent'}!
        </h2>
        <p style={{ 
          margin: '0 0 0.5rem 0',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Your dashboard gives you access to all buyer and seller listings, allowing you to submit proposals and manage clients.
        </p>
        <p style={{ 
          margin: 0, 
          fontWeight: '500',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Current Plan: <strong>{currentTier?.name || 'Starter'}</strong>
          {currentTier?.id !== 'starter' && (
            <span> - {currentTier?.monthlyTokens} tokens included monthly</span>
          )}
        </p>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', margin: '0 auto 1rem', color: '#2563eb' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              textAlign: 'center' 
            }}>
              Active Proposals
            </h3>
            <div style={{ 
              fontSize: isMobile ? '1.75rem' : '2rem', 
              fontWeight: 'bold', 
              color: '#2563eb', 
              marginBottom: '1rem', 
              textAlign: 'center' 
            }}>
              {loading ? '...' : stats.proposals}
            </div>
            <Button to="/agent/proposals" variant="secondary" fullWidth>
              View Proposals
            </Button>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', margin: '0 auto 1rem', color: '#2563eb' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              textAlign: 'center' 
            }}>
              Available Listings
            </h3>
            <div style={{ 
              fontSize: isMobile ? '1.75rem' : '2rem', 
              fontWeight: 'bold', 
              color: '#2563eb', 
              marginBottom: '1rem', 
              textAlign: 'center' 
            }}>
              {loading ? '...' : stats.listings}
            </div>
            <Button to="/agent/listings" variant="secondary" fullWidth>
              Browse Listings
            </Button>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', margin: '0 auto 1rem', color: '#2563eb' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              textAlign: 'center' 
            }}>
              Active Clients
            </h3>
            <div style={{ 
              fontSize: isMobile ? '1.75rem' : '2rem', 
              fontWeight: 'bold', 
              color: '#2563eb', 
              marginBottom: '1rem', 
              textAlign: 'center' 
            }}>
              {loading ? '...' : stats.clients}
            </div>
            <Button to="/agent/clients" variant="secondary" fullWidth>
              View Clients
            </Button>
          </CardBody>
        </Card>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <Card>
            <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '1rem' : '1.25rem', 
                fontWeight: 'bold', 
                margin: 0 
              }}>
                Recent Messages
              </h3>
            </CardHeader>
            <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              {recentMessages.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentMessages.map((message) => {
                    const otherParticipantId = message.participants.find(id => id !== currentUser.uid);
                    const otherParticipant = message.participantInfo?.[otherParticipantId];
                    
                    return (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => navigate(`/agent/messages/${message.id}`)}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: '500' }}>
                            {otherParticipant?.name || 'Unknown User'}
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                            {message.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {message.lastMessageTime?.toDate()?.toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    onClick={() => navigate('/agent/messages')}
                    variant="secondary"
                    fullWidth
                  >
                    View All Messages
                  </Button>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem 0',
                  color: '#6b7280'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', marginBottom: '1rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>No messages yet</p>
                </div>
              )}
            </CardBody>
          </Card>
          
          <div style={{ marginTop: '2rem' }}>
            <Card>
              <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <h3 style={{ 
                  fontSize: isMobile ? '1rem' : '1.25rem', 
                  fontWeight: 'bold', 
                  margin: 0 
                }}>
                  Getting Started
                </h3>
              </CardHeader>
              <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    fontSize: isMobile ? '0.875rem' : '1rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem' 
                  }}>
                    1. Browse Available Listings
                  </h4>
                  <p style={{ 
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    lineHeight: '1.5'
                  }}>
                    Explore buyer and seller listings to find opportunities that match your expertise.
                  </p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ 
                    fontSize: isMobile ? '0.875rem' : '1rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem' 
                  }}>
                    2. Submit Competitive Proposals
                  </h4>
                  <p style={{ 
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    lineHeight: '1.5'
                  }}>
                    Each proposal requires one token. Customize your services and pricing to stand out to potential clients.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ 
                    fontSize: isMobile ? '0.875rem' : '1rem', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem' 
                  }}>
                    3. Manage Client Relationships
                  </h4>
                  <p style={{ 
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    lineHeight: '1.5'
                  }}>
                    Once your proposal is accepted, use our tools to communicate with clients and track progress.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        
        <div>
          <TokenDashboard />
          
          <Card style={{ marginTop: '2rem' }}>
            <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '1rem' : '1.25rem', 
                fontWeight: 'bold', 
                margin: 0 
              }}>
                Your Subscription
              </h3>
            </CardHeader>
            <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                gap: isMobile ? '1rem' : '0'
              }}>
                <div>
                  <h4 style={{ 
                    fontSize: isMobile ? '1.25rem' : '1.5rem', 
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    {currentTier?.name || 'Starter'} Plan
                  </h4>
                  <p style={{ 
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    {currentTier?.monthlyTokens > 0 
                      ? `${currentTier.monthlyTokens} tokens included monthly`
                      : 'Pay as you go pricing'
                    }
                  </p>
                </div>
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ 
                    fontSize: isMobile ? '1.25rem' : '1.5rem', 
                    fontWeight: '700',
                    color: '#2563eb'
                  }}>
                    ${currentTier?.price || 0}
                  </div>
                  <div style={{ 
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    per month
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ 
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: '#374151',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Current Benefits:
                </h5>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1.25rem', 
                  fontSize: '0.875rem',
                  color: '#4b5563'
                }}>
                  {currentTier?.features.slice(0, 3).map((feature, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {feature}
                    </li>
                  ))}
                  {currentTier?.features.length > 3 && (
                    <li style={{ color: '#6b7280', fontStyle: 'italic' }}>
                      And {currentTier.features.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>

              {currentTier?.id === 'starter' && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ 
                    fontSize: '0.875rem',
                    margin: '0 0 0.5rem 0',
                    color: '#1e40af',
                    fontWeight: '500'
                  }}>
                    Upgrade to Professional
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem',
                    margin: 0,
                    color: '#3b82f6'
                  }}>
                    Get 10 tokens monthly, featured profile, and save 20% on additional tokens!
                  </p>
                </div>
              )}

              <Button 
                to="/agent/subscription" 
                variant={currentTier?.id === 'enterprise' ? 'secondary' : 'primary'}
                fullWidth
              >
                {currentTier?.id === 'enterprise' ? 'View Plan Details' : 'Upgrade Plan'}
              </Button>
            </CardBody>
          </Card>
          
          <Card style={{ marginTop: '2rem' }}>
            <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '1rem' : '1.25rem', 
                fontWeight: 'bold', 
                margin: 0 
              }}>
                Market Insights
              </h3>
            </CardHeader>
            <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
              <p style={{ 
                marginBottom: '1rem', 
                fontSize: '0.875rem' 
              }}>
                Stay updated with market trends and insights.
              </p>
              <div style={{ 
                backgroundColor: '#f3f4f6',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                marginBottom: '0.75rem',
                fontSize: '0.875rem'
              }}>
                <p style={{ margin: 0, fontWeight: '500' }}>Average commission rate:</p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#2563eb', fontWeight: 'bold' }}>2.5% - 3%</p>
              </div>
              <div style={{ 
                backgroundColor: '#f3f4f6',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                <p style={{ margin: 0, fontWeight: '500' }}>Most requested services:</p>
                <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem' }}>
                  <li>Comparative Market Analysis</li>
                  <li>Negotiation Representation</li>
                  <li>Contract Review</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboardPage;