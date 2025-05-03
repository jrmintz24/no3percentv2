// src/pages/AgentPages/AgentDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TokenDashboard from '../../components/agents/TokenManagement/TokenDashboard';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { collection, query, where, getDocs, count } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const AgentDashboardPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState({
    proposals: 0,
    listings: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        
        setStats({
          proposals: proposalsSnapshot.size,
          listings: buyerListingsSnapshot.size + sellerListingsSnapshot.size,
          clients: clientsSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching agent dashboard stats:", error);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Agent Dashboard
        </h1>
        <Button to="/agent/buy-tokens">
          Buy More Tokens
        </Button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        borderLeft: '4px solid #2563eb'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome, {userProfile?.displayName || 'Agent'}!
        </h2>
        <p style={{ margin: 0 }}>
          Your dashboard gives you access to all buyer and seller listings, allowing you to submit proposals and manage clients.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', margin: '0 auto 1rem', color: '#2563eb' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              Active Proposals
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem', textAlign: 'center' }}>
              {loading ? '...' : stats.proposals}
            </div>
            <Button to="/agent/proposals" variant="secondary" fullWidth>
              View Proposals
            </Button>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', margin: '0 auto 1rem', color: '#2563eb' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              Available Listings
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem', textAlign: 'center' }}>
              {loading ? '...' : stats.listings}
            </div>
            <Button to="/agent/listings" variant="secondary" fullWidth>
              Browse Listings
            </Button>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div style={{ textAlign: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', margin: '0 auto 1rem', color: '#2563eb' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
              Active Clients
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem', textAlign: 'center' }}>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Recent Activity
              </h3>
            </CardHeader>
            <CardBody>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 0',
                color: '#6b7280'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', marginBottom: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No recent activity to display</p>
              </div>
            </CardBody>
          </Card>
          
          <div style={{ marginTop: '2rem' }}>
            <Card>
              <CardHeader>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                  Getting Started
                </h3>
              </CardHeader>
              <CardBody>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    1. Browse Available Listings
                  </h4>
                  <p>
                    Explore buyer and seller listings to find opportunities that match your expertise.
                  </p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    2. Submit Competitive Proposals
                  </h4>
                  <p>
                    Each proposal requires one token. Customize your services and pricing to stand out to potential clients.
                  </p>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    3. Manage Client Relationships
                  </h4>
                  <p>
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
            <CardHeader>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Market Insights
              </h3>
            </CardHeader>
            <CardBody>
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
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