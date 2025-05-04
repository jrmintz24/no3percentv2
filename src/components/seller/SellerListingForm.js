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
import { sellerServices } from '../../config/services';

const SellerListingForm = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
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
    messagingEnabled: false
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            List Your Property
          </h1>
          <p style={{ 
            color: '#6b7280',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Create your listing and let agents compete for your business with their best offers.
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

            {/* Basic Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Property Information
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="title" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Listing Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 'Beautiful 3-bedroom home in Downtown'"
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="address" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Property Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Full property address"
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

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label htmlFor="price" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Asking Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter price"
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
                  <label htmlFor="propertyType" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Property Details
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
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
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
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
                    Bathrooms
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
                  <label htmlFor="squareFootage" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Square Footage
                  </label>
                  <input
                    type="number"
                    id="squareFootage"
                    name="squareFootage"
                    value={formData.squareFootage}
                    onChange={handleInputChange}
                    required
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
                  <label htmlFor="yearBuilt" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Year Built
                  </label>
                  <input
                    type="number"
                    id="yearBuilt"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    required
                    min="1800"
                    max={new Date().getFullYear()}
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
                <label htmlFor="description" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Property Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Describe your property, highlighting its best features..."
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

            {/* Features */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Property Features
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  Add Features
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
                    placeholder="e.g., Hardwood floors, Updated kitchen, Pool"
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
                  {formData.features.map((feature, index) => (
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
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
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
                services={sellerServices}
                selectedServices={formData.services}
                onSelectionChange={handleServiceSelection}
                userType="seller"
                onPackageChange={handlePackageChange}
                basePropertyValue={Number(formData.price) || 500000}
                isMobile={isMobile}
              />
            </div>

            {/* Messaging Preferences */}
            <MessagingPreference
              messagingEnabled={formData.messagingEnabled}
              onChange={handleMessagingPreferenceChange}
              userType="seller"
            />

            {/* Additional Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: isMobile ? '1.125rem' : '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Additional Information
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label htmlFor="occupancyStatus" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Occupancy Status
                  </label>
                  <select
                    id="occupancyStatus"
                    name="occupancyStatus"
                    value={formData.occupancyStatus}
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
                    {occupancyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="preferredClosingDate" style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    Preferred Closing Date
                  </label>
                  <input
                    type="date"
                    id="preferredClosingDate"
                    name="preferredClosingDate"
                    value={formData.preferredClosingDate}
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
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="availableForShowing"
                    name="availableForShowing"
                    checked={formData.availableForShowing}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="availableForShowing" style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    Property is available for showings
                  </label>
                </div>
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
                  placeholder="Any other information you'd like agents to know..."
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
                onClick={() => navigate('/seller')}
                style={isMobile ? { width: '100%' } : {}}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={isMobile ? { width: '100%' } : {}}
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SellerListingForm;