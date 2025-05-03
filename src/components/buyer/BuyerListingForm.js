import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ServiceSelector from '../services/ServiceSelector';
import { buyerServices } from '../../config/services';

const BuyerListingForm = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    priceRange: { min: '', max: '' },
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: { min: '', max: '' },
    description: '',
    mustHaveFeatures: [],
    niceToHaveFeatures: [],
    dealBreakers: [],
    preferredTimeline: '',
    financingType: '',
    preApproved: false,
    firstTimebuyer: false,
    workingWithOtherAgents: false,
    additionalNotes: '',
    services: {
      mustHave: [],
      niceToHave: [],
      notInterested: []
    }
  });

  const [currentFeature, setCurrentFeature] = useState('');
  const [currentNiceToHave, setCurrentNiceToHave] = useState('');
  const [currentDealBreaker, setCurrentDealBreaker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const propertyTypes = [
    'Single Family Home',
    'Townhouse',
    'Condo',
    'Multi-Family',
    'Land',
    'Other'
  ];

  const financingOptions = [
    'Conventional',
    'FHA',
    'VA',
    'Cash',
    'Other'
  ];

  const timelineOptions = [
    'ASAP',
    '1-3 months',
    '3-6 months',
    '6-12 months',
    'Over 12 months',
    'Flexible'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
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

  const handleAddFeature = (type) => {
    let value, setter;
    
    switch(type) {
      case 'mustHave':
        value = currentFeature;
        setter = setCurrentFeature;
        break;
      case 'niceToHave':
        value = currentNiceToHave;
        setter = setCurrentNiceToHave;
        break;
      case 'dealBreaker':
        value = currentDealBreaker;
        setter = setCurrentDealBreaker;
        break;
      default:
        return;
    }
    
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [type === 'dealBreaker' ? 'dealBreakers' : `${type}Features`]: [
          ...prev[type === 'dealBreaker' ? 'dealBreakers' : `${type}Features`],
          value.trim()
        ]
      }));
      setter('');
    }
  };

  const handleRemoveFeature = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type === 'dealBreaker' ? 'dealBreakers' : `${type}Features`]: prev[
        type === 'dealBreaker' ? 'dealBreakers' : `${type}Features`
      ].filter((_, i) => i !== index)
    }));
  };

  const handleServiceSelection = (selectedServices) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        mustHave: selectedServices
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the listing
      const listingData = {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: userProfile?.displayName || 'Anonymous',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'buyerListings'), listingData);
      
      navigate(`/buyer/listing/${docRef.id}`);
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Card>
        <CardHeader>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Create Your Buyer Profile
          </h1>
          <p style={{ color: '#6b7280' }}>
            Tell agents exactly what you're looking for so they can provide tailored proposals.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Basic Information
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Listing Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 'Looking for 3-bedroom home in Downtown'"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Preferred Location(s)
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 'Downtown, Westside, or specific zip codes'"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label htmlFor="priceRange.min" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Min Price
                  </label>
                  <input
                    type="number"
                    id="priceRange.min"
                    name="priceRange.min"
                    value={formData.priceRange.min}
                    onChange={handleInputChange}
                    placeholder="Minimum price"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="priceRange.max" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Max Price
                  </label>
                  <input
                    type="number"
                    id="priceRange.max"
                    name="priceRange.max"
                    value={formData.priceRange.max}
                    onChange={handleInputChange}
                    placeholder="Maximum price"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="propertyType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                    borderRadius: '0.375rem'
                  }}
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Property Details
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label htmlFor="bedrooms" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Bedrooms
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
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="bathrooms" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Bathrooms
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
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label htmlFor="squareFootage.min" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Min Square Footage
                  </label>
                  <input
                    type="number"
                    id="squareFootage.min"
                    name="squareFootage.min"
                    value={formData.squareFootage.min}
                    onChange={handleInputChange}
                    placeholder="Minimum sq ft"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="squareFootage.max" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Max Square Footage
                  </label>
                  <input
                    type="number"
                    id="squareFootage.max"
                    name="squareFootage.max"
                    value={formData.squareFootage.max}
                    onChange={handleInputChange}
                    placeholder="Maximum sq ft"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Additional Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your ideal property, lifestyle preferences, or any other important details..."
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
            </div>

            {/* Features and Preferences */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Features and Preferences
              </h2>
              
              {/* Must-Have Features */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Must-Have Features
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Add a must-have feature"
                    style={{
                      flex: '1',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddFeature('mustHave')}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.mustHaveFeatures.map((feature, index) => (
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
                        onClick={() => handleRemoveFeature('mustHave', index)}
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

              {/* Nice-to-Have Features */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Nice-to-Have Features
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={currentNiceToHave}
                    onChange={(e) => setCurrentNiceToHave(e.target.value)}
                    placeholder="Add a nice-to-have feature"
                    style={{
                      flex: '1',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddFeature('niceToHave')}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.niceToHaveFeatures.map((feature, index) => (
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
                        onClick={() => handleRemoveFeature('niceToHave', index)}
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

              {/* Deal Breakers */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Deal Breakers
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={currentDealBreaker}
                    onChange={(e) => setCurrentDealBreaker(e.target.value)}
                    placeholder="Add a deal breaker"
                    style={{
                      flex: '1',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddFeature('dealBreaker')}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.dealBreakers.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
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
                        onClick={() => handleRemoveFeature('dealBreaker', index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#991b1b',
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

            {/* Services Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                What services are you looking for?
              </h2>
              
              <ServiceSelector
                services={buyerServices}
                selectedServices={formData.services.mustHave}
                onSelectionChange={handleServiceSelection}
                userType="buyer"
              />
            </div>

            {/* Buying Details */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Buying Details
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label htmlFor="preferredTimeline" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Preferred Timeline
                  </label>
                  <select
                    id="preferredTimeline"
                    name="preferredTimeline"
                    value={formData.preferredTimeline}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="financingType" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Financing Type
                  </label>
                  <select
                    id="financingType"
                    name="financingType"
                    value={formData.financingType}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="">Select financing</option>
                    {financingOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="preApproved"
                    name="preApproved"
                    checked={formData.preApproved}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="preApproved">Pre-approved</label>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="firstTimebuyer"
                    name="firstTimebuyer"
                    checked={formData.firstTimebuyer}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="firstTimebuyer">First-time buyer</label>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="workingWithOtherAgents"
                    name="workingWithOtherAgents"
                    checked={formData.workingWithOtherAgents}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="workingWithOtherAgents">Working with other agents</label>
                </div>
              </div>

              <div>
                <label htmlFor="additionalNotes" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
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
                    borderRadius: '0.375rem'
                  }}
                />
              </div>
            </div>
          </CardBody>

          <CardFooter>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/buyer')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
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

export default BuyerListingForm;