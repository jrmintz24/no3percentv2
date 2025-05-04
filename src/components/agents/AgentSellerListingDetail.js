import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../hooks/useTokens';
import { spendTokenForBid } from '../../services/firebase/tokens';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import { sellerServices } from '../../config/services';

const AgentSellerListingDetail = () => {
  const { listingId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const { tokens, loading: tokensLoading } = useTokens();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidOpen, setBidOpen] = useState(false);
  const [bidMessage, setBidMessage] = useState('');
  const [feeStructure, setFeeStructure] = useState('percentage');
  const [commissionRate, setCommissionRate] = useState('');
  const [flatFee, setFlatFee] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [packageInfo, setPackageInfo] = useState(null);
  const [additionalServices, setAdditionalServices] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');
  const [alreadyBid, setAlreadyBid] = useState(false);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // Fetch the listing document
        const docRef = doc(db, 'sellerListings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
          
          // Check if user has already bid on this listing
          const tokenUsageRef = doc(db, 'tokenUsage', `${currentUser.uid}_${listingId}`);
          const tokenUsageSnap = await getDoc(tokenUsageRef);
          setAlreadyBid(tokenUsageSnap.exists());
          
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
    
    if (listingId && currentUser) {
      fetchListing();
    }
  }, [listingId, currentUser]);
  
  const handleServiceSelection = (services) => {
    setSelectedServices(services);
  };
  
  const handlePackageChange = (info) => {
    setPackageInfo(info);
    // Update commission based on package if needed
    if (info.packageId !== 'custom') {
      setFeeStructure('percentage');
      // You might want to set a default commission rate based on the package
      const packageRates = {
        'full': '3.5',
        'limited': '2.5',
        'custom': ''
      };
      setCommissionRate(packageRates[info.packageId] || '');
    }
  };
  
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!bidMessage.trim()) {
      setBidError('Please enter a message to the seller');
      return;
    }
    
    if (feeStructure === 'percentage' && !commissionRate.trim()) {
      setBidError('Please enter your proposed commission rate');
      return;
    }
    
    if (feeStructure === 'flat' && !flatFee.trim()) {
      setBidError('Please enter your proposed flat fee');
      return;
    }
    
    if (selectedServices.length === 0) {
      setBidError('Please select at least one service you will provide');
      return;
    }
    
    try {
      setBidLoading(true);
      setBidError('');
      
      // Use a token for this bid
      const success = await spendTokenForBid(currentUser.uid, listingId);
      
      if (!success) {
        setBidError('Not enough tokens to place a bid');
        return;
      }
      
      // Get the names of selected services
      const selectedServiceNames = sellerServices
        .filter(service => selectedServices.includes(service.id))
        .map(service => service.name);
      
      // Create the proposal document
      await addDoc(collection(db, 'proposals'), {
        listingId,
        listingType: 'seller',
        agentId: currentUser.uid,
        agentName: userProfile?.displayName || 'Anonymous Agent',
        message: bidMessage,
        feeStructure,
        ...(feeStructure === 'percentage' ? { commissionRate } : { flatFee }),
        services: selectedServiceNames,
        packageInfo: packageInfo, // Add package information
        additionalServices: additionalServices.trim() || null,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      
      // Close the bid form and reset fields
      setBidOpen(false);
      setBidMessage('');
      setCommissionRate('');
      setFlatFee('');
      setPackageInfo(null);
      
      // Show a success message or redirect
      alert('Your proposal has been submitted successfully!');
      setAlreadyBid(true); // Update UI to show user has bid
      
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setBidError('Error submitting your proposal');
    } finally {
      setBidLoading(false);
    }
  };
  
  if (loading || tokensLoading) {
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
        <Button to="/agent/listings">Back to Listings</Button>
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
        <Button to="/agent/listings">Back to Listings</Button>
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
        <Button to="/agent/listings" variant="secondary">Back to Listings</Button>
        
        {!bidOpen && !alreadyBid && (
          <Button 
            onClick={() => setBidOpen(true)}
            disabled={tokens < 1}
          >
            {tokens < 1 ? 'Need More Tokens to Bid' : 'Submit Proposal (1 Token)'}
          </Button>
        )}
        
        {alreadyBid && (
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            color: '#0369a1', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            You have already submitted a proposal for this listing
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {listing.propertyName || 'Property Listing'}
          </h1>
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            color: '#0369a1', 
            padding: '0.5rem 1rem', 
            borderRadius: '9999px', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Seller Listing
          </div>
        </CardHeader>
        
        <CardBody>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Property Details
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Address:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.address || 'Not specified'}</p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Property Type:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.propertyType || 'Not specified'}</p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bedrooms:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.bedrooms || 'Not specified'}</p>
              </div>
              
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bathrooms:</p>
                <p style={{ margin: '0 0 1rem 0' }}>{listing.bathrooms || 'Not specified'}</p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Asking Price:</p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  {listing.price ? `$${listing.price.toLocaleString()}` : 'Not specified'}
                </p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Square Footage:</p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  {listing.squareFootage ? `${listing.squareFootage.toLocaleString()} sq ft` : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Property Description
            </h2>
            <p>{listing.description || 'No description provided'}</p>
          </div>
          
          {listing.services && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Agent Services Requested
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Must-Have Services:
                </h3>
                {listing.services.mustHave && listing.services.mustHave.length > 0 ? (
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {listing.services.mustHave.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No must-have services specified</p>
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Nice-to-Have Services:
                </h3>
                {listing.services.niceToHave && listing.services.niceToHave.length > 0 ? (
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {listing.services.niceToHave.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No nice-to-have services specified</p>
                )}
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Not Interested In:
                </h3>
                {listing.services.notInterested && listing.services.notInterested.length > 0 ? (
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {listing.services.notInterested.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No services specified as 'not interested'</p>
                )}
              </div>
            </div>
          )}
          
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Additional Information
            </h2>
            <p>{listing.additionalInfo || 'No additional information provided'}</p>
          </div>
          
          {bidOpen && (
            <div style={{ 
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Submit Your Proposal
              </h2>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#e0f2fe',
                borderRadius: '0.375rem',
                color: '#0369a1'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.5rem', marginRight: '0.75rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                  This proposal will cost 1 token. You currently have {tokens} token{tokens !== 1 ? 's' : ''}.
                </p>
              </div>
              
              {bidError && (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  color: '#b91c1c', 
                  padding: '0.75rem', 
                  borderRadius: '0.375rem', 
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {bidError}
                </div>
              )}
              
              <form onSubmit={handleSubmitBid}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Services You Will Provide:
                  </label>
                  
                  <ServiceSelector
                    services={sellerServices}
                    selectedServices={selectedServices}
                    onSelectionChange={handleServiceSelection}
                    userType="seller"
                    showCategories={false}
                    showPackages={true}
                    onPackageChange={handlePackageChange}
                    basePropertyValue={listing.price || 500000}
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Fee Structure:
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="feeStructure"
                        value="percentage"
                        checked={feeStructure === 'percentage'}
                        onChange={() => setFeeStructure('percentage')}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Percentage Commission
                    </label>
                    
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name="feeStructure"
                        value="flat"
                        checked={feeStructure === 'flat'}
                        onChange={() => setFeeStructure('flat')}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Flat Fee
                    </label>
                  </div>
                </div>
                
                {feeStructure === 'percentage' ? (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label 
                      htmlFor="commissionRate" 
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500' 
                      }}
                    >
                      Your Proposed Commission Rate:
                    </label>
                    <input
                      id="commissionRate"
                      type="text"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      required
                      style={{ 
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db'
                      }}
                      placeholder="e.g., 2.5%, 3%, etc."
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label 
                      htmlFor="flatFee" 
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500' 
                      }}
                    >
                      Your Proposed Flat Fee:
                    </label>
                    <input
                      id="flatFee"
                      type="text"
                      value={flatFee}
                      onChange={(e) => setFlatFee(e.target.value)}
                      required
                      style={{ 
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db'
                      }}
                      placeholder="e.g., $5,000, $7,500, etc."
                    />
                  </div>
                )}
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    htmlFor="additionalServices" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Additional Services (Optional):
                  </label>
                  <textarea
                    id="additionalServices"
                    value={additionalServices}
                    onChange={(e) => setAdditionalServices(e.target.value)}
                    rows={3}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      resize: 'vertical'
                    }}
                    placeholder="List any additional services not mentioned above that you can provide"
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label 
                    htmlFor="bidMessage" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Your Message to the Seller:
                  </label>
                  <textarea
                    id="bidMessage"
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    required
                    rows={6}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      resize: 'vertical'
                    }}
                    placeholder="Introduce yourself and explain your strategy for selling their property. Include your qualifications, experience, and why you would be the right agent for them."
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button 
                    type="submit"
                    disabled={bidLoading || tokens < 1}
                  >
                    {bidLoading ? 'Submitting...' : 'Submit Proposal'}
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setBidOpen(false);
                      setBidMessage('');
                      setCommissionRate('');
                      setFlatFee('');
                      setBidError('');
                    }}
                    disabled={bidLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AgentSellerListingDetail;