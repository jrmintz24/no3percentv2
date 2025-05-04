// src/components/seller/SellerListingDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const SellerListingDetail = () => {
  const { listingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proposals, setProposals] = useState([]);
  
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
        const docRef = doc(db, 'sellerListings', listingId);
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
        await deleteDoc(doc(db, 'sellerListings', listingId));
        navigate('/seller');
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
        <Button to="/seller">Back to Dashboard</Button>
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
        <Button to="/seller">Back to Dashboard</Button>
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
          to="/seller" 
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
            <Button 
              to={`/seller/edit-listing/${listingId}`} 
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
            {listing.propertyName || 'Property Listing'}
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
                  Address:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.address || 'Not specified'}
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
                  Asking Price:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.price ? `$${listing.price.toLocaleString()}` : 'Not specified'}
                </p>
                
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Square Footage:
                </p>
                <p style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {listing.squareFootage ? `${listing.squareFootage.toLocaleString()} sq ft` : 'Not specified'}
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
              Property Description
            </h2>
            <p style={{ 
              fontSize: isMobile ? '0.875rem' : '1rem',
              lineHeight: '1.6'
            }}>
              {listing.description || 'No description provided'}
            </p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.125rem' : '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Agent Services Required
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '0.9375rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Must-Have Services:
              </h3>
              {listing.services?.mustHave && listing.services.mustHave.length > 0 ? (
                <ul style={{ 
                  paddingLeft: '1.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem' 
                }}>
                  {listing.services.mustHave.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  No must-have services specified
                </p>
              )}
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: isMobile ? '0.9375rem' : '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem' 
              }}>
                Nice-to-Have Services:
              </h3>
              {listing.services?.niceToHave && listing.services.niceToHave.length > 0 ? (
                <ul style={{ 
                  paddingLeft: '1.5rem',
                  fontSize: isMobile ? '0.875rem' : '1rem' 
                }}>
                  {listing.services.niceToHave.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                  No nice-to-have services specified
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
            <h2 style={{ 
              fontSize: isMobile ? '1.125rem' : '1.25rem', 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              Agent Proposals ({proposals.length})
            </h2>
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
                      backgroundColor: '#f9fafb'
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
                      <p style={{ 
                        margin: 0, 
                        color: '#6b7280', 
                        fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                      }}>
                        Submitted: {proposal.createdAt?.toDate().toLocaleDateString() || 'Unknown date'}
                      </p>
                    </div>
                    
                    <p style={{ 
                      marginBottom: '1rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      {proposal.message || 'No message provided'}
                    </p>
                    
                    <Button 
                      to={`/seller/proposals/${proposal.id}`} 
                      size="small"
                      style={isMobile ? { width: '100%' } : {}}
                    >
                      View Details
                    </Button>
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

export default SellerListingDetail;