// src/components/seller/SellerListingForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import MessagingPreference from '../shared/MessagingPreference';
import EnhancedPreferenceSelector from '../shared/EnhancedPreferenceSelector';
import { sellerServices } from '../../config/services';

const SellerListingForm = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Form steps state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Reduced from 5 to 4 by combining steps
  
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    description: '',
    features: [],
    services: [],
    packageInfo: null,
    photos: [],
    availableForShowing: true,
    occupancyStatus: 'owner',
    preferredClosingDate: '',
    additionalNotes: '',
    messagingEnabled: true,
    enhancedPreferences: null
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const propertyTypes = [
    'Single Family Home',
    'Townhouse',
    'Condo',
    'Multi-Family',
    'Land',
    'Other'
  ];

  const occupancyOptions = [
    { value: 'owner', label: 'Owner Occupied' },
    { value: 'tenant', label: 'Tenant Occupied' },
    { value: 'vacant', label: 'Vacant' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
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

  const handleMessagingPreferenceChange = (enabled) => {
    setFormData(prev => ({
      ...prev,
      messagingEnabled: enabled
    }));
  };

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
      case 1: // Basic Information
        return !!formData.title && !!formData.address && !!formData.price && !!formData.propertyType;
      case 2: // Property Details & Features (combined)
        return !!formData.bedrooms && !!formData.bathrooms && !!formData.squareFootage && !!formData.description;
      case 3: // Service Packages
        return formData.services.length > 0 || (formData.packageInfo && formData.packageInfo.allServices.length > 0);
      case 4: // Agent Preferences and Submit
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
        messagingEnabled: formData.messagingEnabled,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'sellerListings'), listingData);
      
      navigate(`/seller/listing/${docRef.id}`);
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
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
        <StepButton step={1} label="Basics" />
        <StepButton step={2} label="Details" />
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

  // Step 1: Basic Information
  const renderBasicInformation = () => (
    <div>
      <h2 style={sectionTitleStyle}>
        Property Information
      </h2>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        Tell us about your property to help agents understand what you're selling.
      </p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="title" style={labelStyle}>
          Listing Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="e.g., 'Beautiful 3-bedroom home in Downtown'"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="address" style={labelStyle}>
          Property Address*
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          placeholder="Full property address"
          style={inputStyle}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <label htmlFor="price" style={labelStyle}>
            Asking Price*
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            placeholder="Enter price"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="propertyType" style={labelStyle}>
            Property Type*
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
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
            <option value="">Select property type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: '1rem' 
      }}>
        <div>
          <label htmlFor="occupancyStatus" style={labelStyle}>
            Occupancy Status
          </label>
          <select
            id="occupancyStatus"
            name="occupancyStatus"
            value={formData.occupancyStatus}
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
            {occupancyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="preferredClosingDate" style={labelStyle}>
            Preferred Closing Date
          </label>
          <input
            type="date"
            id="preferredClosingDate"
            name="preferredClosingDate"
            value={formData.preferredClosingDate}
            onChange={handleInputChange}
            style={inputStyle}
          />
        </div>
      </div>
      
      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <input
          type="checkbox"
          id="availableForShowing"
          name="availableForShowing"
          checked={formData.availableForShowing}
          onChange={handleInputChange}
          style={{ 
            width: '1.25rem', 
            height: '1.25rem',
            borderRadius: '0.25rem',
            accentColor: '#6366f1'
          }}
        />
        <label htmlFor="availableForShowing" style={{ 
          fontSize: isMobile ? '0.875rem' : '1rem',
          fontWeight: '500'
        }}>
          Property is available for showings
        </label>
      </div>
    </div>
  );

  // Step 2: Combined Property Details & Features
  const renderCombinedDetailsAndFeatures = () => (
    <div>
      <h2 style={sectionTitleStyle}>
        Property Details & Features
      </h2>
      
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        Help your listing stand out by highlighting what makes your property special.
      </p>
      
      {/* Property Details Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div>
          <label htmlFor="bedrooms" style={labelStyle}>
            Bedrooms*
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            required
            min="0"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="bathrooms" style={labelStyle}>
            Bathrooms*
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            required
            min="0"
            step="0.5"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="squareFootage" style={labelStyle}>
            Square Footage*
          </label>
          <input
            type="number"
            id="squareFootage"
            name="squareFootage"
            value={formData.squareFootage}
            onChange={handleInputChange}
            required
            min="0"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="yearBuilt" style={labelStyle}>
            Year Built
          </label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleInputChange}
            min="1800"
            max={new Date().getFullYear()}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="description" style={labelStyle}>
          Property Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          placeholder="Describe your property, highlighting its best features..."
          style={{...inputStyle, resize: 'vertical'}}
        />
      </div>
      
      {/* Property Features Section */}
      <div style={{ 
        marginTop: '2rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#4b5563'
        }}>
          What makes your property special?
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
              'Updated Kitchen', 'Hardwood Floors', 'Granite Counters', 
              'Central AC', 'Walk-in Closet', 'Fireplace', 
              'Garage', 'Pool', 'Patio/Deck', 
              'Stainless Appliances', 'Fenced Yard', 'Smart Home'
            ].map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => {
                  if (!formData.features.includes(feature)) {
                    setFormData(prev => ({
                      ...prev,
                      features: [...prev.features, feature]
                    }));
                  }
                }}
                style={{
                  backgroundColor: formData.features.includes(feature) ? '#818cf8' : '#f3f4f6',
                  color: formData.features.includes(feature) ? 'white' : '#4b5563',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: formData.features.includes(feature) ? '500' : 'normal'
                }}
              >
                {feature}
                {formData.features.includes(feature) && (
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
            placeholder="Add a custom feature..."
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
            Add Custom
          </Button>
        </div>
        
        {/* Selected features */}
        {formData.features.length > 0 && (
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#4338ca',
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
                      color: '#4338ca',
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
          </div>
        )}
      </div>
      
      {/* Additional Notes */}
      <div style={{ marginTop: '2rem' }}>
        <label htmlFor="additionalNotes" style={labelStyle}>
          Additional Notes for Agents
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          rows={3}
          placeholder="Any other information you'd like agents to know..."
          style={{...inputStyle, resize: 'vertical'}}
        />
      </div>
    </div>
  );

  // Step 3: Service Selection with Packages
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
        services={sellerServices}
        selectedServices={formData.services}
        onSelectionChange={handleServiceSelection}
        userType="seller"
        onPackageChange={handlePackageChange}
        basePropertyValue={Number(formData.price) || 500000}
        isMobile={isMobile}
      />
      
      <div style={{ marginTop: '2rem' }}>
        <MessagingPreference
          messagingEnabled={formData.messagingEnabled}
          onChange={handleMessagingPreferenceChange}
          userType="seller"
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
        
        {/* Transaction Approach Card */}
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
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
            }}>
              Transaction Approach
            </h3>
          </div>
          
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}>
            What's your preferred style for the selling process?
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {[
              { id: 'aggressive', label: 'Aggressive - Push for the best price' },
              { id: 'balanced', label: 'Balanced - Good price with smooth process' },
              { id: 'collaborative', label: 'Collaborative - Work closely with buyers' },
              { id: 'quick', label: 'Quick - Focus on selling fast' },
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
                  backgroundColor: formData.enhancedPreferences?.transaction?.approach === style.id ? '#f0fdf4' : '#f9fafb',
                  border: '1px solid',
                  borderColor: formData.enhancedPreferences?.transaction?.approach === style.id ? '#6ee7b7' : '#e5e7eb',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="transaction-approach"
                  value={style.id}
                  checked={formData.enhancedPreferences?.transaction?.approach === style.id}
                  onChange={() => {
                    const updatedPrefs = {
                      ...formData.enhancedPreferences || {},
                      transaction: {
                        ...(formData.enhancedPreferences?.transaction || {}),
                        approach: style.id
                      }
                    };
                    handleEnhancedPreferencesChange(updatedPrefs);
                  }}
                  style={{
                    accentColor: '#10b981',
                    width: '1.125rem',
                    height: '1.125rem',
                  }}
                />
                {style.label}
              </label>
            ))}
          </div>
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
              <strong>Smoother Experience:</strong> With the right agent, your selling process will be more enjoyable
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
          Your Listing is Ready!
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
              Property:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#1f2937'
            }}>
              {formData.bedrooms || '0'} bed / {formData.bathrooms || '0'} bath • {formData.squareFootage ? `${Number(formData.squareFootage).toLocaleString()} sq ft` : ''}
            </p>
          </div>
          
          <div>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Price:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#1f2937'
            }}>
              {formData.price ? `$${Number(formData.price).toLocaleString()}` : 'Not specified'}
            </p>
          </div>
          
          <div>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Features:
            </p>
            <p style={{ 
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem'
            }}>
              {formData.features.length > 0 
                ? formData.features.slice(0, 3).join(', ') + (formData.features.length > 3 ? ` +${formData.features.length - 3} more` : '')
                : 'No features specified'}
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
            Ready to create your listing? Click "Create Listing" below to publish and start getting responses from qualified agents.
          </p>
        </div>
      </div>
    </div>
  );

  // Define renderStepContent inside the component body
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderCombinedDetailsAndFeatures();
      case 3:
        return renderServiceSelection();
      case 4:
        return renderAgentPreferences();
      default:
        return null;
    }
  };

  // Modern button styles
  const primaryButtonStyle = {
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
    width: isMobile ? '100%' : 'auto'
  };
  
  const secondaryButtonStyle = {
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
    width: isMobile ? '100%' : 'auto'
  };
  
  const disabledButtonStyle = {
    opacity: 0.5,
    cursor: 'not-allowed'
  };

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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            List Your Property
          </h1>
          <p style={{ 
            color: '#4b5563',
            fontSize: isMobile ? '0.875rem' : '1rem',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Create your listing and let agents compete with transparent, value-focused proposals designed just for you.
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
                      ...secondaryButtonStyle,
                      ...(loading ? disabledButtonStyle : {}),
                      display: 'flex',
                      alignItems: 'center'
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
                {currentStep < totalSteps && (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={loading || !isCurrentStepValid()}
                    style={{
                      ...primaryButtonStyle,
                      ...(loading || !isCurrentStepValid() ? disabledButtonStyle : {})
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
                      ...primaryButtonStyle,
                      background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                      boxShadow: '0 4px 6px -1px rgba(109, 40, 217, 0.4)',
                      ...(loading ? disabledButtonStyle : {})
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span style={{ marginLeft: '0.5rem' }}>Creating Listing...</span>
                      </>
                    ) : (
                      <>
                        Create Listing
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
      
      {/* Help tooltips that appear at the bottom of the page */}
      {currentStep === 4 && (
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
              Pro Tip: Be specific about your agent preferences
            </p>
            <p style={{ margin: '0', lineHeight: '1.5' }}>
              The more details you provide about what you want in an agent, the better your matches will be. Agents can see your preferences and will tailor their proposals to address your specific needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerListingForm;