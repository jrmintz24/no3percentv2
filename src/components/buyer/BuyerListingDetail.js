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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proposals, setProposals] = useState([]);
  const [acceptedProposal, setAcceptedProposal] = useState(null);
  const [transaction, setTransaction] = useState(null);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // Fetch the listing document
        const docRef = doc(db, 'buyerListings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const listingData = { id: docSnap.id, ...docSnap.data() };
          setListing(listingData);
          
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
          
          // Check if there's an accepted proposal
          const acceptedProp = proposalsList.find(p => 
            p.status === 'accepted' || p.status === 'Accepted'
          );
          
          if (acceptedProp) {
            setAcceptedProposal(acceptedProp);
            
            // If accepted proposal has a transaction, fetch it
            if (acceptedProp.transactionId) {
              const transactionRef = doc(db, 'transactions', acceptedProp.transactionId);
              const transactionSnap = await getDoc(transactionRef);
              
              if (transactionSnap.exists()) {
                setTransaction({ id: transactionSnap.id, ...transactionSnap.data() });
              }
            }
          }
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
        padding: isMobile ? '1rem' : '2rem 1rem' 
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
        padding: isMobile ? '1rem' : '2rem 1rem' 
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
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem 1rem' 
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Button 
          to="/buyer" 
          variant="secondary"
          style={isMobile ? { width: '100%' } : {}}
        >
          Back to Dashboard
        </Button>
        
        {isOwner && (
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem' 
          }}>
            {transaction && (
              <Button
                to={`/transaction/${transaction.id}`}
                style={{ 
                  backgroundColor: '#059669',
                  color: 'white',
                  width: isMobile ? '100%' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Go to Transaction
              </Button>
            )}
            <Button 
              to={`/buyer/edit-listing/${listingId}`} 
              variant="secondary"
              style={isMobile ? { width: '100%' } : {}}
            >
              Edit Listing
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="danger"
              style={isMobile ? { width: '100%' } : {}}
            >
              Delete Listing
            </Button>
          </div>
        )}
      </div>
      
      {/* Transaction Banner - Only show if there's an active transaction */}
      {transaction && (
        <div style={{
          backgroundColor: '#dcfce7',
          borderRadius: '0.5rem',
          border: '1px solid #86efac',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#166534' }}>
              Active Transaction
            </h2>
            <p style={{ color: '#059669', marginTop: '0.25rem' }}>
              This listing has an accepted proposal with an active transaction
            </p>
          </div>
          <Button
            to={`/transaction/${transaction.id}`}
            style={{ 
              backgroundColor: '#10b981',
              color: 'white',
              width: isMobile ? '100%' : 'auto',
              fontWeight: '600'
            }}
          >
            View Transaction Dashboard
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '1rem'
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            margin: 0 
          }}>
            {listing.title || 'Property Search Requirements'}
          </h1>
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            color: '#0369a1', 
            padding: '0.5rem 1rem', 
            borderRadius: '9999px', 
            fontSize: '0.875rem',
            fontWeight: '500',
            alignSelf: isMobile ? 'flex-start' : 'center'
          }}>
            {listing.status || 'Active'}
          </div>
        </CardHeader>
        
        <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.125rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Property Details
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
              gap: '1rem' 
            }}>
              <div>
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Location:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.location || 'Not specified'}
                </p>
                
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Property Type:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.propertyType || 'Not specified'}
                </p>
                
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Bedrooms:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.bedrooms || 'Not specified'}
                </p>
              </div>
              
              <div>
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Bathrooms:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.bathrooms || 'Not specified'}
                </p>
                
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Budget:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.budget ? `$${listing.budget.toLocaleString()}` : 'Not specified'}
                </p>
                
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Timeline:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.timeline || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.125rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Requirements
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '0.9375rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Must-Have Features:
              </h3>
              {listing.mustHaveFeatures && listing.mustHaveFeatures.length > 0 ? (
                <ul style={{ 
                  paddingLeft: '1.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.mustHaveFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  No must-have features specified
                </p>
              )}
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: isMobile ? '0.9375rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Nice-to-Have Features:
              </h3>
              {listing.niceToHaveFeatures && listing.niceToHaveFeatures.length > 0 ? (
                <ul style={{ 
                  paddingLeft: '1.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.niceToHaveFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  No nice-to-have features specified
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h2 style={{ 
              fontSize: isMobile ? '1.125rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Additional Information
            </h2>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '1rem',
              lineHeight: '1.6'
            }}>
              {listing.additionalInfo || 'No additional information provided'}
            </p>
          </div>
        </CardBody>
      </Card>
      
      <div style={{ marginTop: '2rem' }}>
        <Card>
          <CardHeader>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                margin: 0 
              }}>
                Agent Proposals ({proposals.length})
              </h2>
              
              {acceptedProposal && transaction && (
                <Button
                  to={`/transaction/${transaction.id}`}
                  size="small"
                  style={{ 
                    backgroundColor: '#059669',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Transaction
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            {proposals.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {proposals.map((proposal) => (
                  <div 
                    key={proposal.id}
                    style={{ 
                      padding: isMobile ? '0.875rem' : '1rem', 
                      borderRadius: '0.5rem', 
                      border: '1px solid #e5e7eb',
                      backgroundColor: (proposal.status === 'accepted' || proposal.status === 'Accepted') 
                        ? '#f0fdf4' 
                        : '#f9fafb',
                      borderLeft: (proposal.status === 'accepted' || proposal.status === 'Accepted')
                        ? '4px solid #10b981'
                        : '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between', 
                      marginBottom: '0.5rem',
                      gap: isMobile ? '0.5rem' : '0'
                    }}>
                      <h3 style={{ 
                        fontSize: isMobile ? '0.9375rem' : '1rem', 
                        fontWeight: 'bold', 
                        margin: 0 
                      }}>
                        {proposal.agentName || 'Anonymous Agent'}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {(proposal.status === 'accepted' || proposal.status === 'Accepted') && (
                          <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            Accepted
                          </span>
                        )}
                        <p style={{ 
                          margin: 0, 
                          color: '#6b7280', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          Submitted: {proposal.createdAt?.toDate().toLocaleDateString() || 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    
                    <p style={{ 
                      marginBottom: '1rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      {proposal.message || 'No message provided'}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Button 
                        to={`/buyer/proposals/${proposal.id}`} 
                        size="small"
                        style={isMobile ? { width: '100%' } : {}}
                      >
                        View Details
                      </Button>
                      
                      {(proposal.status === 'accepted' || proposal.status === 'Accepted') && proposal.transactionId && (
                        <Button 
                          to={`/transaction/${proposal.transactionId}`}
                          size="small"
                          style={{ 
                            backgroundColor: '#059669',
                            color: 'white',
                            width: isMobile ? '100%' : 'auto'
                          }}
                        >
                          Go to Transaction
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: isMobile ? '1.5rem' : '2rem', 
                color: '#6b7280' 
              }}>
                <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  No proposals yet
                </p>
                <p style={{ 
                  fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                  marginTop: '0.5rem' 
                }}>
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