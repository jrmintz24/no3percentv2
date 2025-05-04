// src/components/services/ServiceSelector.js

import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { serviceCategories, servicePackages } from '../../config/services';

const ServiceSelector = ({ 
  services, 
  selectedServices = [], 
  onSelectionChange,
  userType = 'buyer',
  onPackageChange = null,
  basePropertyValue = 500000,
  onPaymentPreferenceChange = null,
  isMobile = false
}) => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [addOnServices, setAddOnServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState(serviceCategories[userType]?.[0]?.id || '');
  
  // Define packages with "Showing Only" for buyers
  const packages = userType === 'seller' ? {
    essential: {
      name: servicePackages.seller.essential.name,
      commission: '1-1.5%',
      services: servicePackages.seller.essential.services,
      color: '#0891b2',
      icon: '📋',
      description: servicePackages.seller.essential.description
    },
    full: {
      name: servicePackages.seller.full.name,
      commission: '2.5-3%',
      services: servicePackages.seller.full.services,
      color: '#10b981',
      icon: '🌟',
      description: servicePackages.seller.full.description,
      recommended: true
    },
    premium: {
      name: servicePackages.seller.premium.name,
      commission: '3-4%',
      services: servicePackages.seller.premium.services,
      color: '#7c3aed',
      icon: '🏆',
      description: servicePackages.seller.premium.description
    }
  } : {
    showingOnly: {
      name: 'Showing Only',
      commission: 'Per showing or package',
      services: ['showing_coordination', 'property_showings'],
      color: '#f59e0b',
      icon: '🏡',
      description: 'Just need someone to show you properties? Perfect for self-sufficient buyers.'
    },
    essential: {
      name: servicePackages.buyer.essential.name,
      commission: '1-1.5%',
      services: servicePackages.buyer.essential.services,
      color: '#0891b2',
      icon: '📋',
      description: servicePackages.buyer.essential.description
    },
    full: {
      name: servicePackages.buyer.full.name,
      commission: '2-2.5%',
      services: servicePackages.buyer.full.services,
      color: '#10b981',
      icon: '🌟',
      description: servicePackages.buyer.full.description,
      recommended: true
    },
    premium: {
      name: servicePackages.buyer.premium.name,
      commission: '2.5-3%',
      services: servicePackages.buyer.premium.services,
      color: '#7c3aed',
      icon: '🏆',
      description: servicePackages.buyer.premium.description
    }
  };

  // Handle package selection
  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
    setAddOnServices([]); // Reset add-ons when changing package
    
    // Set base services from package
    const baseServices = packages[packageId].services;
    onSelectionChange(baseServices);
  };

  // Handle add-on toggle
  const handleAddOnToggle = (serviceId) => {
    if (packages[selectedPackage]?.services.includes(serviceId)) {
      return; // Don't allow toggling base package services
    }

    const newAddOns = addOnServices.includes(serviceId)
      ? addOnServices.filter(id => id !== serviceId)
      : [...addOnServices, serviceId];
    
    setAddOnServices(newAddOns);
    
    // Update selected services with package + add-ons
    const allSelected = [
      ...packages[selectedPackage].services,
      ...newAddOns
    ];
    onSelectionChange(allSelected);
  };

  // Update parent component with package info
  useEffect(() => {
    if (onPackageChange && selectedPackage) {
      onPackageChange({
        packageId: selectedPackage,
        baseServices: packages[selectedPackage].services,
        addOnServices: addOnServices,
        allServices: [...packages[selectedPackage].services, ...addOnServices]
      });
    }
  }, [selectedPackage, addOnServices]);

  // Filter services for add-ons (exclude those already in package)
  const availableAddOns = services.filter(service => 
    !packages[selectedPackage]?.services.includes(service.id)
  );

  return (
    <div>
      {/* Step 1: Package Selection */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Step 1: Choose Your Service Package
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {Object.entries(packages).map(([key, pkg]) => (
            <div
              key={key}
              onClick={() => handlePackageSelect(key)}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: selectedPackage === key ? `3px solid ${pkg.color}` : '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                boxShadow: selectedPackage === key ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              {pkg.recommended && (
                <div style={{
                  position: 'absolute',
                  top: '-0.75rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: pkg.color,
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{pkg.icon}</div>
                <h3 style={{
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {pkg.name}
                </h3>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: pkg.color,
                  marginBottom: '0.5rem'
                }}>
                  {pkg.commission}
                </div>
                <p style={{
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {pkg.description}
                </p>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {pkg.services.slice(0, 5).map(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  return service ? (
                    <li key={serviceId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ color: pkg.color }}>✓</span>
                      {service.name}
                    </li>
                  ) : null;
                })}
                {pkg.services.length > 5 && (
                  <li style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    fontStyle: 'italic'
                  }}>
                    + {pkg.services.length - 5} more services
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Add-ons (only show if package is selected) */}
      {selectedPackage && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Step 2: Customize with Add-ons
          </h3>
          
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            marginBottom: '2rem',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Add extra services to your {packages[selectedPackage].name} package
          </p>

          {/* Category tabs for add-ons */}
          <div style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '0 1rem',
              minWidth: 'max-content'
            }}>
              {serviceCategories[userType].map(category => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '1rem 0.5rem',
                      color: isActive ? '#3b82f6' : '#6b7280',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      borderBottom: '3px solid',
                      borderBottomColor: isActive ? '#3b82f6' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-on service cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {availableAddOns
              .filter(service => service.category === activeCategory)
              .map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={addOnServices.includes(service.id)}
                  onSelect={handleAddOnToggle}
                  showDetails={false}
                  selectable={true}
                />
              ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedPackage && (
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            Your Selection Summary
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
              Package: {packages[selectedPackage].name}
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {packages[selectedPackage].services.length} services included
            </p>
          </div>
          
          {addOnServices.length > 0 && (
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Add-ons: {addOnServices.length} selected
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {addOnServices.map(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  return service ? (
                    <li key={serviceId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#374151',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{ color: '#10b981' }}>+</span>
                      {service.name}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;