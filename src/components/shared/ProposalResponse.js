// src/components/shared/ProposalResponse.js
import React, { useState } from 'react';

const ProposalResponse = ({ proposal, listing, onAccept, onReject, onMessage }) => {
  // Check if proposal exists and initialize it with default values if not
  const safeProposal = proposal || {
    agentName: 'Unknown Agent',
    status: 'Pending',
    createdAt: new Date(),
    message: 'No message provided',
    enhancedDetails: {}
  };

  const [expandedSections, setExpandedSections] = useState({
    communication: false,
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
  
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch (error) {
      // Return a safe default if date parsing fails
      return 'N/A';
    }
  };

  // Status badge styles
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'accepted':
      case 'Accepted':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534'
        };
      case 'rejected':
      case 'Rejected':
        return {
          backgroundColor: '#fee2e2',
          color: '#b91c1c'
        };
      case 'pending':
      case 'Pending':
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#4b5563'
        };
    }
  };
  
  // Styles
  const sectionStyle = {
    marginBottom: '1rem',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };
  
  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  };
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'Not specified';
    return `$${Number(value).toLocaleString()}`;
  };
  
  // Check if enhanced details exist
  const hasEnhancedDetails = safeProposal.enhancedDetails && 
    Object.keys(safeProposal.enhancedDetails).length > 0;

  return (
    <div style={{ 
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      marginBottom: '1.5rem'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
            {safeProposal.agentName}
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            Submitted {formatDate(safeProposal.createdAt)}
          </p>
        </div>
        
        <div style={{ 
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
          ...getStatusBadgeStyle(safeProposal.status)
        }}>
          {safeProposal.status}
        </div>
      </div>
      
      {/* Fee Structure */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem'
        }}>
          <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>
            Fee Structure:
          </h4>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600',
            color: '#2563eb'
          }}>
            {safeProposal.feeStructure === 'percentage' || safeProposal.commissionRate 
              ? `${safeProposal.commissionRate || safeProposal.feePercentage}% Commission` 
              : safeProposal.flatFee 
                ? `${formatCurrency(safeProposal.flatFee)} Flat Fee`
                : safeProposal.fee
                  ? `${formatCurrency(safeProposal.fee)}`
                  : 'Not specified'}
          </span>
        </div>
        
        {safeProposal.packageInfo && (
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ 
              margin: '0 0 0.25rem 0', 
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Service Package: {' '}
              <span style={{ 
                display: 'inline-block',
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {safeProposal.packageInfo.name}
              </span>
            </p>
          </div>
        )}
        
        {(safeProposal.offerRebate || safeProposal.rebateAmount) && (
          <div style={{ 
            marginTop: '0.5rem',
            backgroundColor: '#fffbeb',
            borderRadius: '0.375rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: '500' }}>Rebate Offer:</span> {safeProposal.rebateAmount}
            </p>
          </div>
        )}
      </div>
      
      {/* Services Included */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
          Services Included:
        </h4>
        {safeProposal.services && safeProposal.services.length > 0 ? (
          <ul style={{
            padding: '0 0 0 1.25rem',
            margin: 0,
            columns: '2',
            columnGap: '1rem',
            fontSize: '0.875rem'
          }}>
            {safeProposal.services.map((service, index) => (
              <li key={index} style={{ marginBottom: '0.375rem' }}>{service}</li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Standard services package
          </p>
        )}
        
        {safeProposal.additionalServices && (
          <div style={{ marginTop: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
              Additional Services:
            </h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {safeProposal.additionalServices}
            </p>
          </div>
        )}
      </div>
      
      {/* Enhanced Agent Details - NEW SECTION */}
      {hasEnhancedDetails && (
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '0.875rem', 
            fontWeight: '600',
            borderBottom: '1px dashed #e5e7eb',
            paddingBottom: '0.5rem'
          }}>
            Agent Qualifications & Commitments
          </h4>
          
          {/* Communication Section */}
          {safeProposal.enhancedDetails.communication && 
           Object.values(safeProposal.enhancedDetails.communication).some(val => val && (Array.isArray(val) ? val.length > 0 : val)) && (
            <div style={sectionStyle}>
              <div 
                style={sectionHeaderStyle}
                onClick={() => toggleSection('communication')}
              >
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                  Communication
                </h5>
                <span>{expandedSections.communication ? '−' : '+'}</span>
              </div>
              
              {expandedSections.communication && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  {safeProposal.enhancedDetails.communication.languages?.length > 0 && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Languages:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {safeProposal.enhancedDetails.communication.languages.map((lang, idx) => (
                          <span 
                            key={idx}
                            style={{
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem'
                            }}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {safeProposal.enhancedDetails.communication.responseTime && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Response Time:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {safeProposal.enhancedDetails.communication.responseTime === '1hour' ? 'Within 1 hour during business hours' :
                         safeProposal.enhancedDetails.communication.responseTime === 'sameDay' ? 'Same business day' :
                         safeProposal.enhancedDetails.communication.responseTime === '24hours' ? 'Within 24 hours' :
                         safeProposal.enhancedDetails.communication.responseTime === '48hours' ? 'Within 48 hours' :
                         safeProposal.enhancedDetails.communication.responseTime}
                      </p>
                    </div>
                  )}
                  
                  {safeProposal.enhancedDetails.communication.updateFrequency && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Update Frequency:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {safeProposal.enhancedDetails.communication.updateFrequency === 'daily' ? 'Daily updates' :
                         safeProposal.enhancedDetails.communication.updateFrequency === 'biweekly' ? 'Twice a week' :
                         safeProposal.enhancedDetails.communication.updateFrequency === 'weekly' ? 'Weekly updates' :
                         safeProposal.enhancedDetails.communication.updateFrequency === 'bimonthly' ? 'Every two weeks' :
                         safeProposal.enhancedDetails.communication.updateFrequency === 'asNeeded' ? 'As needed when there are developments' :
                         safeProposal.enhancedDetails.communication.updateFrequency}
                      </p>
                    </div>
                  )}
                  
                  {/* Handle different property names for communication methods */}
                  {(safeProposal.enhancedDetails.communication.communicationMethods?.length > 0 || 
                    safeProposal.enhancedDetails.communication.methods?.length > 0) && (
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Preferred Methods:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {/* Check both properties for different data structures */}
                        {(safeProposal.enhancedDetails.communication.communicationMethods || 
                          safeProposal.enhancedDetails.communication.methods || []).map((method, idx) => (
                          <li key={idx}>
                            {method === 'email' ? 'Email' :
                             method === 'phone' ? 'Phone Calls' :
                             method === 'text' ? 'Text Messages' :
                             method === 'video' ? 'Video Calls' :
                             method === 'inPerson' ? 'In-Person Meetings' :
                             method}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Experience & Expertise Section */}
          {safeProposal.enhancedDetails.experience && 
           Object.values(safeProposal.enhancedDetails.experience).some(val => val && (Array.isArray(val) ? val.length > 0 : val)) && (
            <div style={sectionStyle}>
              <div 
                style={sectionHeaderStyle}
                onClick={() => toggleSection('experience')}
              >
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                  Experience & Expertise
                </h5>
                <span>{expandedSections.experience ? '−' : '+'}</span>
              </div>
              
              {expandedSections.experience && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  {safeProposal.enhancedDetails.experience.yearsOfExperience && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Years of Experience:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {safeProposal.enhancedDetails.experience.yearsOfExperience}
                      </p>
                    </div>
                  )}
                  
                  {safeProposal.enhancedDetails.experience.areaSpecialization && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Area Specialization:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {safeProposal.enhancedDetails.experience.areaSpecialization}
                      </p>
                    </div>
                  )}
                  
                  {/* Support both property names for specializations */}
                  {(safeProposal.enhancedDetails.experience.specializations?.length > 0 || 
                    safeProposal.enhancedDetails.experience.propertyTypes?.length > 0) && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Specializations:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {(safeProposal.enhancedDetails.experience.specializations || 
                          safeProposal.enhancedDetails.experience.propertyTypes || []).map((spec, idx) => (
                          <span 
                            key={idx}
                            style={{
                              backgroundColor: '#f0fdf4',
                              color: '#166534',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem'
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Support both property names for track record */}
                  {(safeProposal.enhancedDetails.experience.trackRecord?.length > 0 || 
                    safeProposal.enhancedDetails.experience.metrics?.length > 0) && (
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Track Record Strengths:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {(safeProposal.enhancedDetails.experience.trackRecord || 
                          safeProposal.enhancedDetails.experience.metrics || []).map((metric, idx) => (
                          <li key={idx}>
                            {metric === 'daysOnMarket' ? 'Low days on market / Quick closing ability' :
                             metric === 'priceToListRatio' ? 'Strong negotiation results' :
                             metric === 'closingRate' ? 'High closing success rate' :
                             metric === 'volumeOfTransactions' ? 'High volume of transactions' :
                             metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Support for neighborhoods property */}
                  {safeProposal.enhancedDetails.experience.neighborhoods?.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Neighborhood Expertise:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {safeProposal.enhancedDetails.experience.neighborhoods.map((neighborhood, idx) => (
                          <span 
                            key={idx}
                            style={{
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem'
                            }}
                          >
                            {neighborhood}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Availability Section */}
          {(safeProposal.enhancedDetails.availability?.length > 0 || 
            (safeProposal.enhancedDetails.availability && 
             Object.values(safeProposal.enhancedDetails.availability).some(val => val))) && (
            <div style={sectionStyle}>
              <div 
                style={sectionHeaderStyle}
                onClick={() => toggleSection('availability')}
              >
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                  Availability
                </h5>
                <span>{expandedSections.availability ? '−' : '+'}</span>
              </div>
              
              {expandedSections.availability && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  {/* Handle Array or Object structure */}
                  {Array.isArray(safeProposal.enhancedDetails.availability) ? (
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Available Times:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {safeProposal.enhancedDetails.availability.map((time, idx) => (
                          <li key={idx}>
                            {time === 'weekdays' ? 'Standard weekday hours (9am-5pm)' :
                             time === 'evenings' ? 'Weekday evenings (after 5pm)' :
                             time === 'weekends' ? 'Weekends' :
                             time}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    // Object structure
                    <div>
                      {safeProposal.enhancedDetails.availability.times?.length > 0 && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Available Times:</p>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                            {safeProposal.enhancedDetails.availability.times.map((time, idx) => (
                              <li key={idx}>
                                {time === 'weekdays' ? 'Standard weekday hours (9am-5pm)' :
                                 time === 'evenings' ? 'Weekday evenings (after 5pm)' :
                                 time === 'weekends' ? 'Weekends' :
                                 time}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {safeProposal.enhancedDetails.availability.flexibility && (
                        <div>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Scheduling Flexibility:</p>
                          <p style={{ margin: 0, color: '#4b5563' }}>
                            {safeProposal.enhancedDetails.availability.flexibility}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Transaction Process Section - support both names */}
          {(safeProposal.enhancedDetails.transaction || safeProposal.enhancedDetails.approach) && (
            <div style={sectionStyle}>
              <div 
                style={sectionHeaderStyle}
                onClick={() => toggleSection('transaction')}
              >
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                  Transaction Approach
                </h5>
                <span>{expandedSections.transaction ? '−' : '+'}</span>
              </div>
              
              {expandedSections.transaction && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  {/* Use transaction or approach depending on structure */}
                  {(safeProposal.enhancedDetails.transaction?.negotiationStyle || 
                    safeProposal.enhancedDetails.approach?.negotiationStyle) && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Negotiation Style:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {(safeProposal.enhancedDetails.transaction?.negotiationStyle || 
                          safeProposal.enhancedDetails.approach?.negotiationStyle) === 'aggressive' ? 'Aggressive/Assertive' :
                         (safeProposal.enhancedDetails.transaction?.negotiationStyle || 
                          safeProposal.enhancedDetails.approach?.negotiationStyle) === 'balanced' ? 'Balanced/Firm-but-Fair' :
                         (safeProposal.enhancedDetails.transaction?.negotiationStyle || 
                          safeProposal.enhancedDetails.approach?.negotiationStyle) === 'collaborative' ? 'Collaborative/Cooperative' :
                         (safeProposal.enhancedDetails.transaction?.negotiationStyle || 
                          safeProposal.enhancedDetails.approach?.negotiationStyle) === 'analytical' ? 'Analytical/Data-Driven' :
                          safeProposal.enhancedDetails.transaction?.negotiationStyle || 
                          safeProposal.enhancedDetails.approach?.negotiationStyle}
                      </p>
                    </div>
                  )}
                  
                  {(safeProposal.enhancedDetails.transaction?.documentationLevel || 
                    safeProposal.enhancedDetails.approach?.documentation) && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Documentation Level:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {(safeProposal.enhancedDetails.transaction?.documentationLevel || 
                          safeProposal.enhancedDetails.approach?.documentation) === 'comprehensive' ? 'Comprehensive/Detailed' :
                         (safeProposal.enhancedDetails.transaction?.documentationLevel || 
                          safeProposal.enhancedDetails.approach?.documentation) === 'standard' ? 'Standard/Thorough' :
                         (safeProposal.enhancedDetails.transaction?.documentationLevel || 
                          safeProposal.enhancedDetails.approach?.documentation) === 'streamlined' ? 'Streamlined/Efficient' :
                          safeProposal.enhancedDetails.transaction?.documentationLevel || 
                          safeProposal.enhancedDetails.approach?.documentation}
                      </p>
                    </div>
                  )}
                  
                  {(safeProposal.enhancedDetails.transaction?.postClosingSupport || 
                    safeProposal.enhancedDetails.approach?.postClosing) && (
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Post-Closing Support:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {(safeProposal.enhancedDetails.transaction?.postClosingSupport || 
                          safeProposal.enhancedDetails.approach?.postClosing) === 'premium' ? 'Premium (Ongoing assistance & check-ins)' :
                         (safeProposal.enhancedDetails.transaction?.postClosingSupport || 
                          safeProposal.enhancedDetails.approach?.postClosing) === 'standard' ? 'Standard (Available when needed)' :
                         (safeProposal.enhancedDetails.transaction?.postClosingSupport || 
                          safeProposal.enhancedDetails.approach?.postClosing) === 'basic' ? 'Basic (Closing day support)' :
                          safeProposal.enhancedDetails.transaction?.postClosingSupport || 
                          safeProposal.enhancedDetails.approach?.postClosing}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Value-Added Services Section */}
          {safeProposal.enhancedDetails.valueAdded && 
           ((safeProposal.enhancedDetails.valueAdded.services?.length > 0) || 
            (safeProposal.enhancedDetails.valueAdded.otherServices) ||
            (safeProposal.enhancedDetails.valueAdded.specialFeatures)) && (
            <div style={sectionStyle}>
              <div 
                style={sectionHeaderStyle}
                onClick={() => toggleSection('valueAdded')}
              >
                <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                  Value-Added Services
                </h5>
                <span>{expandedSections.valueAdded ? '−' : '+'}</span>
              </div>
              
              {expandedSections.valueAdded && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  {safeProposal.enhancedDetails.valueAdded.services?.length > 0 && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Additional Services:</p>
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {safeProposal.enhancedDetails.valueAdded.services.map((service, idx) => (
                          <li key={idx}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {safeProposal.enhancedDetails.valueAdded.otherServices && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Other Services:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {safeProposal.enhancedDetails.valueAdded.otherServices}
                      </p>
                    </div>
                  )}
                  
                  {safeProposal.enhancedDetails.valueAdded.specialFeatures && (
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500' }}>Special Features:</p>
                      <p style={{ margin: 0, color: '#4b5563' }}>
                        {safeProposal.enhancedDetails.valueAdded.specialFeatures}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Proposal Message */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
          Agent Message:
        </h4>
        <p style={{ margin: 0, fontSize: '0.875rem', whiteSpace: 'pre-line' }}>
          {safeProposal.message}
        </p>
      </div>
      
      {/* Action Buttons */}
      {(safeProposal.status === 'Pending' || safeProposal.status === 'pending') && (
        <div style={{ 
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => onMessage && onMessage(safeProposal)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Message
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onReject && onReject(safeProposal)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #ef4444',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                color: '#ef4444',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Decline
            </button>
            
            <button
              onClick={() => onAccept && onAccept(safeProposal)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #10b981',
                borderRadius: '0.375rem',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Accept Proposal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalResponse;