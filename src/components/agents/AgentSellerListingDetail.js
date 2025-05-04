import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../hooks/useTokens';
import { spendTokenForBid, addTokens } from '../../services/firebase/tokens';
import { calculateTokenCost, getHighestPriorityBid } from '../../services/firebase/tokenPricing';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import { sellerServices } from '../../config/services';
import { subscriptionTiers, tokenPackages, getTokenPackagePrice } from '../../config/subscriptions';

const AgentSellerListingDetail = () => {
  const { listingId } = useParams();
  const { currentUser, userProfile, getUserSubscriptionTier } = useAuth();
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
  
  // Dynamic token pricing states
  const [tokenCost, setTokenCost] = useState(2);
  const [costFactors, setCostFactors] = useState(null);
  
  // Priority boost states
  const [boostAmount, setBoostAmount] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  
  // Token purchase states
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  
  // Add ref for bid form
  const bidFormRef = useRef(null);
  
  // Get user subscription tier
  const userTier = getUserSubscriptionTier(userProfile);
  
  // Add useEffect to scroll when bidOpen changes
  useEffect(() => {
    if (bidOpen && bidFormRef.current) {
      // Add a small delay to ensure the form is rendered
      setTimeout(() => {
        bidFormRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [bidOpen]);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // Fetch the listing document
        const docRef = doc(db, 'sellerListings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const listingData = { id: docSnap.id, ...docSnap.data() };
          setListing(listingData);
          
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
  
  // Add useEffect for dynamic token pricing and highest bid
  useEffect(() => {
    const fetchPricingInfo = async () => {
      if (listing) {
        // Get token cost
        const { cost, factors } = await calculateTokenCost(
          listingId, 
          'seller', 
          listing.verificationStatus === 'verified',
          db
        );
        setTokenCost(cost);
        setCostFactors(factors);
        
        // Get highest bid
        const highest = await getHighestPriorityBid(listingId, db);
        setHighestBid(highest);
      }
    };
    
    if (listing) {
      fetchPricingInfo();
    }
  }, [listing, listingId]);
  
  const handleTokenPurchase = async () => {
    if (!selectedPackage) {
      setPurchaseError('Please select a token package');
      return;
    }
    
    try {
      setPurchaseLoading(true);
      setPurchaseError('');
      
      const selectedPkg = Object.values(tokenPackages).find(pkg => pkg.id === selectedPackage);
      
      // In a real application, you would integrate with a payment gateway here
      // For now, we'll just simulate a successful payment and add tokens
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add tokens to user account
      await addTokens(currentUser.uid, selectedPkg.tokens);
      
      setPurchaseSuccess(`Successfully purchased ${selectedPkg.tokens} tokens!`);
      setSelectedPackage(null);
      
      // Wait a moment for the tokens to update
      setTimeout(() => {
        setShowTokenPurchase(false);
        setPurchaseSuccess('');
      }, 2000);
      
    } catch (err) {
      console.error('Error processing token purchase:', err);
      setPurchaseError('Error processing your purchase: ' + err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };
  
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
    
    const totalTokensNeeded = tokenCost + boostAmount;
    
    if (tokens < totalTokensNeeded) {
      setBidError(`Not enough tokens. You need ${totalTokensNeeded} tokens.`);
      return;
    }
    
    try {
      setBidLoading(true);
      setBidError('');
      
      // Use dynamic token cost for this bid (including boost)
      const result = await spendTokenForBid(
        currentUser.uid, 
        listingId,
        'seller',
        listing.verificationStatus === 'verified',
        totalTokensNeeded
      );
      
      if (!result.success) {
        setBidError(result.error || 'Failed to place bid');
        return;
      }
      
      // Get the names of selected services
      const selectedServiceNames = sellerServices
        .filter(service => selectedServices.includes(service.id))
        .map(service => service.name);
      
      // Create the proposal document with priority information
      await addDoc(collection(db, 'proposals'), {
        listingId,
        listingType: 'seller',
        agentId: currentUser.uid,
        agentName: userProfile?.displayName || 'Anonymous Agent',
        message: bidMessage,
        feeStructure,
        ...(feeStructure === 'percentage' ? { commissionRate } : { flatFee }),
        services: selectedServiceNames,
        packageInfo: packageInfo,
        additionalServices: additionalServices.trim() || null,
        // Priority boost information
        tokenCost: tokenCost,
        boostAmount: boostAmount,
        totalTokensSpent: totalTokensNeeded,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      
      // Close the bid form and reset fields
      setBidOpen(false);
      setBidMessage('');
      setCommissionRate('');
      setFlatFee('');
      setPackageInfo(null);
      setBoostAmount(0);
      
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
          tokens < tokenCost ? (
            <Button 
              onClick={() => setShowTokenPurchase(true)}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
              }}
            >
              Need More Tokens to Bid ({tokenCost} required)
            </Button>
          ) : (
            <Button 
              onClick={() => setBidOpen(true)}
            >
              Submit Proposal ({tokenCost} Token{tokenCost !== 1 ? 's' : ''})
            </Button>
          )
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
      
      {/* Token Purchase Modal */}
      {showTokenPurchase && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                Purchase Tokens
              </h2>
              <button
                onClick={() => setShowTokenPurchase(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {purchaseError && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                padding: '1rem', 
                borderRadius: '0.375rem', 
                marginBottom: '1rem' 
              }}>
                {purchaseError}
              </div>
            )}
            
            {purchaseSuccess && (
              <div style={{ 
                backgroundColor: '#dcfce7', 
                color: '#15803d', 
                padding: '1rem', 
                borderRadius: '0.375rem', 
                marginBottom: '1rem' 
              }}>
                {purchaseSuccess}
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                You currently have <strong>{tokens} token{tokens !== 1 ? 's' : ''}</strong>.
              </p>
              <p style={{ color: '#6b7280', margin: 0 }}>
                This listing requires {tokenCost} token{tokenCost !== 1 ? 's' : ''} to submit a proposal.
              </p>
              {userTier.tokenDiscount > 0 && (
                <p style={{ color: '#059669', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Your {userTier.name} subscription gives you {userTier.tokenDiscount * 100}% off token purchases!
                </p>
              )}
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {Object.values(tokenPackages).map((pkg) => {
                const pricing = getTokenPackagePrice(pkg.id, userTier.id);
                return (
                  <div 
                    key={pkg.id}
                    style={{ 
                      border: selectedPackage === pkg.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      position: 'relative',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <div style={{ 
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Most Popular
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {pkg.name}
                    </h3>
                    
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', textAlign: 'center', marginBottom: '0.5rem' }}>
                      ${pricing.discountedPrice}
                      {pricing.discount > 0 && (
                        <div style={{ fontSize: '0.875rem', color: '#059669', textDecoration: 'line-through' }}>
                          ${pricing.originalPrice}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pkg.tokens}</span> Tokens
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input 
                        type="radio" 
                        id={`pkg-${pkg.id}`} 
                        name="tokenPackage" 
                        checked={selectedPackage === pkg.id}
                        onChange={() => setSelectedPackage(pkg.id)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <label htmlFor={`pkg-${pkg.id}`}>Select</label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button 
                onClick={handleTokenPurchase}
                disabled={!selectedPackage || purchaseLoading}
              >
                {purchaseLoading ? 'Processing...' : 'Purchase Tokens'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setShowTokenPurchase(false)}
                disabled={purchaseLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            {listing.title || listing.propertyName || 'Property Listing'}
          </h1>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
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
            {listing.verificationStatus === 'verified' && (
              <div style={{ 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                padding: '0.5rem 1rem', 
                borderRadius: '9999px', 
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}
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
                  {listing.price ? `$${Number(listing.price).toLocaleString()}` : 'Not specified'}
                </p>
                
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Square Footage:</p>
                <p style={{ margin: '0 0 1rem 0' }}>
                  {listing.squareFootage ? `${Number(listing.squareFootage).toLocaleString()} sq ft` : 'Not specified'}
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
            <div 
              ref={bidFormRef}
              style={{ 
                marginTop: '2rem',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb'
              }}
            >
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
                  This proposal will cost {tokenCost + boostAmount} token{(tokenCost + boostAmount) !== 1 ? 's' : ''}. 
                  You currently have {tokens} token{tokens !== 1 ? 's' : ''}.
                  {costFactors && (
                    <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                      Base cost: {tokenCost} token{tokenCost !== 1 ? 's' : ''} 
                      {listing.verificationStatus === 'verified' ? ' (Verified listing 1.5x) • ' : ' • '}
                      {costFactors.bidCount} existing bid{costFactors.bidCount !== 1 ? 's' : ''}
                      {costFactors.demandMultiplier > 1 ? ` (${costFactors.demandMultiplier}x demand)` : ''}
                    </span>
                  )}
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
                
                {/* Priority Boost Section */}
                <div style={{ 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#fefce8',
                  borderRadius: '0.5rem',
                  border: '1px solid #fef9c3'
                }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                    ⭐ Priority Boost (Optional)
                  </h3>
                  
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Add extra tokens to appear higher in the client's proposal list. 
                    Current highest priority: {highestBid} tokens
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      Additional tokens:
                      <input
                        type="number"
                        min="0"
                        max={tokens - tokenCost}
                        value={boostAmount}
                        onChange={(e) => setBoostAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{
                          marginLeft: '0.5rem',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          width: '100px'
                        }}
                      />
                    </label>
                    
                    <span style={{ color: '#6b7280' }}>
                      Total cost: {tokenCost + boostAmount} tokens
                    </span>
                  </div>
                  
                  {boostAmount > 0 && (
                    <p style={{ 
                      marginTop: '0.5rem', 
                      fontSize: '0.875rem', 
                      color: boostAmount + tokenCost > highestBid ? '#059669' : '#6b7280'
                    }}>
                      {boostAmount + tokenCost > highestBid 
                        ? '🌟 Your proposal will appear first!' 
                        : 'Your proposal will appear below higher bids'}
                    </p>
                  )}
                </div>
                
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
                    disabled={bidLoading || tokens < (tokenCost + boostAmount)}
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
                      setBoostAmount(0);
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