// src/components/shared/EnhancedPreferencesDisplay.js

import React, { useState } from 'react';

const EnhancedPreferencesDisplay = ({ preferences, type }) => {
  const [expandedSections, setExpandedSections] = useState({
    communication: true,
    experience: false,
    availability: false,
    approach: false,
    valueAdded: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!preferences) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No enhanced agent preferences specified.</p>
      </div>
    );
  }

  const hasPreferenceData = Object.keys(preferences).some(key => 
    preferences[key] && Object.keys(preferences[key]).length > 0
  );

  if (!hasPreferenceData) {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No enhanced agent preferences specified.</p>
      </div>
    );
  }

  // Helper function to render the content of each section
  const renderSectionContent = (section, data) => {
    if (!data || Object.keys(data).length === 0) {
      return <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No preferences specified for this category.</p>;
    }

    switch(section) {
      case 'communication':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {data.languages && data.languages.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Languages:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.languages.map((lang, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#e0e7ff', 
                      color: '#4338ca',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.methods && data.methods.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Preferred Methods:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.methods.map((method, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#dbeafe', 
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.responseTime && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Response Time:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.responseTime}</p>
              </div>
            )}
            
            {data.updateFrequency && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Update Frequency:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.updateFrequency}</p>
              </div>
            )}
          </div>
        );
        
      case 'experience':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {data.yearsExperience && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Experience Level:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.yearsExperience}</p>
              </div>
            )}
            
            {data.neighborhoods && data.neighborhoods.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Neighborhood Knowledge:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.neighborhoods.map((neighborhood, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#fef3c7', 
                      color: '#92400e',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {neighborhood}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.propertyTypes && data.propertyTypes.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Property Specialization:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.propertyTypes.map((propType, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#dcfce7', 
                      color: '#166534',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {propType}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.metrics && data.metrics.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Important Metrics:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.metrics.map((metric, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#f3f4f6', 
                      color: '#4b5563',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'availability':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {data.times && data.times.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Available Times:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.times.map((time, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#dcfce7', 
                      color: '#166534',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.flexibility && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Scheduling Flexibility:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.flexibility}</p>
              </div>
            )}
          </div>
        );
        
      case 'approach':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {data.negotiationStyle && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Negotiation Style:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.negotiationStyle}</p>
              </div>
            )}
            
            {data.documentation && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Documentation Level:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.documentation}</p>
              </div>
            )}
            
            {data.postClosing && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Post-Closing Support:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.postClosing}</p>
              </div>
            )}
          </div>
        );
        
      case 'valueAdded':
        return (
          <div>
            {data.services && data.services.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Valued Services:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {data.services.map((service, i) => (
                    <span key={i} style={{ 
                      backgroundColor: '#ffe4e6', 
                      color: '#be123c',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem' 
                    }}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.specialFeatures && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>Special Features:</h4>
                <p style={{ fontSize: '0.875rem', color: '#111827' }}>{data.specialFeatures}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return <p>No data available</p>;
    }
  };

  const getSectionTitle = (section) => {
    switch(section) {
      case 'communication':
        return { 
          title: 'Languages & Communication', 
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#4338ca' }}>
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          ),
          color: '#4338ca',
          bgColor: '#e0e7ff'
        };
      case 'experience':
        return { 
          title: 'Experience & Expertise', 
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#92400e' }}>
              <path fillRule="evenodd" d="M6 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zM6 15a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M3 6a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" />
            </svg>
          ),
          color: '#92400e',
          bgColor: '#fef3c7'
        };
      case 'availability':
        return { 
          title: 'Availability Requirements', 
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#166534' }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          color: '#166534',
          bgColor: '#dcfce7'
        };
      case 'approach':
        return { 
          title: 'Transaction Approach', 
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#1e40af' }}>
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0114 0V3a1 1 0 112 0v2.101a9.005 9.005 0 01-2.288 5.984l-.458.597c-.254.331-.641.523-1.053.523H3.8c-.412 0-.799-.192-1.053-.523l-.458-.597A9.005 9.005 0 010 5.101V3a1 1 0 011-1h3zm5 6a1 1 0 100 2h.01a1 1 0 100-2H9zm1-5a1 1 0 110 2H9a1 1 0 010-2h1zm-3 5a1 1 0 100 2h.01a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          ),
          color: '#1e40af',
          bgColor: '#dbeafe'
        };
      case 'valueAdded':
        return { 
          title: 'Value-Added Services', 
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#be123c' }}>
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2a1 1 0 010 .6l-1.179 4.445a1 1 0 01-1.935 0L9.854 7.8a1 1 0 010-.6l1.18-4.445A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          ),
          color: '#be123c',
          bgColor: '#ffe4e6'
        };
      default:
        return { title: section, icon: null, color: '#6b7280', bgColor: '#f3f4f6' };
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        backgroundColor: '#f9fafb',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#4f46e5' }}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Agent Preferences
        </h3>
      </div>
      
      <div style={{ padding: '1rem 1.5rem' }}>
        <p style={{ 
          fontSize: '0.875rem', 
          color: '#4b5563',
          marginTop: 0,
          marginBottom: '1rem'
        }}>
          This {type === 'buyer' ? 'buyer' : 'seller'} has specified the following preferences for their ideal agent:
        </p>
        
        {/* Accordion sections for each preference category */}
        {Object.keys(preferences).map(section => {
          if (!preferences[section] || Object.keys(preferences[section]).length === 0) {
            return null;
          }
          
          const { title, icon, color, bgColor } = getSectionTitle(section);
          
          return (
            <div key={section} style={{ 
              marginBottom: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => toggleSection(section)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: expandedSections[section] ? bgColor : '#ffffff',
                  color: expandedSections[section] ? color : '#111827',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {icon}
                  <span style={{ fontWeight: '500' }}>{title}</span>
                </div>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  style={{ 
                    transform: expandedSections[section] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {expandedSections[section] && (
                <div style={{ 
                  padding: '1rem',
                  borderTop: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff'
                }}>
                  {renderSectionContent(section, preferences[section])}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedPreferencesDisplay;