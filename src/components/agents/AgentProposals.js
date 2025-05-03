import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const AgentProposals = () => {
  const { currentUser } = useAuth();
  
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError('');
        setDebug('Starting to fetch proposals');
        
        if (!currentUser) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        setDebug(`User authenticated with ID: ${currentUser.uid}`);
        
        // Query proposals where the current user is the agent
        const proposalsQuery = query(
          collection(db, 'proposals'),
          where('agentId', '==', currentUser.uid)
        );
        
        setDebug('Query created, attempting to fetch proposals');
        
        const proposalsSnapshot = await getDocs(proposalsQuery);
        
        setDebug(`Query executed. Found ${proposalsSnapshot.size} proposals`);
        
        const proposalsData = [];
        const listingPromises = [];
        
        proposalsSnapshot.forEach((docSnapshot) => {
          const proposal = { id: docSnapshot.id, ...docSnapshot.data() };
          proposalsData.push(proposal);
          
          // Fetch the associated listing
          const listingRef = firestoreDoc(
            db, 
            proposal.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', 
            proposal.listingId
          );
          
          listingPromises.push(
            getDoc(listingRef)
              .then(listingSnap => {
                if (listingSnap.exists()) {
                  proposal.listing = { id: listingSnap.id, ...listingSnap.data() };
                }
                return proposal;
              })
              .catch(err => {
                console.error(`Error fetching listing for proposal ${proposal.id}:`, err);
                return proposal;
              })
          );
        });
        
        setDebug('Waiting for all listing data to be fetched');
        
        // Wait for all listing data to be fetched
        await Promise.all(listingPromises);
        
        setDebug('All data fetched successfully');
        setProposals(proposalsData);
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError(`Error loading proposals: ${err.message}`);
        setDebug(`Error details: ${JSON.stringify(err)}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposals();
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
          My Proposals
        </h1>
        
        <Button to="/agent/listings">
          Browse Listings
        </Button>
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
          {debug && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Debug info: {debug}
            </div>
          )}
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
      ) : proposals.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '3rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            You haven't submitted any proposals yet
          </h2>
          <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
            Browse available listings and submit proposals to connect with potential clients
          </p>
          <Button to="/agent/listings">
            Browse Listings
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {proposals.map((proposal) => (
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
                      {proposal.listing ? (
                        proposal.listingType === 'buyer' ? (
                          proposal.listing.title || 'Buyer Listing'
                        ) : (
                          proposal.listing.propertyName || 'Seller Listing'
                        )
                      ) : (
                        'Loading listing details...'
                      )}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Submitted on: {proposal.createdAt ? new Date(proposal.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
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
                    {proposal.status}
                  </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                    {proposal.feeStructure === 'percentage' ? 'Commission Rate:' : 'Flat Fee:'}
                  </p>
                  <p style={{ margin: '0', color: '#2563eb', fontWeight: '500' }}>
                    {proposal.feeStructure === 'percentage' ? proposal.commissionRate : proposal.flatFee}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    to={`/agent/proposals/${proposal.id}`}
                    size="small"
                  >
                    View Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get status color
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

export default AgentProposals;