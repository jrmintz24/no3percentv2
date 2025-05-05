// src/pages/SellerPages/SellerDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const SellerDashboardPage = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    listings: 0,
    proposals: 0,
    interested: 0
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
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        if (!currentUser) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        // Fetch count of seller's listings
        const listingsQuery = query(
          collection(db, 'sellerListings'),
          where('userId', '==', currentUser.uid)
        );
        const listingsSnapshot = await getDocs(listingsQuery);
        
        // Fetch count of proposals for seller's listings
        const proposalsPromises = [];
        
        listingsSnapshot.forEach((doc) => {
          const listingId = doc.id;
          const proposalQuery = query(
            collection(db, 'proposals'),
            where('listingId', '==', listingId),
            where('listingType', '==', 'seller')
          );
          proposalsPromises.push(getDocs(proposalQuery));
        });
        
        const proposalSnapshots = await Promise.all(proposalsPromises);
        
        // Calculate total proposals count
        let totalProposals = 0;
        proposalSnapshots.forEach((snapshot) => {
          totalProposals += snapshot.size;
        });

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
          listings: listingsSnapshot.size,
          proposals: totalProposals,
          interested: totalProposals // For now, we'll use total proposals as a proxy for interested agents
        });
        
        setRecentMessages(messages);
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Error loading dashboard information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, [currentUser]);
  
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
          Seller Dashboard
        </h1>
        
        <Button 
          to="/seller/create-listing"
          style={isMobile ? { width: '100%' } : {}}
        >
          Create Listing
        </Button>
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
          Welcome, {userProfile?.displayName || 'Seller'}!
        </h2>
        <p style={{ 
          margin: 0,
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Your dashboard gives you access to your property listings and agent proposals.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '1rem' : '2rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardBody style={{ 
            textAlign: 'center', 
            padding: isMobile ? '1.5rem' : '2rem' 
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" style={{ width: '2.5rem', height: '2.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              My Listings
            </h3>
            <div style={{ 
              fontSize: isMobile ? '2.5rem' : '3rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              marginBottom: '1.5rem'
            }}>
              {loading ? '...' : stats.listings}
            </div>
            <Link 
              to="/seller/my-listings"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#4f46e5',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              View Listings
            </Link>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody style={{ 
            textAlign: 'center', 
            padding: isMobile ? '1.5rem' : '2rem' 
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" style={{ width: '2.5rem', height: '2.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Agent Proposals
            </h3>
            <div style={{ 
              fontSize: isMobile ? '2.5rem' : '3rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              marginBottom: '1.5rem'
            }}>
              {loading ? '...' : stats.proposals}
            </div>
            <Link 
              to="/seller/proposals"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#4f46e5',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              View Proposals
            </Link>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody style={{ 
            textAlign: 'center', 
            padding: isMobile ? '1.5rem' : '2rem' 
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" style={{ width: '2.5rem', height: '2.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Interested Agents
            </h3>
            <div style={{ 
              fontSize: isMobile ? '2.5rem' : '3rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              marginBottom: '1.5rem'
            }}>
              {loading ? '...' : stats.interested}
            </div>
            <Link 
              to="/seller/proposals"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#4f46e5',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              View Agents
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Recent Messages Section */}
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <h2 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              Recent Messages
            </h2>
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
                      onClick={() => navigate(`/seller/messages/${message.id}`)}
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
                  onClick={() => navigate('/seller/messages')}
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
                <Button
                  onClick={() => navigate('/seller/messages')}
                  variant="secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Go to Messages
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <h2 style={{ 
              fontSize: isMobile ? '1rem' : '1.25rem', 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              Getting Started
            </h2>
          </CardHeader>
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '0.875rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                1. Create Your Property Listing
              </h3>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '1rem',
                lineHeight: '1.5'
              }}>
                Start by creating a listing with your property details. The more information you provide, the better proposals you'll receive from agents.
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '0.875rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                2. Review Agent Proposals
              </h3>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '1rem',
                lineHeight: '1.5'
              }}>
                Real estate agents will submit proposals for your listing. Compare their services, commission rates, and marketing strategies.
              </p>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: isMobile ? '0.875rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                3. Choose Your Agent
              </h3>
              <p style={{ 
                fontSize: isMobile ? '0.875rem' : '1rem',
                lineHeight: '1.5'
              }}>
                Accept the proposal that best fits your needs. You'll be connected with your chosen agent to begin the selling process.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboardPage;