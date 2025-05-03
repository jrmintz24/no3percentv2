// src/components/services/ServiceSelector.js

import React, { useState } from 'react';
import ServiceCard from './ServiceCard';
import { serviceCategories } from '../../config/services';

const ServiceSelector = ({ 
  services, 
  selectedServices = [], 
  onSelectionChange,
  userType = 'buyer',
  showCategories = true 
}) => {
  const [activeCategory, setActiveCategory] = useState(
    serviceCategories[userType][0].id
  );
  
  const handleServiceToggle = (serviceId) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onSelectionChange(newSelection);
  };
  
  const filteredServices = showCategories
    ? services.filter(service => service.category === activeCategory)
    : services;
  
  return (
    <div>
      {showCategories && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {serviceCategories[userType].map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeCategory === category.id ? '#3b82f6' : '#f3f4f6',
                color: activeCategory === category.id ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {filteredServices.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedServices.includes(service.id)}
            onSelect={handleServiceToggle}
            showDetails={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;