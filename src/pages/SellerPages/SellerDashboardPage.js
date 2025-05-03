// src/pages/SellerPages/SellerDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, count } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const SellerDashboardPage = () => {
  const { currentUser, userProfile } = useAuth();
  
  const [stats, setStats] = useState({
    listings: 0,
    proposals: 0,
    activity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
        
        setStats({
          listings: listingsSnapshot.size,
          proposals: totalProposals,
          activity: 0 // This can be replaced with actual market activity data
        });
        
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Seller Dashboard
        </h1>
        
        <Button to="/seller/create-listing">
          Create Listing
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
          Welcome, {userProfile?.displayName || 'Seller'}!
        </h2>
        <p style={{ margin: 0 }}>
          Your dashboard gives you access to your property listings and agent proposals.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" style={{ width: '2.5rem', height: '2.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              My Listings
            </h3>
            <div style={{ 
              fontSize: '3rem',
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
                fontWeight: '500'
              }}
            >
              View Listings
            </Link>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" style={{ width: '2.5rem', height: '2.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Agent Proposals
            </h3>
            <div style={{ 
              fontSize: '3rem',
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
                fontWeight: '500'
              }}
            >
              View Proposals
            </Link>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" style={{ width: '2.5rem', height: '2.5rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Market Activity
            </h3>
            <div style={{ 
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              marginBottom: '1.5rem'
            }}>
              {loading ? '...' : stats.activity}
            </div>
            <Link 
              to="/seller/analytics"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#4f46e5',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              View Analytics
            </Link>
          </CardBody>
        </Card>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Getting Started
            </h2>
          </CardHeader>
          <CardBody>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                1. Create a Property Listing
              </h3>
              <p>
                Start by creating a property listing with detailed information about your home. The more details you provide, the better agent proposals you'll receive.
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                2. Review Agent Proposals
              </h3>
              <p>
                Real estate agents will submit proposals to represent your listing. Compare their services, commission rates, and strategies.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                3. Connect with Your Agent
              </h3>
              <p>
                Once you accept a proposal, you'll be connected with your chosen agent to begin the selling process.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboardPage;