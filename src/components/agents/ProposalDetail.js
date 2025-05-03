// src/components/agents/ProposalDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const ProposalDetail = () => {
  const { proposalId } = useParams();
  const { currentUser } = useAuth();
  
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch proposal document
        const proposalRef = firestoreDoc(db, 'proposals', proposalId);
        const proposalSnap = await getDoc(proposalRef);
        
        if (!proposalSnap.exists()) {
          setError('Proposal not found');
          setLoading(false);
          return;
        }
        
        const proposalData = { id: proposalSnap.id, ...proposalSnap.data() };
        
        // Make sure this proposal belongs to the current user
        if (proposalData.agentId !== currentUser.uid) {
          setError('You do not have permission to view this proposal');
          setLoading(false);
          return;
        }
        
        setProposal(proposalData);
        
        // Fetch associated listing
        const listingRef = firestoreDoc(
          db, 
          proposalData.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', 
          proposalData.listingId
        );
        const listingSnap = await getDoc(listingRef);
        
        if (listingSnap.exists()) {
          const listingData = { id: listingSnap.id, ...listingSnap.data() };
          setListing(listingData);
          
          // Fetch client info
          const clientRef = firestoreDoc(db, 'users', listingData.userId);
          const clientSnap = await getDoc(clientRef);
          
          if (clientSnap.exists()) {
            setClient({ id: clientSnap.id, ...clientSnap.data() });
          }
        }
        
      } catch (err) {
        console.error('Error fetching proposal details:', err);
        setError('Error loading proposal details');
      } finally {
        setLoading(false);
      }
    };
    
    if (proposalId && currentUser) {
      fetchProposalDetails();
    }
  }, [proposalId, currentUser]);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '2rem' 
      }}>
        Loading proposal details...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
        <Button to="/agent/proposals">Back to Proposals</Button>
      </div>
    );
  }
  
  if (!proposal || !listing) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          Proposal or listing not found
        </div>
        <Button to="/agent/proposals">Back to Proposals</Button>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Button to="/agent/proposals" variant="secondary">Back to Proposals</Button>
        
        <div style={{ 
          backgroundColor: getStatusColor(proposal.status).bg, 
          color: getStatusColor(proposal.status).text, 
          padding: '0.5rem 1rem', 
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          {proposal.status}
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Proposal Details
            </h2>
          </CardHeader>
          <CardBody>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Submitted On:
              </h3>
              <p>
                {proposal.createdAt ? new Date(proposal.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Pricing Structure:
              </h3>
              <p style={{ fontWeight: 'bold', color: '#2563eb' }}>
                {proposal.feeStructure === 'percentage' 
                  ? `Commission Rate: ${proposal.commissionRate}` 
                  : `Flat Fee: ${proposal.flatFee}`}
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Services Included:
              </h3>
              {proposal.services && proposal.services.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {proposal.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific services listed</p>
              )}
            </div>
            
            {proposal.additionalServices && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Additional Services:
                </h3>
                <p>{proposal.additionalServices}</p>
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Your Message:
              </h3>
              <div style={{ 
                backgroundColor: '#f9fafb', 
                padding: '1rem', 
                borderRadius: '0.375rem',
                whiteSpace: 'pre-line'
              }}>
                {proposal.message}
              </div>
            </div>
            
            {proposal.status === 'Accepted' && (
              <div style={{ marginTop: '2rem' }}>
                <Button 
                  to={`/agent/messages/${proposal.channelId || 'new'}`}
                  fullWidth
                >
                  Message Client
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              {proposal.listingType === 'buyer' ? 'Buyer Information' : 'Property Information'}
            </h2>
          </CardHeader>
          <CardBody>
            {proposal.listingType === 'buyer' ? (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Buyer:
                  </h3>
                  <p>{client?.displayName || 'Unknown'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Looking For:
                  </h3>
                  <p>{listing.title || 'Property Search Criteria'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Location:
                  </h3>
                  <p>{listing.location || 'Not specified'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Budget:
                  </h3>
                  <p>{listing.budget ? `$${listing.budget.toLocaleString()}` : 'Not specified'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Requirements:
                  </h3>
                  <p>
                    {listing.bedrooms ? `${listing.bedrooms} bed` : ''}{listing.bedrooms && listing.bathrooms ? ', ' : ''}
                    {listing.bathrooms ? `${listing.bathrooms} bath` : ''}
                    {(!listing.bedrooms && !listing.bathrooms) ? 'Not specified' : ''}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Seller:
                  </h3>
                  <p>{client?.displayName || 'Unknown'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Property:
                  </h3>
                  <p>{listing.propertyName || 'Property Listing'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Address:
                  </h3>
                  <p>{listing.address || 'Not specified'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Asking Price:
                  </h3>
                  <p>{listing.price ? `$${listing.price.toLocaleString()}` : 'Not specified'}</p>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Property Details:
                  </h3>
                  <p>
                    {listing.bedrooms ? `${listing.bedrooms} bed` : ''}{listing.bedrooms && listing.bathrooms ? ', ' : ''}
                    {listing.bathrooms ? `${listing.bathrooms} bath` : ''}
                    {listing.squareFootage ? `, ${listing.squareFootage.toLocaleString()} sqft` : ''}
                    {(!listing.bedrooms && !listing.bathrooms && !listing.squareFootage) ? 'Not specified' : ''}
                  </p>
                </div>
              </div>
            )}
            
            <div style={{ marginTop: '1.5rem' }}>
              <Button 
                to={proposal.listingType === 'buyer' 
                  ? `/agent/buyer-listing/${listing.id}` 
                  : `/agent/seller-listing/${listing.id}`
                }
                fullWidth
                variant="secondary"
              >
                View Full Listing
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
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

export default ProposalDetail;