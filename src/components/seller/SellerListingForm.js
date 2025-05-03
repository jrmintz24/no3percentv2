// src/components/seller/SellerListingForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';

const SellerListingForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [propertyType, setPropertyType] = useState('Single Family');
  const [description, setDescription] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Services selection
  const [selectedMustHaveServices, setSelectedMustHaveServices] = useState([]);
  const [selectedNiceToHaveServices, setSelectedNiceToHaveServices] = useState([]);
  const [selectedNotInterestedServices, setSelectedNotInterestedServices] = useState([]);
  
  // Available services
  const availableServices = [
    "Professional Photography",
    "Virtual Tours",
    "Open House Events",
    "Home Staging",
    "Marketing Campaign",
    "Social Media Promotion",
    "MLS Listing",
    "Pricing Strategy",
    "Negotiation Support",
    "Contract Review",
    "Property Valuation",
    "Closing Coordination"
  ];
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Handle service selection
  const toggleService = (service, category) => {
    if (category === 'mustHave') {
      if (selectedMustHaveServices.includes(service)) {
        setSelectedMustHaveServices(selectedMustHaveServices.filter(s => s !== service));
      } else {
        setSelectedMustHaveServices([...selectedMustHaveServices, service]);
        setSelectedNiceToHaveServices(selectedNiceToHaveServices.filter(s => s !== service));
        setSelectedNotInterestedServices(selectedNotInterestedServices.filter(s => s !== service));
      }
    } else if (category === 'niceToHave') {
      if (selectedNiceToHaveServices.includes(service)) {
        setSelectedNiceToHaveServices(selectedNiceToHaveServices.filter(s => s !== service));
      } else {
        setSelectedNiceToHaveServices([...selectedNiceToHaveServices, service]);
        setSelectedMustHaveServices(selectedMustHaveServices.filter(s => s !== service));
        setSelectedNotInterestedServices(selectedNotInterestedServices.filter(s => s !== service));
      }
    } else if (category === 'notInterested') {
      if (selectedNotInterestedServices.includes(service)) {
        setSelectedNotInterestedServices(selectedNotInterestedServices.filter(s => s !== service));
      } else {
        setSelectedNotInterestedServices([...selectedNotInterestedServices, service]);
        setSelectedMustHaveServices(selectedMustHaveServices.filter(s => s !== service));
        setSelectedNiceToHaveServices(selectedNiceToHaveServices.filter(s => s !== service));
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!propertyName || !address || !price) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Format the price correctly - remove commas and convert to number
      const parsedPrice = parseFloat(price.replace(/,/g, ''));
      
      // Create a new listing document
      const newListing = {
        propertyName,
        address,
        price: parsedPrice,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        squareFootage: squareFootage ? parseInt(squareFootage.replace(/,/g, '')) : null,
        propertyType,
        description,
        additionalInfo,
        services: {
          mustHave: selectedMustHaveServices,
          niceToHave: selectedNiceToHaveServices,
          notInterested: selectedNotInterestedServices
        },
        userId: currentUser.uid, // Crucial - sets the current user as the owner
        status: 'Active',
        createdAt: serverTimestamp()
      };
      
      console.log('Creating listing with data:', newListing); // Debugging log
      
      // Add the new listing to Firestore
      const docRef = await addDoc(collection(db, 'sellerListings'), newListing);
      
      console.log('Listing created with ID:', docRef.id); // Debugging log
      
      // Navigate to the listing detail page
      navigate(`/seller/listing/${docRef.id}`);
      
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(`Error creating listing: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Create Property Listing
      </h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="propertyName" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Property Name / Title *
          </label>
          <input
            id="propertyName"
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            placeholder="e.g., Beautiful Family Home in Parkside"
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="address" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Property Address *
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            placeholder="e.g., 123 Main Street, City, State, ZIP"
          />
        </div>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label 
              htmlFor="price" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}
            >
              Asking Price ($) *
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="e.g., 450000"
            />
          </div>
          
          <div>
            <label 
              htmlFor="bedrooms" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}
            >
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="e.g., 3"
            />
          </div>
          
          <div>
            <label 
              htmlFor="bathrooms" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}
            >
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              min="0"
              step="0.5"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="e.g., 2.5"
            />
          </div>
          
          <div>
            <label 
              htmlFor="squareFootage" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}
            >
              Square Footage
            </label>
            <input
              id="squareFootage"
              type="text"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="e.g., 2000"
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="propertyType" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Property Type
          </label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
          >
            <option value="Single Family">Single Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Multi-Family">Multi-Family</option>
            <option value="Land">Land</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="description" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Property Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              resize: 'vertical'
            }}
            placeholder="Describe your property, highlighting its best features and amenities..."
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Agent Services
          </h2>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
            Select which services you would like from your real estate agent:
          </p>
          
          <div style={{ 
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Must-Have Services
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.5rem'
            }}>
              {availableServices.map((service) => (
                <label 
                  key={`must-${service}`}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: selectedMustHaveServices.includes(service) ? '#dbeafe' : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMustHaveServices.includes(service)}
                    onChange={() => toggleService(service, 'mustHave')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Nice-to-Have Services
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.5rem'
            }}>
              {availableServices.map((service) => (
                <label 
                  key={`nice-${service}`}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: selectedNiceToHaveServices.includes(service) ? '#e0f2fe' : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedNiceToHaveServices.includes(service)}
                    onChange={() => toggleService(service, 'niceToHave')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Not Interested In
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.5rem'
            }}>
              {availableServices.map((service) => (
                <label 
                  key={`not-${service}`}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: selectedNotInterestedServices.includes(service) ? '#fee2e2' : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedNotInterestedServices.includes(service)}
                    onChange={() => toggleService(service, 'notInterested')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {service}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="additionalInfo" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Additional Information for Agents
          </label>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={4}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              resize: 'vertical'
            }}
            placeholder="Share any additional information, requirements, or questions for potential agents..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button 
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating Listing...' : 'Create Listing'}
          </Button>
          <Button 
            type="button"
            variant="secondary"
            onClick={() => navigate('/seller/my-listings')}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellerListingForm;