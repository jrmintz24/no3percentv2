import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../hooks/useTokens';
import { spendTokenForBid, addTokens } from '../../services/firebase/tokens';
import { calculateTokenCost, getHighestPriorityBid } from '../../services/firebase/tokenPricing';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import EnhancedProposalOptions from '../shared/EnhancedProposalOptions';
import { sellerServices } from '../../config/services';
import { subscriptionTiers, tokenPackages, getTokenPackagePrice } from '../../config/subscriptions';

const AgentSellerListingDetail = () => {
  const { listingId } = useParams();
  const { currentUser, userProfile, getUserSubscriptionTier } = useAuth();
  const { tokens, loading: tokensLoading } = useTokens();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
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
  const [enhancedDetails, setEnhancedDetails] = useState(null);
  
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
  
  // Add step system for proposal form
  const [currentProposalStep, setCurrentProposalStep] = useState(1);
  const totalProposalSteps = 3;
  
  // Add ref for bid form
  const bidFormRef = useRef(null);
  
  // Get user subscription tier
  const userTier = getUserSubscriptionTier(userProfile);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
      
      // Set commission rate based on the new package structure
      const packageRates = {
        'essential': '1.25',
        'full': '2.75',
        'premium': '3.5',
        'custom': ''
      };
      setCommissionRate(packageRates[info.packageId] || '');
    }
  };

  const handleEnhancedDetailsChange = (details) => {
    setEnhancedDetails(details);
  };
  
  const goToNextProposalStep = () => {
    if (currentProposalStep < totalProposalSteps) {
      setCurrentProposalStep(currentProposalStep + 1);
      window.scrollTo(0, bidFormRef.current.offsetTop);
    }
  };

  const goToPreviousProposalStep = () => {
    if (currentProposalStep > 1) {
      setCurrentProposalStep(currentProposalStep - 1);
      window.scrollTo(0, bidFormRef.current.offsetTop);
    }
  };

  const isCurrentProposalStepValid = () => {
    switch (currentProposalStep) {
      case 1: // Services & Fees
        return selectedServices.length > 0 && 
              ((feeStructure === 'percentage' && commissionRate.trim()) || 
               (feeStructure === 'flat' && flatFee.trim()));
      case 2: // Boost & Extras
        return true; // These are optional
      case 3: // Message & Submit
        return bidMessage.trim().length > 0;
      default:
        return false;
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
      
      // Create the proposal document with priority information and enhanced details
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
        // Enhanced details
        enhancedDetails: enhancedDetails,
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
      setEnhancedDetails(null);
      setCurrentProposalStep(1);
      
      // Show a success notification
      alert('Your proposal has been submitted successfully!');
      setAlreadyBid(true); // Update UI to show user has bid
      
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setBidError('Error submitting your proposal');
    } finally {
      setBidLoading(false);
    }
  };
  
  // Step indicator for proposal form
  const renderProposalStepIndicator = () => {
    // Progress percentage
    const progress = ((currentProposalStep) / totalProposalSteps) * 100;
    
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '8px',
            transition: 'width 0.4s ease',
            position: 'absolute',
            top: 0,
            left: 0,
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
          }}></div>
        </div>
        
        {/* Step buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: '0.75rem'
        }}>
          <StepButton 
            step={1} 
            label="Services & Fees" 
            active={currentProposalStep === 1} 
            onClick={() => setCurrentProposalStep(1)} 
          />
          <StepButton 
            step={2} 
            label="Boost & Extras" 
            active={currentProposalStep === 2} 
            onClick={() => currentProposalStep >= 2 ? setCurrentProposalStep(2) : null} 
            disabled={currentProposalStep < 2}
          />
          <StepButton 
            step={3} 
            label="Message & Submit" 
            active={currentProposalStep === 3} 
            onClick={() => currentProposalStep >= 3 ? setCurrentProposalStep(3) : null} 
            disabled={currentProposalStep < 3}
          />
        </div>
      </div>
    );
  };
  
  // Step button component
  const StepButton = ({ step, label, active, onClick, disabled }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: active ? '#6366f1' : disabled ? '#f9fafb' : 'transparent',
          color: active ? 'white' : disabled ? '#9ca3af' : '#4b5563',
          border: active ? 'none' : '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontWeight: active ? '600' : '500',
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          flex: isMobile ? '1 1 auto' : '0 1 auto',
          justifyContent: 'center',
          boxShadow: active ? '0 4px 6px -1px rgba(99, 102, 241, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
          opacity: disabled ? 0.7 : 1
        }}
      >
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.75rem',
          height: '1.75rem',
          borderRadius: '50%',
          backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
          color: active ? 'white' : disabled ? '#9ca3af' : '#6b7280',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          {step}
        </span>
        {label}
      </button>
    );
  };
  
  // Render step content for proposal form
  const renderProposalStepContent = () => {
    const inputStyle = {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      fontSize: isMobile ? '0.875rem' : '1rem',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
      backgroundColor: '#f9fafb',
      outline: 'none',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    };

    const labelStyle = {
      display: 'block', 
      marginBottom: '0.5rem', 
      fontWeight: '500',
      fontSize: isMobile ? '0.875rem' : '1rem',
      color: '#4b5563'
    };
    
    switch (currentProposalStep) {
      case 1: // Services & Fees
        return (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
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
              <label style={labelStyle}>
                Fee Structure:
              </label>
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: feeStructure === 'percentage' ? '#f0f7ff' : 'transparent',
                  border: '1px solid',
                  borderColor: feeStructure === 'percentage' ? '#bfdbfe' : '#e5e7eb',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="feeStructure"
                    value="percentage"
                    checked={feeStructure === 'percentage'}
                    onChange={() => setFeeStructure('percentage')}
                    style={{ 
                      marginRight: '0.5rem',
                      accentColor: '#3b82f6'
                    }}
                  />
                  Percentage Commission
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: feeStructure === 'flat' ? '#f0f7ff' : 'transparent',
                  border: '1px solid',
                  borderColor: feeStructure === 'flat' ? '#bfdbfe' : '#e5e7eb',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="feeStructure"
                    value="flat"
                    checked={feeStructure === 'flat'}
                    onChange={() => setFeeStructure('flat')}
                    style={{ 
                      marginRight: '0.5rem',
                      accentColor: '#3b82f6'
                    }}
                  />
                  Flat Fee
                </label>
              </div>
            </div>
            
            {feeStructure === 'percentage' ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="commissionRate" style={labelStyle}>
                  Your Proposed Commission Rate:
                </label>
                <input
                  id="commissionRate"
                  type="text"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="e.g., 2.5%, 3%, etc."
                />
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="flatFee" style={labelStyle}>
                  Your Proposed Flat Fee:
                </label>
                <input
                  id="flatFee"
                  type="text"
                  value={flatFee}
                  onChange={(e) => setFlatFee(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="e.g., $5,000, $7,500, etc."
                />
              </div>
            )}
          </>
        );
        
      case 2: // Boost & Extras
        return (
          <>
            {/* Priority Boost Section */}
            <div style={{ 
              marginBottom: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#fffbeb',
              borderRadius: '0.75rem',
              border: '1px solid #fef3c7'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#fbbf24',
                  color: 'white',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.25rem'
                }}>
                  ⭐
                </div>
                <div>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#92400e'
                  }}>
                    Priority Boost (Optional)
                  </h3>
                  
                  <p style={{ 
                    margin: 0,
                    fontSize: '0.875rem', 
                    color: '#92400e',
                    lineHeight: '1.5'
                  }}>
                    Add extra tokens to appear higher in the seller's proposal list.
                    Current highest priority: {highestBid} tokens.
                  </p>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                border: '1px solid #fde68a' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
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
                        width: '80px'
                      }}
                    />
                  </label>
                  
                  <span style={{ 
                    color: '#6b7280',
                    fontWeight: '500',
                    marginLeft: 'auto'
                  }}>
                    Total cost: {tokenCost + boostAmount} tokens
                  </span>
                </div>
                
                {boostAmount > 0 && (
                  <div style={{ 
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: boostAmount + tokenCost > highestBid ? '#ecfdf5' : '#f3f4f6',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {boostAmount + tokenCost > highestBid ? (
                      <>
                        <span style={{ fontSize: '1.25rem' }}>🌟</span>
                        <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                          Your proposal will appear first!
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.25rem' }}>📊</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Your proposal will appear below higher bids
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Services Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="additionalServices" style={labelStyle}>
                Additional Services (Optional):
              </label>
              <textarea
                id="additionalServices"
                value={additionalServices}
                onChange={(e) => setAdditionalServices(e.target.value)}
                rows={3}
                style={{ 
                  ...inputStyle,
                  resize: 'vertical'
                }}
                placeholder="List any additional services not mentioned above that you can provide to help sell this property"
              />
            </div>
            
            {/* Marketing Strategy Highlight */}
            <div style={{ 
              marginBottom: '1.5rem',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
            }}>
              <div style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: '1rem',
                marginBottom: '0.75rem',
              }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#065f46',
                  fontWeight: '500'
                }}>
                  Set yourself apart by highlighting your unique marketing strategy and selling approach in your proposal.
                </p>
              </div>
            </div>
            
            {/* Enhanced Proposal Options */}
            <div style={{ marginBottom: '1rem' }}>
              <EnhancedProposalOptions
                userType="seller"
                onChange={handleEnhancedDetailsChange}
              />
            </div>
          </>
        );
        
      case 3: // Message & Submit
        return (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="bidMessage" style={labelStyle}>
                Your Message to the Seller:
              </label>
              <textarea
                id="bidMessage"
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                required
                rows={8}
                style={{ 
                  ...inputStyle,
                  resize: 'vertical'
                }}
                placeholder="Introduce yourself and explain your strategy for selling their property. Include your qualifications, selling experience in the area, and why you would be the right agent for them."
              />
            </div>
            
            {/* Review Summary Section */}
            <div style={{ 
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f5f3ff',
              borderRadius: '0.75rem',
              border: '1px solid #ddd6fe',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.25rem',
                color: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 1px 3px rgba(124, 58, 237, 0.4)'
                }}>✓</div>
                Your Proposal Is Ready!
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                gap: '1.5rem'
              }}>
                <div>
                  <p style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Fees:
                  </p>
                  <p style={{ 
                    margin: '0 0 0.75rem 0',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#1f2937'
                  }}>
                    {feeStructure === 'percentage' 
                      ? `${commissionRate}% Commission` 
                      : `$${flatFee} Flat Fee`}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Services:
                  </p>
                  <p style={{ 
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {selectedServices.length > 0 
                      ? `${selectedServices.length} services selected`
                      : 'No services selected'}
                    {packageInfo && ` (${packageInfo.packageName} package)`}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Token Cost:
                  </p>
                  <p style={{ 
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {tokenCost + boostAmount} token{(tokenCost + boostAmount) !== 1 ? 's' : ''}
                    {boostAmount > 0 ? ` (includes ${boostAmount} boost)` : ''}
                  </p>
                </div>
                
                <div>
                  <p style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Property:
                  </p>
                  <p style={{ 
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.875rem'
                  }}>
                    {listing.address ? `${listing.address}` : 'Address not specified'}
                  </p>
                </div>
              </div>
              
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e9d5ff'
              }}>
                <p style={{
                  margin: '0',
                  fontSize: '0.875rem',
                  color: '#6d28d9',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  Ready to submit your proposal? Click "Submit Proposal" below to send it to the seller.
                </p>
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  if (loading || tokensLoading) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          border: '3px solid #e5e7eb',
          borderTopColor: '#6366f1',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{
          color: '#4b5563',
          fontSize: '1rem',
          fontWeight: '500'
        }}>Loading listing details...</p>
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
          padding: '1.5rem', 
          borderRadius: '0.75rem', 
          marginBottom: '1.5rem',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: '#fecaca',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#b91c1c" style={{ width: '1.25rem', height: '1.25rem' }}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1.125rem' }}>Error</h3>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        </div>
        <Button 
          to="/agent/listings" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#f3f4f6',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontWeight: '500',
            fontSize: '0.875rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to Listings
        </Button>
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
          padding: '1.5rem', 
          borderRadius: '0.75rem', 
          marginBottom: '1.5rem',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: '#fecaca',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#b91c1c" style={{ width: '1.25rem', height: '1.25rem' }}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1.125rem' }}>Listing Not Found</h3>
            <p style={{ margin: 0 }}>The seller listing you're looking for could not be found.</p>
          </div>
        </div>
        <Button 
          to="/agent/listings" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#f3f4f6',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontWeight: '500',
            fontSize: '0.875rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to Listings
        </Button>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: '1rem'
      }}>
        <Button 
          to="/agent/listings" 
          variant="secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'white',
            color: '#4b5563',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontWeight: '500',
            fontSize: '0.875rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            textDecoration: 'none'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to Listings
        </Button>
        
        {!bidOpen && !alreadyBid && (
          tokens < tokenCost ? (
            <Button 
              onClick={() => setShowTokenPurchase(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.4), 0 2px 4px -1px rgba(245, 158, 11, 0.2)',
                flexGrow: isMobile ? 1 : 0
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clipRule="evenodd" />
              </svg>
              Need More Tokens ({tokenCost} required)
            </Button>
          ) : (
            <Button 
              onClick={() => setBidOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2)',
                flexGrow: isMobile ? 1 : 0
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Submit Proposal ({tokenCost} Token{tokenCost !== 1 ? 's' : ''})
            </Button>
          )
        )}
        
        {alreadyBid && (
          <div style={{ 
            backgroundColor: '#e0f2fe', 
            color: '#0369a1', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #bae6fd',
            flexGrow: isMobile ? 1 : 0,
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.813a.75.75 0 011.05-.147z" clipRule="evenodd" />
            </svg>
            Proposal Submitted
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
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                Purchase Tokens
              </h2>
              <button
                onClick={() => setShowTokenPurchase(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
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
                borderRadius: '0.5rem', 
                marginBottom: '1.5rem',
                border: '1px solid #fecaca'
              }}>
                {purchaseError}
              </div>
            )}
            
            {purchaseSuccess && (
              <div style={{ 
                backgroundColor: '#dcfce7', 
                color: '#15803d', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1.5rem',
                border: '1px solid #86efac',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {purchaseSuccess}
              </div>
            )}

            <div style={{ 
              marginBottom: '1.5rem',
              padding: '1.25rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Current Balance:
                </p>
                <p style={{ 
                  margin: 0,
                  fontWeight: '600',
                  fontSize: '1.25rem',
                  color: '#1f2937'
                }}>
                  {tokens} token{tokens !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderTop: '1px solid #e5e7eb'
              }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Required for this listing:
                </p>
                <p style={{ 
                  margin: 0,
                  fontWeight: '500',
                  color: '#1f2937'
                }}>
                  {tokenCost} token{tokenCost !== 1 ? 's' : ''}
                </p>
              </div>
              
              {userTier.tokenDiscount > 0 && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.5rem',
                  color: '#059669',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid #d1fae5'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.35a.75.75 0 000 1.5h.737a5.25 5.25 0 01-.367 3.072l-.055.123a.75.75 0 00.848 1.037l1.272-.283a3.493 3.493 0 011.604.021 4.992 4.992 0 002.422 0l.97-.242a.75.75 0 00.848-1.037l-.055-.123a5.25 5.25 0 01-.367-3.072h.737a.75.75 0 000-1.5h-.35c.066-.357.1-.721.1-1.085V8A4 4 0 008.732 6.232z" clipRule="evenodd" />
                  </svg>
                  <span>Your {userTier.name} subscription gives you {userTier.tokenDiscount * 100}% off token purchases!</span>
                </div>
              )}
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {Object.values(tokenPackages).map((pkg) => {
                const pricing = getTokenPackagePrice(pkg.id, userTier.id);
                return (
                  <div 
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    style={{ 
                      border: selectedPackage === pkg.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      position: 'relative',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPackage === pkg.id ? '0 4px 6px -1px rgba(59, 130, 246, 0.2)' : 'none'
                    }}
                  >
                    {pkg.popular && (
                      <div style={{ 
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Most Popular
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {pkg.name}
                    </h3>
                    
                    <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#3b82f6', textAlign: 'center', marginBottom: '0.5rem' }}>
                      ${pricing.discountedPrice}
                      {pricing.discount > 0 && (
                        <div style={{ fontSize: '0.875rem', color: '#059669', textDecoration: 'line-through' }}>
                          ${pricing.originalPrice}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{pkg.tokens}</span> Tokens
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        cursor: 'pointer'
                      }}>
                        <input 
                          type="radio" 
                          id={`pkg-${pkg.id}`} 
                          name="tokenPackage" 
                          checked={selectedPackage === pkg.id}
                          onChange={() => setSelectedPackage(pkg.id)}
                          style={{ 
                            width: '1.125rem',
                            height: '1.125rem',
                            accentColor: '#3b82f6'
                          }}
                        />
                        Select
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: isMobile ? 'wrap' : 'nowrap'
            }}>
              <Button 
                onClick={handleTokenPurchase}
                disabled={!selectedPackage || purchaseLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  cursor: purchaseLoading || !selectedPackage ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4), 0 2px 4px -1px rgba(37, 99, 235, 0.2)',
                  opacity: purchaseLoading || !selectedPackage ? 0.7 : 1,
                  flexGrow: isMobile ? 1 : 0
                }}
              >
                {purchaseLoading ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'white',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Purchase Tokens
                  </>
                )}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => setShowTokenPurchase(false)}
                disabled={purchaseLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'white',
                  color: '#4b5563',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  cursor: purchaseLoading ? 'not-allowed' : 'pointer',
                  opacity: purchaseLoading ? 0.7 : 1,
                  flexGrow: isMobile ? 1 : 0
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Card style={{
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        <CardHeader style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f3f4f6',
          background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              margin: '0 0 0.5rem 0',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.5rem', height: '1.5rem' }}>
                <path d="M14.916 2.404a.75.75 0 01-.32 1.012l-.596.31V17a1 1 0 01-1 1h-2.26a.75.75 0 01-.75-.75v-3.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H2V9.957a.75.75 0 01-.596-1.372L2 8.275V5.75a.75.75 0 011.5 0v1.745l10.404-5.41a.75.75 0 011.012.32zM15.861 8.57a.75.75 0 01.736-.025l1.999 1.04A.75.75 0 0118 10.957V16.5h.25a.75.75 0 110 1.5h-2a.75.75 0 01-.75-.75V9.21a.75.75 0 01.361-.64z" />
              </svg>
              {listing.title || listing.propertyName || 'Property For Sale'}
            </h1>
          </div>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              backgroundColor: '#e0f2fe', 
              color: '#0369a1', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                <path d="M13.92 3.845a19.361 19.361 0 01-6.3 1.98C6.765 5.942 5.89 6 5 6a4 4 0 00-.504 7.969 15.974 15.974 0 001.271 3.34c.397.77 1.342 1 2.05.59l.867-.5c.726-.42.94-1.321.588-2.021-.166-.33-.315-.666-.448-1.004 1.8.358 3.511.964 5.096 1.78A4 4 0 0017.5 10c0-1.109-.388-2.128-1.02-2.95L15.24 5.11a1 1 0 10-1.75.97l1.23 1.94-.002.001a2.508 2.508 0 00-.58.596A15.968 15.968 0 0013.92 3.845z" />
              </svg>
              Seller Listing
            </div>
            
            {listing.verificationStatus === 'verified' && (
              <div style={{ 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem', 
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                  <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardBody style={{ padding: '0' }}>
          {/* Summary Bar Section */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{
              flex: '1 1 auto',
              minWidth: isMobile ? '100%' : '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                backgroundColor: '#e0f2fe',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0369a1',
                flexShrink: 0
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path fillRule="evenodd" d="M10.362 1.093a.75.75 0 00-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925zM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0018 14.25V6.443zm-8.75 12.25v-8.25l-7.25-4v7.807a.75.75 0 00.388.657l6.862 3.786z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Price</div>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  {listing.price 
                    ? `${Number(listing.price).toLocaleString()}`
                    : 'Not specified'}
                </div>
              </div>
            </div>
            
            <div style={{
              flex: '1 1 auto',
              minWidth: isMobile ? 'calc(50% - 0.75rem)' : '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                backgroundColor: '#fef3c7',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                flexShrink: 0
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Property Type</div>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  {listing.propertyType || 'Not specified'}
                </div>
              </div>
            </div>
            
            <div style={{
              flex: '1 1 auto',
              minWidth: isMobile ? 'calc(50% - 0.75rem)' : '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                backgroundColor: '#f0fdf4',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
                flexShrink: 0
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Bedrooms/Baths</div>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  {listing.bedrooms ? `${listing.bedrooms} bed` : ''} 
                  {listing.bathrooms ? ` / ${listing.bathrooms} bath` : ''}
                  {!listing.bedrooms && !listing.bathrooms ? 'Not specified' : ''}
                </div>
              </div>
            </div>
            
            <div style={{
              flex: '1 1 auto',
              minWidth: isMobile ? '100%' : '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                backgroundColor: '#f3e8ff',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6',
                flexShrink: 0
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Address</div>
                <div style={{ fontWeight: '600', color: '#111827', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {listing.address || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" />
                  <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                </svg>
                Property Description
              </h2>
              
              <p style={{ 
                color: '#4b5563', 
                lineHeight: '1.6',
                fontSize: '0.95rem',
                margin: 0
              }}>
                {listing.description || 'No description provided'}
              </p>
            </div>
            
            {/* Property Features */}
            {listing.features && listing.features.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                  </svg>
                  Property Features
                </h2>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  {listing.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#eef2ff',
                        color: '#4f46e5',
                        padding: '0.5rem 0.875rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem' }}>
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.813a.75.75 0 011.05-.147z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Property Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
                Property Details
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                gap: '1.5rem' 
              }}>
                {listing.squareFootage && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4b5563" style={{ width: '1.5rem', height: '1.5rem' }}>
                        <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zM15 17a1 1 0 001-1V4a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1h10z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        margin: '0 0 0.25rem 0',
                        color: '#6b7280'
                      }}>
                        Square Footage
                      </h3>
                      <p style={{ 
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {Number(listing.squareFootage).toLocaleString()} sq ft
                      </p>
                    </div>
                  </div>
                )}
                
                {listing.yearBuilt && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4b5563" style={{ width: '1.5rem', height: '1.5rem' }}>
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        margin: '0 0 0.25rem 0',
                        color: '#6b7280'
                      }}>
                        Year Built
                      </h3>
                      <p style={{ 
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {listing.yearBuilt}
                      </p>
                    </div>
                  </div>
                )}
                
                {listing.occupancyStatus && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4b5563" style={{ width: '1.5rem', height: '1.5rem' }}>
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        margin: '0 0 0.25rem 0',
                        color: '#6b7280'
                      }}>
                        Occupancy
                      </h3>
                      <p style={{ 
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {listing.occupancyStatus === 'owner' ? 'Owner Occupied' : 
                         listing.occupancyStatus === 'tenant' ? 'Tenant Occupied' : 
                         listing.occupancyStatus === 'vacant' ? 'Vacant' : 
                         'Not specified'}
                      </p>
                    </div>
                  </div>
                )}
                
                {listing.preferredClosingDate && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4b5563" style={{ width: '1.5rem', height: '1.5rem' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        margin: '0 0 0.25rem 0',
                        color: '#6b7280'
                      }}>
                        Preferred Closing
                      </h3>
                      <p style={{ 
                        margin: 0,
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {new Date(listing.preferredClosingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Preferences Section - NEW! */}
            {listing.enhancedPreferences && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#8b5cf6" style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path fillRule="evenodd" d="M8.5 3.528v4.644c0 .729-.29 1.428-.805 1.944l-1.217 1.216a8.75 8.75 0 013.55.621l.502.201a7.25 7.25 0 004.178.365l-2.403-2.403a2.75 2.75 0 01-.805-1.944V3.528a40.205 40.205 0 00-3 0zm4.5.084l.19.015a.75.75 0 10.12-1.495 41.364 41.364 0 00-6.62 0 .75.75 0 00.12 1.495L7 3.612v4.56c0 .331-.132.649-.366.883L2.6 13.09c-1.496 1.496-.817 4.15 1.403 4.475C5.961 17.852 7.963 18 10 18s4.039-.148 5.997-.436c2.22-.325 2.9-2.979 1.403-4.475l-4.034-4.034A1.25 1.25 0 0113 8.172v-4.56z" clipRule="evenodd" />
                  </svg>
                  Additional Agent Preferences
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                  gap: '1.5rem' 
                }}>
                  {/* Communication Preferences Card */}
                  {listing.enhancedPreferences.communication && (
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        marginBottom: '1rem',
                        color: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                          <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
                        </svg>
                        Communication Preferences
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        {/* Communication Style */}
                        {listing.enhancedPreferences.communication.style && (
                          <div>
                            <h4 style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500', 
                              marginBottom: '0.5rem',
                              color: '#4b5563'
                            }}>
                              Preferred Style:
                            </h4>
                            <div style={{
                              display: 'inline-block',
                              backgroundColor: '#eef2ff',
                              color: '#4f46e5',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              border: '1px solid #e0e7ff'
                            }}>
                              {listing.enhancedPreferences.communication.style}
                            </div>
                          </div>
                        )}
                        
                        {/* Languages */}
                        {listing.enhancedPreferences.communication.languages?.length > 0 && (
                          <div>
                            <h4 style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500', 
                              marginBottom: '0.5rem',
                              color: '#4b5563'
                            }}>
                              Language Preferences:
                            </h4>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}>
                              {listing.enhancedPreferences.communication.languages.map((language, index) => (
                                <span
                                  key={index}
                                  style={{
                                    backgroundColor: '#e0f2fe',
                                    color: '#0369a1',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                  }}
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Communication Methods */}
                        {listing.enhancedPreferences.communication.communicationMethods?.length > 0 && (
                          <div>
                            <h4 style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500', 
                              marginBottom: '0.5rem',
                              color: '#4b5563'
                            }}>
                              Preferred Methods:
                            </h4>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}>
                              {listing.enhancedPreferences.communication.communicationMethods.map((method, index) => (
                                <span
                                  key={index}
                                  style={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#4b5563',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    border: '1px solid #e5e7eb'
                                  }}
                                >
                                  {method === 'email' ? 'Email' : 
                                   method === 'phone' ? 'Phone Calls' : 
                                   method === 'text' ? 'Text Messages' : 
                                   method === 'video' ? 'Video Calls' : 
                                   method === 'inPerson' ? 'In-Person' : method}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Transaction Approach Card */}
                  {listing.enhancedPreferences.transaction && (
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        marginBottom: '1rem',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                          <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clipRule="evenodd" />
                        </svg>
                        Transaction Approach
                      </h3>
                      
                      <div>
                        <h4 style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          marginBottom: '0.5rem',
                          color: '#4b5563'
                        }}>
                          Preferred Approach:
                        </h4>
                        <div style={{
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          border: '1px solid #d1fae5'
                        }}>
                          {listing.enhancedPreferences.transaction.approach === 'aggressive' ? 'Aggressive - Push for the best price' : 
                           listing.enhancedPreferences.transaction.approach === 'balanced' ? 'Balanced - Good price with smooth process' : 
                           listing.enhancedPreferences.transaction.approach === 'collaborative' ? 'Collaborative - Work closely with buyers' : 
                           listing.enhancedPreferences.transaction.approach === 'quick' ? 'Quick - Focus on selling fast' : 
                           listing.enhancedPreferences.transaction.approach}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Services Section */}
            {listing.services && listing.services.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Requested Services
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                  gap: '1.5rem' 
                }}>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      marginBottom: '1rem',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.813a.75.75 0 011.05-.147z" clipRule="evenodd" />
                      </svg>
                      Must-Have Services
                    </h3>
                    
                    {listing.services.mustHave && listing.services.mustHave.length > 0 ? (
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {listing.services.mustHave.map((service, index) => (
                          <li key={index} style={{ fontSize: '0.875rem' }}>{service}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ 
                        color: '#6b7280', 
                        fontStyle: 'italic',
                        margin: 0,
                        fontSize: '0.875rem'
                      }}>
                        No must-have services specified
                      </p>
                    )}
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      marginBottom: '1rem',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Nice-to-Have Services
                    </h3>
                    
                    {listing.services.niceToHave && listing.services.niceToHave.length > 0 ? (
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {listing.services.niceToHave.map((service, index) => (
                          <li key={index} style={{ fontSize: '0.875rem' }}>{service}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ 
                        color: '#6b7280', 
                        fontStyle: 'italic',
                        margin: 0,
                        fontSize: '0.875rem'
                      }}>
                        No nice-to-have services specified
                      </p>
                    )}
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      marginBottom: '1rem',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                        <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                      </svg>
                      Not Interested In
                    </h3>
                    
                    {listing.services.notInterested && listing.services.notInterested.length > 0 ? (
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {listing.services.notInterested.map((service, index) => (
                          <li key={index} style={{ fontSize: '0.875rem' }}>{service}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ 
                        color: '#6b7280', 
                        fontStyle: 'italic',
                        margin: 0,
                        fontSize: '0.875rem'
                      }}>
                        No services specified as 'not interested'
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Additional Information Section */}
            {listing.additionalInfo && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.25rem', height: '1.25rem' }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                  Additional Notes
                </h2>
                
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <p style={{ 
                    margin: 0,
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    color: '#4b5563'
                  }}>
                    {listing.additionalInfo}
                  </p>
                </div>
              </div>
            )}
            
            {/* Proposal Form Section */}
            {bidOpen && (
              <div 
                ref={bidFormRef}
                style={{ 
                  marginTop: '2rem',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  marginBottom: '1.5rem',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6366f1" style={{ width: '1.5rem', height: '1.5rem' }}>
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Create Your Proposal
                </h2>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#e0f2fe',
                  borderRadius: '0.5rem',
                  color: '#0369a1',
                  border: '1px solid #bae6fd'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', flexShrink: 0 }}>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>
                      This proposal will cost {tokenCost + boostAmount} token{(tokenCost + boostAmount) !== 1 ? 's' : ''}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem' }}>
                      You currently have {tokens} token{tokens !== 1 ? 's' : ''}
                      {costFactors && (
                        <span style={{ display: 'block', marginTop: '0.25rem' }}>
                          Base cost: {tokenCost} token{tokenCost !== 1 ? 's' : ''} 
                          {listing.verificationStatus === 'verified' ? ' (Verified listing 1.5x) • ' : ' • '}
                          {costFactors.bidCount} existing bid{costFactors.bidCount !== 1 ? 's' : ''}
                          {costFactors.demandMultiplier > 1 ? ` (${costFactors.demandMultiplier}x demand)` : ''}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                {bidError && (
                  <div style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#b91c1c', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    marginBottom: '1.5rem',
                    border: '1px solid #fecaca',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {bidError}
                  </div>
                )}
                
                <form onSubmit={handleSubmitBid}>
                  {/* Step Indicator */}
                  {renderProposalStepIndicator()}
                  
                  {/* Step Content */}
                  {renderProposalStepContent()}
                  
                  {/* Step Navigation */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '2rem',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '1.5rem'
                  }}>
                    <div>
                      {currentProposalStep > 1 && (
                        <button
                          type="button"
                          onClick={goToPreviousProposalStep}
                          disabled={bidLoading}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'white',
                            color: '#4b5563',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            fontWeight: '500',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                          </svg>
                          Back
                        </button>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem'
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setBidOpen(false);
                          setCurrentProposalStep(1);
                        }}
                        disabled={bidLoading}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#4b5563',
                          border: 'none',
                          padding: '0.75rem',
                          fontWeight: '500',
                          fontSize: '0.875rem',
                          cursor: bidLoading ? 'not-allowed' : 'pointer',
                          borderRadius: '0.5rem'
                        }}
                      >
                        Cancel
                      </button>
                      
                      {currentProposalStep < totalProposalSteps && (
                        <button
                          type="button"
                          onClick={goToNextProposalStep}
                          disabled={bidLoading || !isCurrentProposalStepValid()}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: bidLoading || !isCurrentProposalStepValid() ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2)',
                            opacity: bidLoading || !isCurrentProposalStepValid() ? 0.7 : 1
                          }}
                        >
                          Continue
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      
                      {currentProposalStep === totalProposalSteps && (
                        <button
                          type="submit"
                          disabled={bidLoading || !isCurrentProposalStepValid() || tokens < (tokenCost + boostAmount)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: bidLoading || !isCurrentProposalStepValid() || tokens < (tokenCost + boostAmount) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px -1px rgba(109, 40, 217, 0.4)',
                            opacity: bidLoading || !isCurrentProposalStepValid() || tokens < (tokenCost + boostAmount) ? 0.7 : 1
                          }}
                        >
                          {bidLoading ? (
                            <>
                              <div style={{
                                width: '1rem',
                                height: '1rem',
                                borderRadius: '50%',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderTopColor: 'white',
                                animation: 'spin 1s linear infinite'
                              }}></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Proposal
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem' }}>
                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                              </svg>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AgentSellerListingDetail;