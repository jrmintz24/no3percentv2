// src/components/services/ServiceCard.js

import React from 'react';

const ServiceCard = ({ 
  service, 
  selected = false, 
  onSelect, 
  showDetails = false,
  selectable = true 
}) => {
  return (
    <div 
      style={{
        border: selected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        backgroundColor: selected ? '#eff6ff' : 'white',
        cursor: selectable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onClick={() => selectable && onSelect && onSelect(service.id)}
    >
      {selectable && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem'
        }}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(service.id)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          fontSize: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          width: '3rem',
          height: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {service.icon}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#111827'
          }}>
            {service.name}
          </h3>
          
          <p style={{
            color: '#4b5563',
            marginBottom: showDetails ? '1rem' : '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {service.description}
          </p>
          
          {showDetails && (
            <>
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  color: '#374151',
                  margin: 0
                }}>
                  {service.fullDescription}
                </pre>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <strong style={{ color: '#374151' }}>Estimated Time:</strong>
                  <div style={{ color: '#6b7280' }}>{service.estimatedTime}</div>
                </div>
                <div>
                  <strong style={{ color: '#374151' }}>Typical Cost:</strong>
                  <div style={{ color: '#6b7280' }}>{service.typicalCost}</div>
                </div>
              </div>
            </>
          )}
          
          {service.defaultIncluded && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginTop: '0.5rem'
            }}>
              <span>✓</span> Standard Service
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;