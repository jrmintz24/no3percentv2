// src/components/buyer/BuyerListingForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import MessagingPreference from '../shared/MessagingPreference';
import EnhancedPreferenceSelector from '../shared/EnhancedPreferenceSelector';
import { buyerServices } from '../../config/services';

const BuyerListingForm = ({ existingListingMode }) => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Form steps state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    priceRange: { min: '', max: '' },
    locations: [],
    propertyTypes: [],
    bedrooms: '',
    bathrooms: '',
    minSquareFootage: '',
    mustHaveFeatures: [],
    nicesToHaveFeatures: [],
    timeline: 'flexible',
    services: [],
    packageInfo: null,
    paymentPreference: null,
    preferredMoveInDate: '',
    financingType: 'conventional',
    preApprovalStatus: 'none',
    preApprovalAmount: '',
    additionalNotes: '',
    messagingEnabled: true,
    enhancedPreferences: null
  });

  const [currentLocation, setCurrentLocation] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentNiceToHave, setCurrentNiceToHave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(existingListingMode);
  const [progress, setProgress] = useState(0);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update progress when step changes
  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  // Fetch existing listing data if in edit mode
  useEffect(() => {
    const fetchListing = async () => {
      if (!existingListingMode || !listingId) return;
      
      try {
        const docRef = doc(db, 'buyerListings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing data');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchListing();
  }, [existingListingMode, listingId]);

  const propertyTypes = [
    'Single Family Home',
    'Townhouse',
    'Condo',
    'Multi-Family',
    'Land',
    'Other'
  ];

  const financingOptions = [
    { value: 'conventional', label: 'Conventional Loan' },
    { value: 'fha', label: 'FHA Loan' },
    { value: 'va', label: 'VA Loan' },
    { value: 'usda', label: 'USDA Loan' },
    { value: 'cash', label: 'Cash' },
    { value: 'other', label: 'Other' }
  ];

  const preApprovalOptions = [
    { value: 'none', label: 'Not Pre-Approved Yet' },
    { value: 'in-process', label: 'Pre-Approval In Process' },
    { value: 'approved', label: 'Pre-Approved' }
  ];

  const timelineOptions = [
    { value: 'urgent', label: 'Urgent - Need to move in 30 days or less' },
    { value: 'soon', label: 'Soon - Looking to move in 1-3 months' },
    { value: 'planning', label: 'Planning - 3-6 months timeline' },
    { value: 'flexible', label: 'Flexible - No specific timeline' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('propertyTypes')) {
        const currentTypes = formData.propertyTypes;
        setFormData(prev => ({
          ...prev,
          propertyTypes: checked 
            ? [...currentTypes, value]
            : currentTypes.filter(type => type !== value)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddLocation = () => {
    if (currentLocation.trim() && !formData.locations.includes(currentLocation.trim())) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, currentLocation.trim()]
      }));
      setCurrentLocation('');
    }
  };

  const handleRemoveLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim() && !formData.mustHaveFeatures.includes(currentFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        mustHaveFeatures: [...prev.mustHaveFeatures, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleAddNiceToHave = () => {
    if (currentNiceToHave.trim() && !formData.nicesToHaveFeatures.includes(currentNiceToHave.trim())) {
      setFormData(prev => ({
        ...prev,
        nicesToHaveFeatures: [...prev.nicesToHaveFeatures, currentNiceToHave.trim()]
      }));
      setCurrentNiceToHave('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      mustHaveFeatures: prev.mustHaveFeatures.filter((_, i) => i !== index)
    }));
  };
  
  const handleRemoveNiceToHave = (index) => {
    setFormData(prev => ({
      ...prev,
      nicesToHaveFeatures: prev.nicesToHaveFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleServiceSelection = (selectedServices) => {
    setFormData(prev => ({
      ...prev,
      services: selectedServices
    }));
  };

  const handlePackageChange = (packageData) => {
    setFormData(prev => ({
      ...prev,
      packageInfo: packageData,
      services: packageData.allServices
    }));
  };

  const handlePaymentPreferenceChange = (preference) => {
    setFormData(prev => ({
      ...prev,
      paymentPreference: preference
    }));
  };

  const handleMessagingPreferenceChange = (enabled) => {
    setFormData(prev => ({
      ...prev,
      messagingEnabled: enabled
    }));
  };

  // Handler for enhanced preferences
  const handleEnhancedPreferencesChange = (preferences) => {
    setFormData(prev => ({
      ...prev,
      enhancedPreferences: preferences
    }));
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const jumpToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Budget & Financing
        return !!formData.priceRange.min && !!formData.priceRange.max && !!formData.financingType;
      case 2: // Property Preferences
        return formData.locations.length > 0 && formData.propertyTypes.length > 0;
      case 3: // Services
        return formData.services.length > 0;
      case 4: // Agent Preferences
        return true; // Agent preferences are optional
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const listingData = {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: userProfile?.displayName || 'Anonymous',
        verificationStatus: userProfile?.verificationStatus || 'unverified',
        status: 'active',
        updatedAt: serverTimestamp()
      };

      if (!existingListingMode) {
        // Creating a new listing
        listingData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, 'buyerListings'), listingData);
        navigate(`/buyer/listing/${docRef.id}`);
      } else {
        // Updating an existing listing
        const docRef = doc(db, 'buyerListings', listingId);
        await updateDoc(docRef, listingData);
        navigate(`/buyer/listing/${listingId}`);
      }
      
    } catch (err) {
      console.error('Error with listing:', err);
      setError(`Failed to ${existingListingMode ? 'update' : 'create'} listing. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Modern progress indicator style
  const progressBarContainerStyle = {
    width: '100%',
    height: '6px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
  };

  const progressBarStyle = {
    height: '100%',
    width: `${progress}%`,
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '8px',
    transition: 'width 0.4s ease',
    position: 'absolute',
    top: 0,
    left: 0,
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
  };

  // Step navigation button styles
  const StepButton = ({ step, label }) => {
    const isActive = currentStep === step;
    
    return (
      <button
        type="button"
        onClick={() => jumpToStep(step)}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: isActive ? '#6366f1' : 'transparent',
          color: isActive ? 'white' : '#4b5563',
          border: isActive ? 'none' : '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontWeight: isActive ? '600' : '500',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          flex: isMobile ? '1 1 auto' : '0 1 auto',
          justifyContent: 'center',
          boxShadow: isActive ? '0 4px 6px -1px rgba(99, 102, 241, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.75rem',
          height: '1.75rem',
          borderRadius: '50%',
          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
          color: isActive ? 'white' : '#6b7280',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          {step}
        </span>
        {label}
      </button>
    );
  };

  // Render the step indicator with modern styling
  const renderStepIndicator = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={progressBarContainerStyle}>
        <div style={progressBarStyle}></div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: '0.75rem'
      }}>
        <StepButton step={1} label="Budget" />
        <StepButton step={2} label="Property" />
        <StepButton step={3} label="Services" />
        <StepButton step={4} label="Preferences" />
      </div>
    </div>
  );

  // Modern input field styling
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

  const sectionTitleStyle = {
    fontSize: isMobile ? '1.125rem' : '1.25rem', 
    fontWeight: 'bold', 
    marginBottom: '1rem',
    color: '#111827'
  };

  // Step 1: Budget & Financing
  const renderBudgetAndFinancing = () => (
    <div>
      <h2 style={sectionTitleStyle}>
        Budget & Financing Information
      </h2>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        Tell us about your budget and financing situation to help agents understand what you're looking for.
      </p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>
          Price Range*
        </label>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem' 
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#6b7280' }}>$</div>
            <input
              type="number"
              name="priceRange.min"
              value={formData.priceRange.min}
              onChange={handleInputChange}
              placeholder="Min"
              required
              style={{
                ...inputStyle,
                paddingLeft: '1.5rem'
              }}
            />
          </div>
          <span style={{ 
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>to</span>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#6b7280' }}>$</div>
            <input
              type="number"
              name="priceRange.max"
              value={formData.priceRange.max}
              onChange={handleInputChange}
              placeholder="Max"
              required
              style={{
                ...inputStyle,
                paddingLeft: '1.5rem'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <label htmlFor="financingType" style={labelStyle}>
            Financing Type*
          </label>
          <select
            id="financingType"
            name="financingType"
            value={formData.financingType}
            onChange={handleInputChange}
            required
            style={{
              ...inputStyle,
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '0.75rem',
              paddingRight: '2.5rem'
            }}
          >
            {financingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="preApprovalStatus" style={labelStyle}>
            Pre-Approval Status
          </label>
          <select
            id="preApprovalStatus"
            name="preApprovalStatus"
            value={formData.preApprovalStatus}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '0.75rem',
              paddingRight: '2.5rem'
            }}
          >
            {preApprovalOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {formData.preApprovalStatus === 'approved' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="preApprovalAmount" style={labelStyle}>
            Pre-Approval Amount
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#6b7280' }}>$</div>
            <input
              type="number"
              id="preApprovalAmount"
              name="preApprovalAmount"
              value={formData.preApprovalAmount}
              onChange={handleInputChange}
              placeholder="Enter pre-approval amount"
              style={{
                ...inputStyle,
                paddingLeft: '1.5rem'
              }}
            />
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="timeline" style={labelStyle}>
          Your Timeline
        </label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleInputChange}
          style={{
            ...inputStyle,
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '0.75rem',
            paddingRight: '2.5rem'
          }}
        >
          {timelineOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="preferredMoveInDate" style={labelStyle}>
          Preferred Move-in Date
        </label>
        <input
          type="date"
          id="preferredMoveInDate"
          name="preferredMoveInDate"
          value={formData.preferredMoveInDate}
          onChange={handleInputChange}
          style={inputStyle}
        />
      </div>
      
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#f5f3ff',
        border: '1px solid #ddd6fe',
      }}>
        <div style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '1rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            backgroundColor: '#8b5cf6',
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#4c1d95',
            fontWeight: '500'
          }}>
            Being pre-approved and sharing your pre-approval amount can help agents find properties that match your budget and financing situation.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 2: Property Preferences
  const renderPropertyPreferences = () => (
    <div>
      <h2 style={sectionTitleStyle}>
        Property Preferences
      </h2>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        Tell us about your ideal property so agents can find listings that match your needs.
      </p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>
          Preferred Locations*
        </label>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '0.5rem', 
          marginBottom: '0.75rem' 
        }}>
          <input
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            placeholder="Enter a city, neighborhood, or ZIP code"
            style={{
              ...inputStyle,
              flex: '1'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddLocation();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddLocation}
            variant="secondary"
            style={isMobile ? { width: '100%' } : {}}
          >
            Add Location
          </Button>
        </div>
        
        {/* Selected locations */}
        {formData.locations.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {formData.locations.map((location, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                {location}
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1e40af',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '1rem',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Types */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>
          Property Types*
        </label>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          {propertyTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => {
                const currentTypes = formData.propertyTypes;
                setFormData(prev => ({
                  ...prev,
                  propertyTypes: currentTypes.includes(type)
                    ? currentTypes.filter(t => t !== type)
                    : [...currentTypes, type]
                }));
              }}
              style={{
                backgroundColor: formData.propertyTypes.includes(type) ? '#818cf8' : '#f3f4f6',
                color: formData.propertyTypes.includes(type) ? 'white' : '#4b5563',
                padding: '0.5rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: formData.propertyTypes.includes(type) ? '500' : 'normal'
              }}
            >
              {type}
              {formData.propertyTypes.includes(type) && (
                <span style={{ marginLeft: '0.25rem' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Property Features */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <label htmlFor="bedrooms" style={labelStyle}>
            Minimum Bedrooms
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            min="0"
            style={inputStyle}
          />
        </div>
        
        <div>
          <label htmlFor="bathrooms" style={labelStyle}>
            Minimum Bathrooms
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            min="0"
            step="0.5"
            style={inputStyle}
          />
        </div>
        
        <div>
          <label htmlFor="minSquareFootage" style={labelStyle}>
            Minimum Sq. Ft.
          </label>
          <input
            type="number"
            id="minSquareFootage"
            name="minSquareFootage"
            value={formData.minSquareFootage}
            onChange={handleInputChange}
            min="0"
            style={inputStyle}
          />
        </div>
      </div>
      
      {/* Must-Have Features */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#4b5563'
        }}>
          Must-Have Features
        </h3>
        
        {/* Quick-add feature chips */}
        <div style={{ 
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem' 
          }}>
            {[
              'Updated Kitchen', 'Hardwood Floors', 'Garage', 
              'Central AC', 'Walk-in Closet', 'Fireplace', 
              'Pool', 'Patio/Deck', 'Fenced Yard', 
              'Home Office', 'Master Suite', 'Open Floor Plan'
            ].map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => {
                  if (!formData.mustHaveFeatures.includes(feature)) {
                    setFormData(prev => ({
                      ...prev,
                      mustHaveFeatures: [...prev.mustHaveFeatures, feature]
                    }));
                  }
                }}
                style={{
                  backgroundColor: formData.mustHaveFeatures.includes(feature) ? '#ef4444' : '#f3f4f6',
                  color: formData.mustHaveFeatures.includes(feature) ? 'white' : '#4b5563',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: formData.mustHaveFeatures.includes(feature) ? '500' : 'normal'
                }}
              >
                {feature}
                {formData.mustHaveFeatures.includes(feature) && (
                  <span style={{ marginLeft: '0.25rem' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Custom feature input */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          <input
            type="text"
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
            placeholder="Add a must-have feature..."
            style={{
              ...inputStyle,
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : 'auto',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddFeature();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddFeature}
            variant="secondary"
            style={isMobile ? { width: '100%' } : {}}
          >
            Add Must-Have
          </Button>
        </div>
        
        {/* Selected features */}
        {formData.mustHaveFeatures.length > 0 && (
          <div style={{ 
            marginTop: '0.5rem',
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem' 
          }}>
            {formData.mustHaveFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#b91c1c',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '1rem',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Nice-to-Have Features */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#4b5563'
        }}>
          Nice-to-Have Features
        </h3>
        
        {/* Quick-add nice-to-have chips */}
        <div style={{ 
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem' 
          }}>
            {[
              'Smart Home', 'Basement', 'Guest Room', 
              'Mountain View', 'Water View', 'High Ceilings', 
              'Wine Cellar', 'Gym', 'Theater Room', 
              'Solar Panels', 'Garden', 'Outdoor Kitchen'
            ].map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => {
                  if (!formData.nicesToHaveFeatures.includes(feature)) {
                    setFormData(prev => ({
                      ...prev,
                      nicesToHaveFeatures: [...prev.nicesToHaveFeatures, feature]
                    }));
                  }
                }}
                style={{
                  backgroundColor: formData.nicesToHaveFeatures.includes(feature) ? '#10b981' : '#f3f4f6',
                  color: formData.nicesToHaveFeatures.includes(feature) ? 'white' : '#4b5563',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: formData.nicesToHaveFeatures.includes(feature) ? '500' : 'normal'
                }}
              >
                {feature}
                {formData.nicesToHaveFeatures.includes(feature) && (
                  <span style={{ marginLeft: '0.25rem' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Custom nice-to-have input */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          <input
            type="text"
            value={currentNiceToHave}
            onChange={(e) => setCurrentNiceToHave(e.target.value)}
            placeholder="Add a nice-to-have feature..."
            style={{
              ...inputStyle,
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : 'auto',
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNiceToHave();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddNiceToHave}
            variant="secondary"
            style={isMobile ? { width: '100%' } : {}}
          >
            Add Nice-to-Have
          </Button>
        </div>
        
        {/* Selected nice-to-have features */}
        {formData.nicesToHaveFeatures.length > 0 && (
          <div style={{ 
            marginTop: '0.5rem',
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem' 
          }}>
            {formData.nicesToHaveFeatures.map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveNiceToHave(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#065f46',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '1rem',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Additional Notes */}
      <div style={{ marginTop: '1.5rem' }}>
        <label htmlFor="additionalNotes" style={labelStyle}>
          Additional Notes for Agents
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          rows={3}
          placeholder="Any other preferences or requirements..."
          style={{...inputStyle, resize: 'vertical'}}
        />
      </div>
      
      <div style={{ 
        marginTop: '2rem',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            backgroundColor: '#3b82f6',
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#1e40af',
            fontWeight: '500'
          }}>
            The more specific you are with your must-haves vs. nice-to-haves, the better agents can help you find properties that match your needs.
          </p>
        </div>
      </div>
    </div>
  );

  // Step 3: Service Selection
  const renderServiceSelection = () => (
    <div>
      <h2 style={sectionTitleStyle}>
        Select Your Service Package
      </h2>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.875rem',
        lineHeight: '1.5' 
      }}>
        Choose the services you want your agent to provide. This helps agents create competitive proposals tailored to your needs.
      </p>
      
      <ServiceSelector
        services={buyerServices}
        selectedServices={formData.services}
        onSelectionChange={handleServiceSelection}
        userType="buyer"
        onPackageChange={handlePackageChange}
        onPaymentPreferenceChange={handlePaymentPreferenceChange}
        basePropertyValue={Number(formData.priceRange.max) || 500000}
        isMobile={isMobile}
      />
      
      <div style={{ marginTop: '2rem' }}>
        <MessagingPreference
          messagingEnabled={formData.messagingEnabled}
          onChange={handleMessagingPreferenceChange}
          userType="buyer"
        />
      </div>
    </div>
  );

  // Step 4: Agent Preferences - Redesigned and Simplified
  const renderAgentPreferences = () => (
    <div>
      <h2 style={{...sectionTitleStyle, fontSize: isMobile ? '1.25rem' : '1.5rem'}}>
        What Matters Most In Your Agent?
      </h2>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.95rem',
        lineHeight: '1.6'
      }}>
        Help us match you with agents who align with what's important to you. Select the qualities that would make your ideal agent.
      </p>
      
      {/* Simplified preference categories with visual cards */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Communication Style Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              backgroundColor: '#eef2ff',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.5rem', height: '1.5rem' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
            }}>
              Communication Style
            </h3>
          </div>
          
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}>
            How would you prefer your agent to communicate?
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {['Proactive', 'Responsive', 'Detailed', 'Concise', 'Tech-savvy'].map(style => (
              <button
                key={style}
                type="button"
                onClick={() => {
                  const updatedPrefs = {
                    ...formData.enhancedPreferences || {},
                    communication: {
                      ...(formData.enhancedPreferences?.communication || {}),
                      style: style
                    }
                  };
                  handleEnhancedPreferencesChange(updatedPrefs);
                }}
                style={{
                  backgroundColor: formData.enhancedPreferences?.communication?.style === style ? '#6366f1' : '#f9fafb',
                  color: formData.enhancedPreferences?.communication?.style === style ? 'white' : '#4b5563',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  border: '1px solid',
                  borderColor: formData.enhancedPreferences?.communication?.style === style ? '#6366f1' : '#e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: formData.enhancedPreferences?.communication?.style === style ? '0 1px 3px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        
        {/* Experience Level Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.5rem', height: '1.5rem' }}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
            }}>
              Experience Level
            </h3>
          </div>
          
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}>
            How important is an agent's level of experience to you?
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            {[
              { id: 'highly-experienced', label: 'Highly Experienced (7+ years)' },
              { id: 'experienced', label: 'Experienced (3-7 years)' },
              { id: 'any-level', label: 'Any experience level is fine' },
            ].map(option => (
              <label
                key={option.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  backgroundColor: formData.enhancedPreferences?.experience?.level === option.id ? '#f5f3ff' : 'transparent',
                  border: '1px solid',
                  borderColor: formData.enhancedPreferences?.experience?.level === option.id ? '#c4b5fd' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="experience-level"
                  value={option.id}
                  checked={formData.enhancedPreferences?.experience?.level === option.id}
                  onChange={() => {
                    const updatedPrefs = {
                      ...formData.enhancedPreferences || {},
                      experience: {
                        ...(formData.enhancedPreferences?.experience || {}),
                        level: option.id
                      }
                    };
                    handleEnhancedPreferencesChange(updatedPrefs);
                  }}
                  style={{
                    accentColor: '#8b5cf6',
                    width: '1.125rem',
                    height: '1.125rem',
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        
        {/* Availability Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              backgroundColor: '#fff1f2',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.5rem', height: '1.5rem' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
            }}>
              Availability
            </h3>
          </div>
          
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}>
            When do you prefer your agent to be available?
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            {['Weekdays', 'Evenings', 'Weekends'].map(time => (
              <label
                key={time}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.enhancedPreferences?.availability?.includes(time.toLowerCase())}
                  onChange={() => {
                    const currentAvailability = formData.enhancedPreferences?.availability || [];
                    const timeValue = time.toLowerCase();
                    let newAvailability;
                    
                    if (currentAvailability.includes(timeValue)) {
                      newAvailability = currentAvailability.filter(item => item !== timeValue);
                    } else {
                      newAvailability = [...currentAvailability, timeValue];
                    }
                    
                    const updatedPrefs = {
                      ...formData.enhancedPreferences || {},
                      availability: newAvailability
                    };
                    handleEnhancedPreferencesChange(updatedPrefs);
                  }}
                  style={{
                    accentColor: '#e11d48',
                    width: '1rem',
                    height: '1rem',
                  }}
                />
                {time}
              </label>
            ))}
          </div>
        </div>
        
        {/* Search Approach Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{
              backgroundColor: '#ecfdf5',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.5rem', height: '1.5rem' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
            }}>
              Search Approach
            </h3>
          </div>
          
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}>
            What's your preferred style for the home search?
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {[
              { id: 'comprehensive', label: 'Comprehensive - Want to see many options' },
              { id: 'targeted', label: 'Targeted - Only show properties that match key criteria' },
              { id: 'aggressive', label: 'Aggressive - Looking for deals/bargains' },
              { id: 'guided', label: 'Guided - Need lots of advice and guidance' }
            ].map(style => (
              <label
                key={style.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: formData.enhancedPreferences?.search?.approach === style.id ? '#f0fdf4' : '#f9fafb',
                  border: '1px solid',
                  borderColor: formData.enhancedPreferences?.search?.approach === style.id ? '#6ee7b7' : '#e5e7eb',
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="search-approach"
                  value={style.id}
                  checked={formData.enhancedPreferences?.search?.approach === style.id}
                  onChange={() => {
                    const updatedPrefs = {
                      ...formData.enhancedPreferences || {},
                      search: {
                        ...(formData.enhancedPreferences?.search || {}),
                        approach: style.id
                      }
                    };
                    handleEnhancedPreferencesChange(updatedPrefs);
                  }}
                  style={{
                    accentColor: '#10b981',
                    width: '1.125rem',
                    height: '1.125rem'
                  }}
                />
                {style.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Local Knowledge Card */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.5rem', height: '1.5rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
          }}>
            Local Knowledge Importance
          </h3>
        </div>
        
        <p style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          color: '#6b7280',
        }}>
          How important is an agent's knowledge of your preferred locations?
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {[
            { id: 'very-important', label: 'Very Important - Must have deep local knowledge' },
            { id: 'somewhat-important', label: 'Somewhat Important - Some local knowledge needed' },
            { id: 'not-important', label: 'Not Important - Other factors matter more' },
          ].map(option => (
            <label
              key={option.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                backgroundColor: formData.enhancedPreferences?.localKnowledge === option.id ? '#fef3c7' : 'transparent',
                border: '1px solid',
                borderColor: formData.enhancedPreferences?.localKnowledge === option.id ? '#fbbf24' : 'transparent',
              }}
            >
              <input
                type="radio"
                name="local-knowledge"
                value={option.id}
                checked={formData.enhancedPreferences?.localKnowledge === option.id}
                onChange={() => {
                  const updatedPrefs = {
                    ...formData.enhancedPreferences || {},
                    localKnowledge: option.id
                  };
                  handleEnhancedPreferencesChange(updatedPrefs);
                }}
                style={{
                  accentColor: '#d97706',
                  width: '1.125rem',
                  height: '1.125rem',
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
      
      {/* Information about agent proposals */}
      <div style={{
        backgroundColor: '#eff6ff',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #bfdbfe'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: isMobile ? 'flex-start' : 'center',
          marginBottom: '1rem',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            width: '3rem',
            height: '3rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.75rem', height: '1.75rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1e40af'
            }}>Why Your Preferences Matter</h3>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#1e3a8a'
            }}>
              Your preferences help us match you with agents who can best meet your needs. Agents will see what matters to you and tailor their proposals accordingly.
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginTop: '1rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>1</div>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#1e40af'
            }}>
              <strong>Better Matches:</strong> Agents who align with your preferences will be more likely to respond
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>2</div>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#1e40af'
            }}>
              <strong>Transparent Proposals:</strong> Agents will show exactly how they meet your requirements
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>3</div>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#1e40af'
            }}>
              <strong>Smoother Experience:</strong> With the right agent, your home buying process will be more enjoyable
            </p>
          </div>
        </div>
      </div>

      {/* Review summary */}
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
          Your Buyer Profile is Ready!
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
          gap: '1.5rem',
          color: '#4b5563'
        }}>
          <div>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Budget:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#1f2937'
            }}>
              {formData.priceRange.min && formData.priceRange.max 
                ? `$${Number(formData.priceRange.min).toLocaleString()} - $${Number(formData.priceRange.max).toLocaleString()}`
                : 'Not specified'}
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
              fontSize: '1rem',
              fontWeight: '500',
              color: '#1f2937'
            }}>
              {formData.bedrooms ? `${formData.bedrooms}+ bed` : ''} 
              {formData.bathrooms ? ` / ${formData.bathrooms}+ bath` : ''} 
              {formData.minSquareFootage ? ` • ${Number(formData.minSquareFootage).toLocaleString()}+ sq ft` : ''}
              {!formData.bedrooms && !formData.bathrooms && !formData.minSquareFootage ? 'Not specified' : ''}
            </p>
          </div>
          
          <div>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Locations:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem'
            }}>
              {formData.locations.length > 0 
                ? formData.locations.slice(0, 2).join(', ') + (formData.locations.length > 2 ? ` +${formData.locations.length - 2} more` : '')
                : 'No locations specified'}
            </p>
          </div>
          
          <div>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Must-Have Features:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem'
            }}>
              {formData.mustHaveFeatures.length > 0 
                ? formData.mustHaveFeatures.slice(0, 2).join(', ') + (formData.mustHaveFeatures.length > 2 ? ` +${formData.mustHaveFeatures.length - 2} more` : '')
                : 'No must-have features specified'}
            </p>
          </div>
          
          <div>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Financing:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem'
            }}>
              {financingOptions.find(option => option.value === formData.financingType)?.label || 'Not specified'}
              {formData.preApprovalStatus === 'approved' && formData.preApprovalAmount ? ` • Pre-approved for $${Number(formData.preApprovalAmount).toLocaleString()}` : ''}
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
              {formData.services.length > 0 
                ? `${formData.services.length} services selected`
                : 'No services selected'}
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
            Ready to {existingListingMode ? 'update' : 'create'} your buyer profile? Click "{existingListingMode ? 'Update' : 'Create'} Profile" below to publish and start getting responses from qualified agents.
          </p>
        </div>
      </div>
    </div>
  );

  // Define getStepContent inside the component body
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBudgetAndFinancing();
      case 2:
        return renderPropertyPreferences();
      case 3:
        return renderServiceSelection();
      case 4:
        return renderAgentPreferences();
      default:
        return null;
    }
  };

  if (initialLoading) {
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
        height: '300px'
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
        }}>Loading your buyer profile...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem 1rem' 
    }}>
      <Card>
        <CardHeader style={{ 
          padding: isMobile ? '1.25rem' : '1.5rem',
          borderBottom: '1px solid #f3f4f6',
          background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
          borderTopLeftRadius: '0.75rem',
          borderTopRightRadius: '0.75rem',
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              color: 'white',
              fontSize: '0.875rem',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
            {existingListingMode ? 'Edit Your Buyer Profile' : 'Create Your Buyer Profile'}
          </h1>
          <p style={{ 
            color: '#4b5563',
            fontSize: isMobile ? '0.875rem' : '1rem',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Tell us what you're looking for and the services you need. Agents will compete with proposals customized for you.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody style={{ padding: '1.5rem' }}>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: isMobile ? '0.875rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  backgroundColor: '#fecaca',
                  borderRadius: '50%',
                  width: '1.5rem',
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{ color: '#b91c1c', fontWeight: 'bold' }}>!</span>
                </div>
                <span>{error}</span>
              </div>
            )}
            
            {/* Step Indicator */}
            {renderStepIndicator()}
            
            {/* Current Step Content */}
            {getStepContent()}
          </CardBody>

          <CardFooter style={{ 
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #f3f4f6',
            background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
            borderBottomLeftRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between', 
              gap: '1rem' 
            }}>
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      color: '#4b5563',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: isMobile ? '100%' : 'auto',
                      ...(loading ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                  </button>
                )}
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: '1rem' 
              }}>
                {!existingListingMode && (
                  <button
                    type="button"
                    onClick={() => navigate('/buyer')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'transparent',
                      color: '#4b5563',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: isMobile ? 'none' : 'block'
                    }}
                  >
                    Cancel
                  </button>
                )}
                
                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={loading || !isCurrentStepValid()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2)',
                      width: isMobile ? '100%' : 'auto',
                      ...(loading || !isCurrentStepValid() ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                  >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem', marginLeft: '0.25rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
                
                {currentStep === totalSteps && (
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                      boxShadow: '0 4px 6px -1px rgba(109, 40, 217, 0.4)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: isMobile ? '100%' : 'auto',
                      ...(loading ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span style={{ marginLeft: '0.5rem' }}>{existingListingMode ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        {existingListingMode ? 'Update Profile' : 'Create Profile'}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem', marginLeft: '0.25rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      {/* Help tooltip that appears at the bottom of the page */}
      {currentStep === 2 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fffbeb',
          borderRadius: '0.5rem',
          border: '1px solid #fef3c7',
          fontSize: '0.875rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <div style={{
            backgroundColor: '#fef3c7',
            color: '#d97706',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '0.125rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
              Pro Tip: Be specific about your must-have features
            </p>
            <p style={{ margin: '0', lineHeight: '1.5' }}>
              Clearly separating must-have features from nice-to-have features helps agents focus their search efficiently. Be specific about what's truly essential vs. what would be a bonus in your new home.
            </p>
          </div>
        </div>
      )}
      
      {currentStep === 1 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.5rem',
          border: '1px solid #bae6fd',
          fontSize: '0.875rem',
          color: '#0369a1',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <div style={{
            backgroundColor: '#bae6fd',
            color: '#0284c7',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '0.125rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
              Pre-approval can strengthen your profile
            </p>
            <p style={{ margin: '0', lineHeight: '1.5' }}>
              Agents and sellers take buyers more seriously when they're pre-approved for financing. Including your pre-approval details (even if optional) can help you stand out and move quickly when you find the right property.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerListingForm;