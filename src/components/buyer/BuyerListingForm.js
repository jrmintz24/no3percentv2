// src/components/buyer/BuyerListingForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import EnhancedPreferenceSelector from '../shared/EnhancedPreferenceSelector';
import { buyerServices } from '../../config/services';

const BuyerListingForm = ({ existingListingMode }) => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [formData, setFormData] = useState({
    priceRange: { min: '', max: '' },
    locations: [],
    propertyTypes: [],
    bedrooms: '',
    bathrooms: '',
    minSquareFootage: '',
    mustHaveFeatures: [],
    services: [],
    packageInfo: null,
    paymentPreference: null,
    preferredMoveInDate: '',
    financingType: 'conventional',
    preApprovalAmount: '',
    additionalNotes: '',
    // Add enhanced preferences structure
    enhancedPreferences: null
  });

  const [currentLocation, setCurrentLocation] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(existingListingMode);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    { value: 'cash', label: 'Cash' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const currentTypes = formData.propertyTypes;
      setFormData(prev => ({
        ...prev,
        propertyTypes: checked 
          ? [...currentTypes, value]
          : currentTypes.filter(type => type !== value)
      }));
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
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        mustHaveFeatures: [...prev.mustHaveFeatures, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      mustHaveFeatures: prev.mustHaveFeatures.filter((_, i) => i !== index)
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

  // Handler for enhanced preferences
  const handleEnhancedPreferencesChange = (preferences) => {
    setFormData(prev => ({
      ...prev,
      enhancedPreferences: preferences
    }));
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

  if (initialLoading) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        Loading listing data...
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
        <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.25rem' : '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem' 
          }}>
            {existingListingMode ? 'Edit Your Buyer Profile' : 'Create Your Buyer Profile'}
          </h1>
          <p style={{ 
            color: '#6b7280',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Tell us what you're looking for and the services you need. Agents will compete for your business.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}>
                {error}
              </div>
            )}

            {/* Budget Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Budget & Financing
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Price Range
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem' 
                  }}>
                    <input
                      type="number"
                      name="priceRange.min"
                      value={formData.priceRange.min}
                      onChange={handleInputChange}
                      placeholder="Min"
                      required
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ 
                      fontSize: isMobile ? '0.875rem' : '1rem' 
                    }}>to</span>
                    <input
                      type="number"
                      name="priceRange.max"
                      value={formData.priceRange.max}
                      onChange={handleInputChange}
                      placeholder="Max"
                      required
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="financingType" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Financing Type
                  </label>
                  <select
                    id="financingType"
                    name="financingType"
                    value={formData.financingType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    {financingOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="preApprovalAmount" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Pre-Approval Amount (if applicable)
                </label>
                <input
                  type="number"
                  id="preApprovalAmount"
                  name="preApprovalAmount"
                  value={formData.preApprovalAmount}
                  onChange={handleInputChange}
                  placeholder="Enter pre-approval amount"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Property Preferences */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Property Preferences
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Preferred Locations
                </label>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <input
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="Enter a city, neighborhood, or ZIP code"
                    style={{
                      flex: isMobile ? 'none' : '1',
                      width: isMobile ? '100%' : 'auto',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddLocation}
                    variant="secondary"
                    style={isMobile ? { width: '100%' } : {}}
                  >
                    Add
                  </Button>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem' 
                }}>
                  {formData.locations.map((location, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
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
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Property Types
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                  gap: '0.5rem' 
                }}>
                  {propertyTypes.map(type => (
                    <label key={type} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      <input
                        type="checkbox"
                        value={type}
                        checked={formData.propertyTypes.includes(type)}
                        onChange={handleInputChange}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label htmlFor="bedrooms" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Minimum Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label htmlFor="bathrooms" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
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
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label htmlFor="minSquareFootage" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Minimum Sq. Ft.
                  </label>
                  <input
                    type="number"
                    id="minSquareFootage"
                    name="minSquareFootage"
                    value={formData.minSquareFootage}
                    onChange={handleInputChange}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Must-Have Features
                </label>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '0.5rem', 
                  marginBottom: '0.5rem' 
                }}>
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="e.g., Pool, Garage, Updated Kitchen"
                    style={{
                      flex: isMobile ? 'none' : '1',
                      width: isMobile ? '100%' : 'auto',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    variant="secondary"
                    style={isMobile ? { width: '100%' } : {}}
                  >
                    Add
                  </Button>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem' 
                }}>
                  {formData.mustHaveFeatures.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#166534',
                          cursor: 'pointer',
                          padding: '0',
                          fontSize: '1rem',
                          lineHeight: '1'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Agent Preferences Section - NEW! */}
            <div style={{ marginBottom: '2rem' }}>
              <EnhancedPreferenceSelector 
                userType="buyer"
                initialPreferences={formData.enhancedPreferences}
                onChange={handleEnhancedPreferencesChange}
              />
            </div>

            {/* Services Selection with Packages */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Select Your Service Package
              </h2>
              
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
            </div>

            {/* Additional Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Additional Information
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="preferredMoveInDate" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Preferred Move-in Date
                </label>
                <input
                  type="date"
                  id="preferredMoveInDate"
                  name="preferredMoveInDate"
                  value={formData.preferredMoveInDate}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label htmlFor="additionalNotes" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Additional Notes for Agents
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any other preferences or requirements..."
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </CardBody>

          <CardFooter style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'flex-end', 
              gap: '1rem' 
            }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/buyer')}
                style={isMobile ? { width: '100%' } : {}}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={isMobile ? { width: '100%' } : {}}
              >
                {loading ? (existingListingMode ? 'Updating...' : 'Creating...') : (existingListingMode ? 'Update Profile' : 'Create Profile')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BuyerListingForm;