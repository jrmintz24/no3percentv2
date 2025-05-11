import React, { useState, useEffect } from 'react';

const EnhancedPreferenceSelector = ({ userType, onChange }) => {
  // State for communication details
  const [languages, setLanguages] = useState([]);
  const [communicationMethods, setCommunicationMethods] = useState([]);
  const [responseTimeExpectation, setResponseTimeExpectation] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState('');
  
  // State for experience & expertise details
  const [minExperienceYears, setMinExperienceYears] = useState('');
  const [specialistInNeighborhood, setSpecialistInNeighborhood] = useState(false);
  const [specializations, setSpecializations] = useState([]);
  const [trackRecordMetrics, setTrackRecordMetrics] = useState({
    daysOnMarket: false,
    priceToListRatio: false,
    closingRate: false,
    volumeOfTransactions: false
  });
  
  // State for availability details
  const [availabilityRequirements, setAvailabilityRequirements] = useState({
    weekdays: false,
    weekends: false,
    evenings: false
  });
  
  // State for transaction process details
  const [preferredNegotiationStyle, setPreferredNegotiationStyle] = useState('');
  const [documentationLevelNeeded, setDocumentationLevelNeeded] = useState('');
  const [postClosingSupportNeeded, setPostClosingSupportNeeded] = useState('');
  
  // State for value-added services
  const [desiredServices, setDesiredServices] = useState([]);
  const [otherRequirements, setOtherRequirements] = useState('');
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    communication: true,
    experience: false,
    availability: false,
    transaction: false,
    valueAdded: false
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Available language options
  const languageOptions = [
    { id: 'english', label: 'English' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'mandarin', label: 'Mandarin' },
    { id: 'cantonese', label: 'Cantonese' },
    { id: 'french', label: 'French' },
    { id: 'vietnamese', label: 'Vietnamese' },
    { id: 'korean', label: 'Korean' },
    { id: 'arabic', label: 'Arabic' },
    { id: 'russian', label: 'Russian' },
    { id: 'tagalog', label: 'Tagalog' },
    { id: 'hindi', label: 'Hindi' }
  ];
  
  // Specializations options based on user type
  const getSpecializationOptions = () => {
    if (userType === 'buyer') {
      return [
        { id: 'firstTime', label: 'First-Time Homebuyers' },
        { id: 'luxury', label: 'Luxury Properties' },
        { id: 'investment', label: 'Investment Properties' },
        { id: 'newConstruction', label: 'New Construction' },
        { id: 'relocation', label: 'Relocation Services' },
        { id: 'retirement', label: 'Retirement Communities' }
      ];
    } else {
      return [
        { id: 'luxury', label: 'Luxury Properties' },
        { id: 'investment', label: 'Investment Properties' },
        { id: 'newConstruction', label: 'New Construction' },
        { id: 'historic', label: 'Historic Homes' },
        { id: 'shortSale', label: 'Short Sales' },
        { id: 'distress', label: 'Distress Sales' }
      ];
    }
  };
  
  // Value-added services options based on user type
  const getValueAddedOptions = () => {
    if (userType === 'buyer') {
      return [
        { id: 'homeInspection', label: 'Home Inspection Coordination' },
        { id: 'mortgageReferrals', label: 'Mortgage Lender Referrals' },
        { id: 'titleServices', label: 'Title Service Recommendations' },
        { id: 'renovationContacts', label: 'Renovation Contractor Contacts' },
        { id: 'neighborhoodTour', label: 'Personalized Neighborhood Tours' },
        { id: 'moveInAssistance', label: 'Move-in Assistance Resources' }
      ];
    } else {
      return [
        { id: 'stagingServices', label: 'Home Staging Services' },
        { id: 'professionalPhotos', label: 'Professional Photography' },
        { id: 'virtualTours', label: '3D Virtual Tours' },
        { id: 'preInspection', label: 'Pre-listing Inspection' },
        { id: 'renovationAdvice', label: 'Pre-sale Renovation Advice' },
        { id: 'moveOutAssistance', label: 'Move-out Assistance Resources' }
      ];
    }
  };
  
  // Handle language selection/deselection
  const handleLanguageChange = (languageId) => {
    setLanguages(prev => {
      if (prev.includes(languageId)) {
        return prev.filter(id => id !== languageId);
      } else {
        return [...prev, languageId];
      }
    });
  };
  
  // Handle communication method selection/deselection
  const handleCommunicationMethodChange = (methodId) => {
    setCommunicationMethods(prev => {
      if (prev.includes(methodId)) {
        return prev.filter(id => id !== methodId);
      } else {
        return [...prev, methodId];
      }
    });
  };
  
  // Handle specialization selection/deselection
  const handleSpecializationChange = (specializationId) => {
    setSpecializations(prev => {
      if (prev.includes(specializationId)) {
        return prev.filter(id => id !== specializationId);
      } else {
        return [...prev, specializationId];
      }
    });
  };
  
  // Handle desired service selection/deselection
  const handleDesiredServiceChange = (serviceId) => {
    setDesiredServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  
  // Handle track record checkbox changes
  const handleTrackRecordChange = (metricId) => {
    setTrackRecordMetrics(prev => ({
      ...prev,
      [metricId]: !prev[metricId]
    }));
  };
  
  // Handle availability checkbox changes
  const handleAvailabilityChange = (timeId) => {
    setAvailabilityRequirements(prev => ({
      ...prev,
      [timeId]: !prev[timeId]
    }));
  };
  
  // Update the parent component when any value changes
  useEffect(() => {
    const enhancedPreferences = {
      communication: {
        languages: languages.length > 0 ? languageOptions
          .filter(lang => languages.includes(lang.id))
          .map(lang => lang.label) : null,
        communicationMethods: communicationMethods.length > 0 ? communicationMethods : null,
        responseTimeExpectation: responseTimeExpectation || null,
        updateFrequency: updateFrequency || null
      },
      expertise: {
        minExperienceYears: minExperienceYears || null,
        specialistInNeighborhood,
        specializations: specializations.length > 0 ? specializations : null,
        trackRecordMetrics: Object.keys(trackRecordMetrics).some(key => trackRecordMetrics[key]) ? trackRecordMetrics : null
      },
      availability: Object.keys(availabilityRequirements).some(key => availabilityRequirements[key]) ? availabilityRequirements : null,
      transaction: {
        preferredNegotiationStyle: preferredNegotiationStyle || null,
        documentationLevelNeeded: documentationLevelNeeded || null,
        postClosingSupportNeeded: postClosingSupportNeeded || null
      },
      valueAdded: {
        desiredServices: desiredServices.length > 0 ? desiredServices : null,
        otherRequirements: otherRequirements || null
      }
    };
    
    onChange(enhancedPreferences);
  }, [
    languages, 
    communicationMethods, 
    responseTimeExpectation, 
    updateFrequency,
    minExperienceYears,
    specialistInNeighborhood,
    specializations,
    trackRecordMetrics,
    availabilityRequirements,
    preferredNegotiationStyle,
    documentationLevelNeeded,
    postClosingSupportNeeded,
    desiredServices,
    otherRequirements
  ]);
  
  // Styles
  const sectionStyle = {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };
  
  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: expandedSections ? '1rem' : 0,
    cursor: 'pointer'
  };
  
  const fieldsetStyle = {
    marginBottom: '1rem',
    border: 'none',
    padding: 0
  };
  
  const checkboxGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };
  
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Additional Agent Preferences
      </h3>
      <p style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Help agents understand your preferences by providing additional details about what you're looking for.
      </p>
      
      {/* Communication Details Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('communication')}
        >
          <h4 style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
            Communication Preferences
          </h4>
          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>
            {expandedSections.communication ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.communication && (
          <div style={{ marginTop: '1rem' }}>
            {/* Languages */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Preferred Languages:
              </legend>
              <div style={checkboxGroupStyle}>
                {languageOptions.map((lang) => (
                  <label 
                    key={lang.id}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: languages.includes(lang.id) ? '#e0f2fe' : '#f3f4f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={languages.includes(lang.id)}
                      onChange={() => handleLanguageChange(lang.id)}
                      style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                    />
                    {lang.label}
                  </label>
                ))}
              </div>
            </fieldset>
            
            {/* Communication Methods */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Preferred Communication Methods:
              </legend>
              <div style={checkboxGroupStyle}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: communicationMethods.includes('email') ? '#e0f2fe' : '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    checked={communicationMethods.includes('email')}
                    onChange={() => handleCommunicationMethodChange('email')}
                    style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                  />
                  Email
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: communicationMethods.includes('phone') ? '#e0f2fe' : '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    checked={communicationMethods.includes('phone')}
                    onChange={() => handleCommunicationMethodChange('phone')}
                    style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                  />
                  Phone Calls
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: communicationMethods.includes('text') ? '#e0f2fe' : '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    checked={communicationMethods.includes('text')}
                    onChange={() => handleCommunicationMethodChange('text')}
                    style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                  />
                  Text Messages
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: communicationMethods.includes('video') ? '#e0f2fe' : '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    checked={communicationMethods.includes('video')}
                    onChange={() => handleCommunicationMethodChange('video')}
                    style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                  />
                  Video Calls
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: communicationMethods.includes('inPerson') ? '#e0f2fe' : '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox"
                    checked={communicationMethods.includes('inPerson')}
                    onChange={() => handleCommunicationMethodChange('inPerson')}
                    style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                  />
                  In-Person Meetings
                </label>
              </div>
            </fieldset>
            
            {/* Response Time */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                How Quickly Do You Expect Responses?
              </legend>
              <select
                value={responseTimeExpectation}
                onChange={(e) => setResponseTimeExpectation(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">-- Select Response Time --</option>
                <option value="1hour">Within 1 hour during business hours</option>
                <option value="sameDay">Same business day</option>
                <option value="24hours">Within 24 hours</option>
                <option value="48hours">Within 48 hours</option>
                <option value="notImportant">Not a priority for me</option>
              </select>
            </fieldset>
            
            {/* Update Frequency */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                How Often Do You Want Updates?
              </legend>
              <select
                value={updateFrequency}
                onChange={(e) => setUpdateFrequency(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">-- Select Update Frequency --</option>
                <option value="daily">Daily updates</option>
                <option value="biweekly">Twice a week</option>
                <option value="weekly">Weekly updates</option>
                <option value="bimonthly">Every two weeks</option>
                <option value="asNeeded">Only when there are developments</option>
              </select>
            </fieldset>
          </div>
        )}
      </div>
      
      {/* Experience & Expertise Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('experience')}
        >
          <h4 style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
            Experience & Expertise Requirements
          </h4>
          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>
            {expandedSections.experience ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.experience && (
          <div style={{ marginTop: '1rem' }}>
            {/* Years of Experience */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Minimum Years of Experience:
              </legend>
              <select
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">-- No Specific Requirement --</option>
                <option value="1">At least 1 year</option>
                <option value="3">At least 3 years</option>
                <option value="5">At least 5 years</option>
                <option value="10">At least 10 years</option>
                <option value="15">At least 15 years</option>
              </select>
            </fieldset>
            
            {/* Neighborhood Specialist */}
            <fieldset style={fieldsetStyle}>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={specialistInNeighborhood}
                    onChange={() => setSpecialistInNeighborhood(!specialistInNeighborhood)}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    Must be an expert/specialist in my target {userType === 'buyer' ? 'neighborhood(s)' : 'neighborhood'}
                  </span>
                </label>
              </div>
            </fieldset>
            
            {/* Specializations */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Desired Specializations:
              </legend>
              <div style={checkboxGroupStyle}>
                {getSpecializationOptions().map((spec) => (
                  <label 
                    key={spec.id}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: specializations.includes(spec.id) ? '#f0fdf4' : '#f3f4f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={specializations.includes(spec.id)}
                      onChange={() => handleSpecializationChange(spec.id)}
                      style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                    />
                    {spec.label}
                  </label>
                ))}
              </div>
            </fieldset>
            
            {/* Track Record Metrics */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Agent Track Record Metrics That Matter to You:
              </legend>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={trackRecordMetrics.daysOnMarket}
                    onChange={() => handleTrackRecordChange('daysOnMarket')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    {userType === 'buyer' ? 'Quick closing ability' : 'Low days on market'}
                  </span>
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={trackRecordMetrics.priceToListRatio}
                    onChange={() => handleTrackRecordChange('priceToListRatio')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    {userType === 'buyer' ? 'Strong negotiation skills (below asking)' : 'High sale-to-list price ratio'}
                  </span>
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={trackRecordMetrics.closingRate}
                    onChange={() => handleTrackRecordChange('closingRate')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    High closing success rate
                  </span>
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input 
                    type="checkbox"
                    checked={trackRecordMetrics.volumeOfTransactions}
                    onChange={() => handleTrackRecordChange('volumeOfTransactions')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    High volume of transactions
                  </span>
                </label>
              </div>
            </fieldset>
          </div>
        )}
      </div>
      
      {/* Availability Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('availability')}
        >
          <h4 style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
            Availability Requirements
          </h4>
          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>
            {expandedSections.availability ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.availability && (
          <div style={{ marginTop: '1rem' }}>
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                When Do You Need Agent Availability?
              </legend>
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={availabilityRequirements.weekdays}
                    onChange={() => handleAvailabilityChange('weekdays')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    Standard weekday hours (9am-5pm)
                  </span>
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <input 
                    type="checkbox"
                    checked={availabilityRequirements.evenings}
                    onChange={() => handleAvailabilityChange('evenings')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    Weekday evenings (after 5pm)
                  </span>
                </label>
                
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input 
                    type="checkbox"
                    checked={availabilityRequirements.weekends}
                    onChange={() => handleAvailabilityChange('weekends')}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    Weekends
                  </span>
                </label>
              </div>
            </fieldset>
          </div>
        )}
      </div>
      
      {/* Transaction Process Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('transaction')}
        >
          <h4 style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
            Transaction Process Preferences
          </h4>
          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>
            {expandedSections.transaction ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.transaction && (
          <div style={{ marginTop: '1rem' }}>
            {/* Negotiation Style */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Preferred Negotiation Style:
              </legend>
              <select
                value={preferredNegotiationStyle}
                onChange={(e) => setPreferredNegotiationStyle(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">-- No Preference --</option>
                <option value="aggressive">Aggressive/Assertive</option>
                <option value="balanced">Balanced/Firm-but-Fair</option>
                <option value="collaborative">Collaborative/Cooperative</option>
                <option value="analytical">Analytical/Data-Driven</option>
              </select>
            </fieldset>
            
            {/* Documentation Level */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Documentation & Explanation Level Needed:
              </legend>
              <select
                value={documentationLevelNeeded}
                onChange={(e) => setDocumentationLevelNeeded(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">-- No Preference --</option>
                <option value="comprehensive">Comprehensive/Detailed</option>
                <option value="standard">Standard/Thorough</option>
                <option value="streamlined">Streamlined/Efficient</option>
              </select>
            </fieldset>
            
            {/* Post-Closing Support */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Post-Closing Support Needed:
              </legend>
              <select
                value={postClosingSupportNeeded}
                onChange={(e) => setPostClosingSupportNeeded(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value="">-- No Preference --</option>
                <option value="premium">Premium (Ongoing assistance & check-ins)</option>
                <option value="standard">Standard (Available when needed)</option>
                <option value="basic">Basic (Closing day support)</option>
              </select>
            </fieldset>
          </div>
        )}
      </div>
      
      {/* Value-Added Services Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('valueAdded')}
        >
          <h4 style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
            Value-Added Services Desired
          </h4>
          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>
            {expandedSections.valueAdded ? '−' : '+'}
          </span>
        </div>
        
        {expandedSections.valueAdded && (
          <div style={{ marginTop: '1rem' }}>
            {/* Value-Added Services Checkboxes */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Additional Services You'd Like:
              </legend>
              <div style={checkboxGroupStyle}>
                {getValueAddedOptions().map((service) => (
                  <label 
                    key={service.id}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: desiredServices.includes(service.id) ? '#f0fdf4' : '#f3f4f6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={desiredServices.includes(service.id)}
                      onChange={() => handleDesiredServiceChange(service.id)}
                      style={{ marginRight: '0.5rem', cursor: 'pointer' }}
                    />
                    {service.label}
                  </label>
                ))}
              </div>
            </fieldset>
            
            {/* Other Requirements */}
            <fieldset style={fieldsetStyle}>
              <legend style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Other Requirements or Preferences (Optional):
              </legend>
              <textarea
                value={otherRequirements}
                onChange={(e) => setOtherRequirements(e.target.value)}
                placeholder="Describe any other requirements or preferences you have"
                rows={3}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  resize: 'vertical',
                  fontSize: '0.875rem'
                }}
              />
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPreferenceSelector;