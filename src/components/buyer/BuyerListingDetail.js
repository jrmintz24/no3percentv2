// src/components/buyer/BuyerListingDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const BuyerListingDetail = () => {
  const { listingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proposals, setProposals] = useState([]);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // Fetch the listing document
        const docRef = doc(db, 'buyerListings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
          
          // Fetch proposals for this listing
          const proposalsQuery = query(
            collection(db, 'proposals'),
            where('listingId', '==', listingId)
          );
          
          const proposalsSnapshot = await getDocs(proposalsQuery);
          const proposalsList = [];
          
          proposalsSnapshot.forEach((doc) => {
            proposalsList.push({ id: doc.id, ...doc.data() });
          });
          
          setProposals(proposalsList);
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Error loading listing details');
      } finally {
        setLoading(false);
      }
    };
    
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteDoc(doc(db, 'buyerListings', listingId));
        navigate('/buyer');
      } catch (err) {
        console.error('Error deleting listing:', err);
        setError('Error deleting listing');
      }
    }
  };
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '2rem' 
      }}>
        Loading listing details...
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
        <Button to="/buyer">Back to Dashboard</Button>
      </div>
    );
  }
  
  if (!listing) {
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
          Listing not found
        </div>
        <Button to="/buyer">Back to Dashboard</Button>
      </div>
    );
  }
  
  // Check if this listing belongs to the current user
  const isOwner = listing.userId === currentUser.uid;
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Button to="/buyer" variant="secondary">Back to Dashboard</Button>
        
        {isOwner && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button to={`/buyer/edit-listing/${listingId}`} variant="secondary">
              Edit Listing
            </Button>
            <Button onClick={handleDelete} variant="danger">
              Delete Listing
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {listing.title || 'Property Search Requirements'}
          </h1>
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            color: '#0369a1', 
            padding: '0.5rem 1rem', 
            borderRadius: '9999px', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {listing.status || 'Active'}
          </div>
        </CardHeader>
        
        <CardBody>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Property Details
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Location:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.location || 'Not specified'}</p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Property Type:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.propertyType || 'Not specified'}</p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bedrooms:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.bedrooms || 'Not specified'}</p>
              </div>
              
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bathrooms:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.bathrooms || 'Not specified'}</p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Budget:</p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  {listing.budget ? `$${listing.budget.toLocaleString()}` : 'Not specified'}
                </p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Timeline:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.timeline || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Requirements
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Must-Have Features:
              </h3>
              {listing.mustHaveFeatures && listing.mustHaveFeatures.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {listing.mustHaveFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No must-have features specified</p>
              )}
            </div>
            
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Nice-to-Have Features:
              </h3>
              {listing.niceToHaveFeatures && listing.niceToHaveFeatures.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {listing.niceToHaveFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No nice-to-have features specified</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Additional Information
            </h2>
            <p>{listing.additionalInfo || 'No additional information provided'}</p>
          </div>
        </CardBody>
      </Card>
      
      <div style={{ marginTop: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Agent Proposals ({proposals.length})
            </h2>
          </CardHeader>
          
          <CardBody>
            {proposals.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {proposals.map((proposal) => (
                  <div 
                    key={proposal.id}
                    style={{ 
                      padding: '1rem', 
                      borderRadius: '0.5rem', 
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '0.5rem' 
                    }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                        {proposal.agentName || 'Anonymous Agent'}
                      </h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        Submitted: {proposal.createdAt?.toDate().toLocaleDateString() || 'Unknown date'}
                      </p>
                    </div>
                    
                    <p style={{ marginBottom: '1rem' }}>
                      {proposal.message || 'No message provided'}
                    </p>
                    
                    <Button to={`/buyer/proposals/${proposal.id}`} size="small">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: '#6b7280' 
              }}>
                <p>No proposals yet</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Agents will submit proposals as they become interested in your listing
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BuyerListingDetail;