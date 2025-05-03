// src/components/buyer/BuyerProposals.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const BuyerProposals = () => {
  const { currentUser } = useAuth();
  
  const [proposals, setProposals] = useState([]);
  const [listings, setListings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchListingsAndProposals = async () => {
      try {
        setLoading(true);
        
        // First, get the user's listings
        const listingsQuery = query(
          collection(db, 'buyerListings'),
          where('userId', '==', currentUser.uid)
        );
        
        const listingsSnapshot = await getDocs(listingsQuery);
        const listingsData = {};
        const listingIds = [];
        
        listingsSnapshot.forEach((doc) => {
          const listingData = { id: doc.id, ...doc.data() };
          listingsData[doc.id] = listingData;
          listingIds.push(doc.id);
        });
        
        setListings(listingsData);
        
        // Then, get all proposals for these listings
        if (listingIds.length > 0) {
          // Need to create separate queries if there are many listing IDs
          // Firebase "in" queries are limited to 10 values
          const batchSize = 10;
          let allProposals = [];
          
          for (let i = 0; i < listingIds.length; i += batchSize) {
            const batch = listingIds.slice(i, i + batchSize);
            
            const proposalsQuery = query(
              collection(db, 'proposals'),
              where('listingId', 'in', batch),
              where('listingType', '==', 'buyer'),
              orderBy('createdAt', 'desc')
            );
            
            const proposalsSnapshot = await getDocs(proposalsQuery);
            
            proposalsSnapshot.forEach((doc) => {
              allProposals.push({ id: doc.id, ...doc.data() });
            });
          }
          
          setProposals(allProposals);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Error loading proposals');
      } finally {
        setLoading(false);
      }
    };
    
    fetchListingsAndProposals();
  }, [currentUser]);
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Agent Proposals
        </h1>
        <Button to="/buyer/my-listings">Manage My Listings</Button>
      </div>
      
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
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '2rem' 
        }}>
          Loading proposals...
        </div>
      ) : (
        <>
          {proposals.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {proposals.map((proposal) => {
                const listing = listings[proposal.listingId];
                
                return (
                  <Card key={proposal.id}>
                    <CardBody>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Proposal from {proposal.agentName || 'Anonymous Agent'}
                          </h2>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            For: {listing ? (listing.title || 'Property Search') : 'Unknown Listing'}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Received: {proposal.createdAt?.toDate().toLocaleDateString() || 'Unknown date'}
                          </p>
                        </div>
                        
                        <div style={{ 
                          backgroundColor: getStatusColor(proposal.status).bg, 
                          color: getStatusColor(proposal.status).text, 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {proposal.status || 'Pending'}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Agent's Message:</p>
                        <p style={{ margin: '0', fontSize: '0.875rem' }}>
                          {proposal.message ? 
                            (proposal.message.length > 150 ? 
                              `${proposal.message.substring(0, 150)}...` : 
                              proposal.message) : 
                            'No message provided'}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <Button 
                          to={`/buyer/proposals/${proposal.id}`}
                          size="small"
                        >
                          View Full Proposal
                        </Button>
                        
                        {listing && (
                          <Button 
                            to={`/buyer/listing/${listing.id}`}
                            size="small"
                            variant="secondary"
                          >
                            View My Listing
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1rem', 
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                You haven't received any agent proposals yet
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Create a listing to start receiving proposals from agents
              </p>
              <Button to="/buyer/create-listing">Create New Listing</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to get status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Accepted':
      return { bg: '#dcfce7', text: '#15803d' };
    case 'Rejected':
      return { bg: '#fee2e2', text: '#b91c1c' };
    case 'Pending':
    default:
      return { bg: '#e0f2fe', text: '#0369a1' };
  }
};

export default BuyerProposals;