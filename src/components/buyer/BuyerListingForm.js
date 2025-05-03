import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const BuyerListingForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Use a single state object for all form data
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    budget: '',
    timeline: '',
    mustHaveFeatures: [],
    niceToHaveFeatures: [],
    services: {
      mustHave: [],
      niceToHave: [],
      notInterested: []
    },
    additionalInfo: ''
  });
  
  // For feature lists
  const [currentMustHave, setCurrentMustHave] = useState('');
  const [currentNiceToHave, setCurrentNiceToHave] = useState('');
  const [currentCustomService, setCurrentCustomService] = useState('');
  const [customServiceType, setCustomServiceType] = useState('mustHave');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Agent services options for buyers
  const serviceOptions = [
    { id: 'propertySearch', name: 'Property Search', description: 'Finding properties that match your criteria' },
    { id: 'marketAnalysis', name: 'Market Analysis', description: 'Analysis of property values and market trends' },
    { id: 'viewings', name: 'Property Viewings', description: 'Scheduling and attending property viewings' },
    { id: 'negotiation', name: 'Negotiation', description: 'Negotiating price and terms with sellers' },
    { id: 'financing', name: 'Financing Assistance', description: 'Help with finding loan options and lenders' },
    { id: 'inspection', name: 'Inspection Coordination', description: 'Arranging property inspections' },
    { id: 'paperwork', name: 'Contract & Paperwork', description: 'Handling all necessary documents and legal requirements' },
    { id: 'closing', name: 'Closing Coordination', description: 'Managing the closing process' },
    { id: 'postPurchase', name: 'Post-Purchase Support', description: 'Assistance after the purchase is complete' }
  ];
  
  // Handle regular input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add feature to list
  const handleAddFeature = (type) => {
    if (type === 'mustHave' && currentMustHave.trim()) {
      setFormData(prev => ({
        ...prev,
        mustHaveFeatures: [...prev.mustHaveFeatures, currentMustHave.trim()]
      }));
      setCurrentMustHave('');
    } else if (type === 'niceToHave' && currentNiceToHave.trim()) {
      setFormData(prev => ({
        ...prev,
        niceToHaveFeatures: [...prev.niceToHaveFeatures, currentNiceToHave.trim()]
      }));
      setCurrentNiceToHave('');
    }
  };
  
  // Remove feature from list
  const handleRemoveFeature = (type, index) => {
    if (type === 'mustHave') {
      setFormData(prev => ({
        ...prev,
        mustHaveFeatures: prev.mustHaveFeatures.filter((_, i) => i !== index)
      }));
    } else if (type === 'niceToHave') {
      setFormData(prev => ({
        ...prev,
        niceToHaveFeatures: prev.niceToHaveFeatures.filter((_, i) => i !== index)
      }));
    }
  };
  
  // Add custom service
  const handleAddCustomService = () => {
    if (currentCustomService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: {
          ...prev.services,
          [customServiceType]: [...prev.services[customServiceType], currentCustomService.trim()]
        }
      }));
      setCurrentCustomService('');
    }
  };
  
  // Remove service from list
  const handleRemoveService = (type, index) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [type]: prev.services[type].filter((_, i) => i !== index)
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Format budget as number if provided
      const budgetValue = formData.budget ? parseFloat(formData.budget) : null;
      
      // Create the listing document
      const docRef = await addDoc(collection(db, 'buyerListings'), {
        userId: currentUser.uid,
        title: formData.title || 'Property Search',
        location: formData.location,
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        budget: budgetValue,
        timeline: formData.timeline,
        mustHaveFeatures: formData.mustHaveFeatures,
        niceToHaveFeatures: formData.niceToHaveFeatures,
        services: formData.services,
        additionalInfo: formData.additionalInfo,
        status: 'Active',
        createdAt: serverTimestamp()
      });
      
      // Redirect to the listing detail page
      navigate(`/buyer/listing/${docRef.id}`);
      
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Error creating listing: ' + err.message);
      setLoading(false);
    }
  };
  
  // Helper function to handle key press in feature inputs
  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (type === 'mustHave' || type === 'niceToHave') {
        handleAddFeature(type);
      } else if (type === 'customService') {
        handleAddCustomService();
      }
    }
  };
  
  // Helper function to update service preference
  const updateServicePreference = (serviceName, newPreference) => {
    // First remove this service from all categories
    const updatedServices = {
      mustHave: formData.services.mustHave.filter(s => s !== serviceName),
      niceToHave: formData.services.niceToHave.filter(s => s !== serviceName),
      notInterested: formData.services.notInterested.filter(s => s !== serviceName)
    };
    
    // Then add to the new category
    if (newPreference !== 'none') {
      updatedServices[newPreference].push(serviceName);
    }
    
    // Update state
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };
  
  // Helper function to get current preference for a service
  const getServicePreference = (serviceName) => {
    if (formData.services.mustHave.includes(serviceName)) return 'mustHave';
    if (formData.services.niceToHave.includes(serviceName)) return 'niceToHave';
    if (formData.services.notInterested.includes(serviceName)) return 'notInterested';
    return 'none';
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Create Property Search Listing
        </h1>
      </div>
      
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
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardBody>
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="title" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Listing Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Looking for a family home in Seattle"
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Property Details
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label 
                    htmlFor="location" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Location / Area
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Downtown, North Seattle"
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  />
                </div>
                
                <div>
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
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    <option value="">Select property type</option>
                    <option value="Single Family Home">Single Family Home</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-Family">Multi-Family</option>
                    <option value="Land">Land</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    <option value="">Select bedrooms</option>
                    <option value="Studio">Studio</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
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
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    <option value="">Select bathrooms</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4+">4+</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label 
                    htmlFor="budget" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Budget (USD)
                  </label>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., 500000"
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="timeline" 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    <option value="">Select timeline</option>
                    <option value="As soon as possible">As soon as possible</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                    <option value="Just browsing">Just browsing</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Property Features
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="mustHaveFeatures" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Must-Have Features
                </label>
                
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <input
                    id="mustHaveFeatures"
                    type="text"
                    value={currentMustHave}
                    onChange={(e) => setCurrentMustHave(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'mustHave')}
                    placeholder="e.g., Garage, Fenced yard"
                    style={{ 
                      flex: '1',
                      padding: '0.75rem',
                      borderRadius: '0.375rem 0 0 0.375rem',
                      border: '1px solid #d1d5db',
                      borderRight: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature('mustHave')}
                    style={{ 
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0 1rem',
                      borderRadius: '0 0.375rem 0.375rem 0',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                
                {formData.mustHaveFeatures.length > 0 && (
                  <div 
                    style={{ 
                      padding: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {formData.mustHaveFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0',
                          borderBottom: index < formData.mustHaveFeatures.length - 1 ? '1px solid #e5e7eb' : 'none'
                        }}
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature('mustHave', index)}
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0 0.5rem'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="niceToHaveFeatures" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Nice-to-Have Features
                </label>
                
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <input
                    id="niceToHaveFeatures"
                    type="text"
                    value={currentNiceToHave}
                    onChange={(e) => setCurrentNiceToHave(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'niceToHave')}
                    placeholder="e.g., Pool, Fireplace"
                    style={{ 
                      flex: '1',
                      padding: '0.75rem',
                      borderRadius: '0.375rem 0 0 0.375rem',
                      border: '1px solid #d1d5db',
                      borderRight: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature('niceToHave')}
                    style={{ 
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0 1rem',
                      borderRadius: '0 0.375rem 0.375rem 0',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
                
                {formData.niceToHaveFeatures.length > 0 && (
                  <div 
                    style={{ 
                      padding: '0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.375rem'
                    }}
                  >
                    {formData.niceToHaveFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0',
                          borderBottom: index < formData.niceToHaveFeatures.length - 1 ? '1px solid #e5e7eb' : 'none'
                        }}
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature('niceToHave', index)}
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0 0.5rem'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Agent Services Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Agent Services Needed
              </h2>
              
              <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Select the services you require from an agent. This helps agents tailor their proposals to your needs.
              </p>
              
              <div className="service-options">
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  marginBottom: '1.5rem'
                }}>
                  <thead>
                    <tr>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '0.75rem', 
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: '600',
                        width: '40%'
                      }}>Service</th>
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0.75rem', 
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: '600',
                        width: '20%'
                      }}>Must Have</th>
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0.75rem', 
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: '600',
                        width: '20%'
                      }}>Nice to Have</th>
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '0.75rem', 
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: '600',
                        width: '20%'
                      }}>Not Interested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceOptions.map((service) => {
                      const preference = getServicePreference(service.name);
                      return (
                        <tr key={service.id}>
                          <td style={{ 
                            textAlign: 'left', 
                            padding: '0.75rem', 
                            borderBottom: '1px solid #e5e7eb',
                          }}>
                            <div style={{ fontWeight: '500' }}>{service.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{service.description}</div>
                          </td>
                          <td style={{ 
                            textAlign: 'center', 
                            padding: '0.75rem', 
                            borderBottom: '1px solid #e5e7eb',
                          }}>
                            <input 
                              type="radio" 
                              name={`service_${service.id}`} 
                              checked={preference === 'mustHave'} 
                              onChange={() => updateServicePreference(service.name, 'mustHave')}
                            />
                          </td>
                          <td style={{ 
                            textAlign: 'center', 
                            padding: '0.75rem', 
                            borderBottom: '1px solid #e5e7eb',
                          }}>
                            <input 
                              type="radio" 
                              name={`service_${service.id}`} 
                              checked={preference === 'niceToHave'} 
                              onChange={() => updateServicePreference(service.name, 'niceToHave')}
                            />
                          </td>
                          <td style={{ 
                            textAlign: 'center', 
                            padding: '0.75rem', 
                            borderBottom: '1px solid #e5e7eb',
                          }}>
                            <input 
                              type="radio" 
                              name={`service_${service.id}`} 
                              checked={preference === 'notInterested'} 
                              onChange={() => updateServicePreference(service.name, 'notInterested')}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Custom service input */}
              <div>
                <label 
                  htmlFor="customService" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Add Custom Service
                </label>
                
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <input
                    id="customService"
                    type="text"
                    value={currentCustomService}
                    onChange={(e) => setCurrentCustomService(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'customService')}
                    placeholder="e.g., School district research"
                    style={{ 
                      flex: '1',
                      padding: '0.75rem',
                      borderRadius: '0.375rem 0 0 0.375rem',
                      border: '1px solid #d1d5db',
                      borderRight: 'none'
                    }}
                  />
                  <select
                    value={customServiceType}
                    onChange={(e) => setCustomServiceType(e.target.value)}
                    style={{ 
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderRadius: '0'
                    }}
                  >
                    <option value="mustHave">Must Have</option>
                    <option value="niceToHave">Nice to Have</option>
                    <option value="notInterested">Not Interested</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    style={{ 
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0 1rem',
                      borderRadius: '0 0.375rem 0.375rem 0',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Display custom services */}
              {(formData.services.mustHave.length > 0 || 
                formData.services.niceToHave.length > 0 || 
                formData.services.notInterested.length > 0) && 
                serviceOptions.every(so => !formData.services.mustHave.includes(so.name) && 
                                          !formData.services.niceToHave.includes(so.name) &&
                                          !formData.services.notInterested.includes(so.name)) && (
                <div 
                  style={{ 
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    marginTop: '1rem'
                  }}
                >
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Custom Services
                  </h3>
                  
                  {formData.services.mustHave.filter(s => !serviceOptions.some(so => so.name === s)).length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Must Have:</div>
                      {formData.services.mustHave.filter(s => !serviceOptions.some(so => so.name === s)).map((service, index) => (
                        <div 
                          key={index}
                          style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.25rem 0'
                          }}
                        >
                          <span>{service}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService('mustHave', formData.services.mustHave.indexOf(service))}
                            style={{ 
                              backgroundColor: 'transparent',
                              color: '#ef4444',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 0.5rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.services.niceToHave.filter(s => !serviceOptions.some(so => so.name === s)).length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Nice to Have:</div>
                      {formData.services.niceToHave.filter(s => !serviceOptions.some(so => so.name === s)).map((service, index) => (
                        <div 
                          key={index}
                          style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.25rem 0'
                          }}
                        >
                          <span>{service}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService('niceToHave', formData.services.niceToHave.indexOf(service))}
                            style={{ 
                              backgroundColor: 'transparent',
                              color: '#ef4444',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 0.5rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {formData.services.notInterested.filter(s => !serviceOptions.some(so => so.name === s)).length > 0 && (
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Not Interested:</div>
                      {formData.services.notInterested.filter(s => !serviceOptions.some(so => so.name === s)).map((service, index) => (
                        <div 
                          key={index}
                          style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.25rem 0'
                          }}
                        >
                          <span>{service}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService('notInterested', formData.services.notInterested.indexOf(service))}
                            style={{ 
                              backgroundColor: 'transparent',
                              color: '#ef4444',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 0.5rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label 
                htmlFor="additionalInfo" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                placeholder="Include any other details about your property search"
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  resize: 'vertical'
                }}
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                {loading ? 'Creating...' : 'Create Listing'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BuyerListingForm;