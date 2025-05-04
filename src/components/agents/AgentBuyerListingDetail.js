import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../hooks/useTokens';
import { spendTokenForBid, addTokens } from '../../services/firebase/tokens';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import { buyerServices } from '../../config/services';

const AgentBuyerListingDetail = () => {
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
  const [paymentPreference, setPaymentPreference] = useState(null);
  const [additionalServices, setAdditionalServices] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');
  const [alreadyBid, setAlreadyBid] = useState(false);
  const [offerRebate, setOfferRebate] = useState(false);
  const [rebateAmount, setRebateAmount] = useState('');
  
  // Token purchase states
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  
  // Add ref for bid form
  const bidFormRef = useRef(null);
  
  // Token packages
  const tokenPackages = [
    { id: 'basic', name: 'Basic', tokens: 5, price: 25 },
    { id: 'standard', name: 'Standard', tokens: 20, price: 80, popular: true },
    { id: 'premium', name: 'Premium', tokens: 50, price: 150 }
  ];
  
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
        const docRef = doc(db, 'buyerListings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const listingData = { id: docSnap.id, ...docSnap.data() };
          setListing(listingData);
          
          // Set initial values based on listing preferences
          if (listingData.paymentPreference) {
            setFeeStructure(listingData.paymentPreference.type === 'flat_fee' ? 'flat' : 'percentage');
          }
          
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

  const handleTokenPurchase = async () => {
    if (!selectedPackage) {
      setPurchaseError('Please select a token package');
      return;
    }
    
    try {
      setPurchaseLoading(true);
      setPurchaseError('');
      
      const selectedPkg = tokenPackages.find(pkg => pkg.id === selectedPackage);
      
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
        'showing_only': '0.75',
        'basic': '1.75',
        'full': '2.75',
        'custom': ''
      };
      setCommissionRate(packageRates[info.packageId] || '');
    }
  };
  
  const handlePaymentPreferenceChange = (preference) => {
    setPaymentPreference(preference);
  };
  
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!bidMessage.trim()) {
      setBidError('Please enter a message to the buyer');
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
      const selectedServiceNames = buyerServices
        .filter(service => selectedServices.includes(service.id))
        .map(service => service.name);
      
      // Create the proposal document
      await addDoc(collection(db, 'proposals'), {
        listingId,
        listingType: 'buyer',
        agentId: currentUser.uid,
        agentName: userProfile?.displayName || 'Anonymous Agent',
        message: bidMessage,
        feeStructure,
        ...(feeStructure === 'percentage' ? { commissionRate } : { flatFee }),
        services: selectedServiceNames,
        packageInfo: packageInfo, // Add package information
        offerRebate: offerRebate,
        rebateAmount: offerRebate ? rebateAmount : null,
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
      setOfferRebate(false);
      setRebateAmount('');
      
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
  
  const listingPrice = listing.priceRange?.max || listing.budget || 500000;
  
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
          tokens < 1 ? (
            <Button 
              onClick={() => setShowTokenPurchase(true)}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
              }}
            >
              Need More Tokens to Bid
            </Button>
          ) : (
            <Button 
              onClick={() => setBidOpen(true)}
            >
              Submit Proposal (1 Token)
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
                Each token allows you to submit one proposal to a buyer or seller.
              </p>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {tokenPackages.map((pkg) => (
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
                    ${pkg.price}
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
              ))}
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
            Buyer Listing
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
                  {listing.budget ? `$${listing.budget.toLocaleString()}` : listing.priceRange ? `$${listing.priceRange.min?.toLocaleString()} - $${listing.priceRange.max?.toLocaleString()}` : 'Not specified'}
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
          
          {/* Payment Preference Section */}
          {listing.paymentPreference && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Payment Preferences
              </h2>
              
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Preferred Payment Type:</strong> {listing.paymentPreference.type === 'flat_fee' ? 'Flat Fee' : 'Commission Percentage'}
                </p>
                {listing.paymentPreference.requireRebate && (
                  <p style={{ margin: '0', color: '#2563eb' }}>
                    <strong>Note:</strong> Buyer requires rebate if seller pays commission
                  </p>
                )}
              </div>
            </div>
          )}
          
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
                    services={buyerServices}
                    selectedServices={selectedServices}
                    onSelectionChange={handleServiceSelection}
                    userType="buyer"
                    showCategories={false}
                    showPackages={true}
                    onPackageChange={handlePackageChange}
                    onPaymentPreferenceChange={handlePaymentPreferenceChange}
                    basePropertyValue={listingPrice}
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
                      placeholder="e.g., $3,000, $5,000, etc."
                    />
                  </div>
                )}
                
                {/* Info message if buyer requires rebate */}
                {listing.paymentPreference?.requireRebate && (
                  <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fcd34d',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#92400e',
                      fontWeight: '500',
                      margin: 0
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      This buyer requires agents to offer a rebate if the seller pays commission.
                    </p>
                  </div>
                )}
                
                {/* Rebate Offer - for agents responding to buyer listings */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={offerRebate}
                      onChange={(e) => setOfferRebate(e.target.checked)}
                    />
                    Offer rebate if seller pays commission
                  </label>
                  
                  {offerRebate && (
                    <div style={{ marginTop: '1rem' }}>
                      <label 
                        htmlFor="rebateAmount" 
                        style={{ 
                          display: 'block', 
                          marginBottom: '0.5rem', 
                          fontWeight: '500' 
                        }}
                      >
                        Rebate Amount (% of commission or maximum dollar amount):
                      </label>
                      <input
                        id="rebateAmount"
                        type="text"
                        value={rebateAmount}
                        onChange={(e) => setRebateAmount(e.target.value)}
                        style={{ 
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #d1d5db'
                        }}
                        placeholder="e.g., 50% or up to $5,000"
                      />
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginTop: '0.5rem'
                      }}>
                        Specify either a percentage of your commission or a maximum dollar amount you're willing to rebate.
                      </p>
                    </div>
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
                    Your Message to the Buyer:
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
                    placeholder="Introduce yourself and explain how you can help them find their ideal property. Include your qualifications, experience, and why you would be the right agent for them."
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

export default AgentBuyerListingDetail;