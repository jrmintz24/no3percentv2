// src/components/services/ServiceSelector.js

import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { serviceCategories, servicePackages } from '../../config/services';

const ServiceSelector = ({ 
  services, 
  selectedServices = [], 
  onSelectionChange,
  userType = 'buyer',
  showCategories = true,
  showPackages = false,
  onPackageChange = null,
  basePropertyValue = 500000,
  onPaymentPreferenceChange = null,
}) => {
  const [activeCategory, setActiveCategory] = useState(
    serviceCategories[userType][0].id
  );
  const [selectedPackage, setSelectedPackage] = useState('custom');
  const [paymentPreference, setPaymentPreference] = useState({
    type: 'commission',
    requireRebate: false,
    flatFeeAmount: '',
    commissionPercentage: '3'
  });
  
  // Define service packages using the imported servicePackages
  const packages = userType === 'seller' ? {
    essential: {
      name: servicePackages.seller.essential.name,
      commission: '1-1.5%',
      commissionRate: 0.0125,
      services: servicePackages.seller.essential.services,
      color: '#0891b2',
      icon: '📋',
      description: servicePackages.seller.essential.description
    },
    full: {
      name: servicePackages.seller.full.name,
      commission: '2.5-3%',
      commissionRate: 0.0275,
      services: servicePackages.seller.full.services,
      color: '#10b981',
      icon: '🌟',
      description: servicePackages.seller.full.description
    },
    premium: {
      name: servicePackages.seller.premium.name,
      commission: '3-4%',
      commissionRate: 0.035,
      services: servicePackages.seller.premium.services,
      color: '#7c3aed',
      icon: '🏆',
      description: servicePackages.seller.premium.description
    },
    custom: {
      name: 'À La Carte Services',
      commission: 'Pay per service',
      commissionRate: 0,
      services: [],
      color: '#9333ea',
      icon: '🛠️',
      description: 'Choose exactly what you need, pay only for what you use'
    }
  } : {
    essential: {
      name: servicePackages.buyer.essential.name,
      commission: '1-1.5%',
      commissionRate: 0.0125,
      services: servicePackages.buyer.essential.services,
      color: '#0891b2',
      icon: '📋',
      description: servicePackages.buyer.essential.description
    },
    full: {
      name: servicePackages.buyer.full.name,
      commission: '2-2.5%',
      commissionRate: 0.0225,
      services: servicePackages.buyer.full.services,
      color: '#10b981',
      icon: '🌟',
      description: servicePackages.buyer.full.description
    },
    premium: {
      name: servicePackages.buyer.premium.name,
      commission: '2.5-3%',
      commissionRate: 0.0275,
      services: servicePackages.buyer.premium.services,
      color: '#7c3aed',
      icon: '🏆',
      description: servicePackages.buyer.premium.description
    },
    custom: {
      name: 'À La Carte Services',
      commission: 'Pay per service',
      commissionRate: 0,
      services: [],
      color: '#9333ea',
      icon: '🛠️',
      description: 'Choose exactly what you need, pay only for what you use'
    }
  };

  // Handle payment preference changes
  const handlePaymentTypeChange = (type) => {
    const updatedPreference = {
      ...paymentPreference,
      type
    };
    setPaymentPreference(updatedPreference);
    if (onPaymentPreferenceChange) {
      onPaymentPreferenceChange(updatedPreference);
    }
  };

  const handleFlatFeeChange = (amount) => {
    const updatedPreference = {
      ...paymentPreference,
      flatFeeAmount: amount
    };
    setPaymentPreference(updatedPreference);
    if (onPaymentPreferenceChange) {
      onPaymentPreferenceChange(updatedPreference);
    }
  };

  const handleCommissionChange = (percentage) => {
    const updatedPreference = {
      ...paymentPreference,
      commissionPercentage: percentage
    };
    setPaymentPreference(updatedPreference);
    if (onPaymentPreferenceChange) {
      onPaymentPreferenceChange(updatedPreference);
    }
  };

  const handleRebateChange = (required) => {
    const updatedPreference = {
      ...paymentPreference,
      requireRebate: required
    };
    setPaymentPreference(updatedPreference);
    if (onPaymentPreferenceChange) {
      onPaymentPreferenceChange(updatedPreference);
    }
  };

  // Calculate total cost based on selected services
  const calculateTotalCost = () => {
    const currentPackage = packages[selectedPackage];
    let totalCost = 0;
    
    if (selectedPackage === 'custom') {
      selectedServices.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          const costMatch = service.typicalCost.match(/\$([0-9,]+)(?:-([0-9,]+))?/);
          if (costMatch) {
            const minCost = parseInt(costMatch[1].replace(',', ''));
            const maxCost = costMatch[2] ? parseInt(costMatch[2].replace(',', '')) : minCost;
            totalCost += (minCost + maxCost) / 2;
          } else if (service.typicalCost.includes('%')) {
            const percentMatch = service.typicalCost.match(/([0-9.]+)(?:-([0-9.]+))?%/);
            if (percentMatch) {
              const minRate = parseFloat(percentMatch[1]) / 100;
              const maxRate = percentMatch[2] ? parseFloat(percentMatch[2]) / 100 : minRate;
              const avgRate = (minRate + maxRate) / 2;
              totalCost += basePropertyValue * avgRate;
            }
          }
        }
      });
    } else {
      totalCost = basePropertyValue * currentPackage.commissionRate;
    }
    
    return totalCost;
  };

  // Calculate savings compared to traditional commission
  const calculateSavings = () => {
    const traditionalCost = userType === 'seller' 
      ? basePropertyValue * 0.06  // 6% for sellers
      : basePropertyValue * 0.03; // 3% for buyers
    const currentCost = calculateTotalCost();
    return traditionalCost - currentCost;
  };

  // Handle package selection
  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
    if (packageId !== 'custom') {
      onSelectionChange(packages[packageId].services);
    } else {
      if (selectedServices.length === 0) {
        onSelectionChange([]);
      }
    }
  };
  
  const handleServiceToggle = (serviceId) => {
    if (selectedPackage !== 'custom') return;
    
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId];
    
    onSelectionChange(newSelection);
  };

  // Update calculations when selections change
  useEffect(() => {
    if (onPackageChange) {
      onPackageChange({
        packageId: selectedPackage,
        services: selectedServices,
        totalCost: calculateTotalCost(),
        savings: calculateSavings(),
        paymentPreference: paymentPreference
      });
    }
  }, [selectedServices, selectedPackage, basePropertyValue, paymentPreference]);
  
  const filteredServices = showCategories
    ? services.filter(service => service.category === activeCategory)
    : services;
  
  return (
    <div>
      {/* Package Selection UI */}
      {showPackages && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {Object.entries(packages).map(([key, pkg]) => (
              <div
                key={key}
                onClick={() => handlePackageSelect(key)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: selectedPackage === key ? `2px solid ${pkg.color}` : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {key === 'full' && (
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
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {pkg.name}
                  </h3>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
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
                
                {key !== 'custom' && (
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
                )}
              </div>
            ))}
          </div>

          {/* Payment Preferences for Buyers */}
          {userType === 'buyer' && (
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '3rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Payment Preferences
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: paymentPreference.type === 'commission' ? '#eff6ff' : 'white'
                }}>
                  <input
                    type="radio"
                    name="paymentType"
                    value="commission"
                    checked={paymentPreference.type === 'commission'}
                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                  />
                  <span>Commission-based</span>
                </label>
                
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: paymentPreference.type === 'flat_fee' ? '#eff6ff' : 'white'
                }}>
                  <input
                    type="radio"
                    name="paymentType"
                    value="flat_fee"
                    checked={paymentPreference.type === 'flat_fee'}
                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                  />
                  <span>Flat fee</span>
                </label>
              </div>
              
              {paymentPreference.type === 'flat_fee' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Preferred flat fee amount
                  </label>
                  <input
                    type="number"
                    value={paymentPreference.flatFeeAmount}
                    onChange={(e) => handleFlatFeeChange(e.target.value)}
                    placeholder="Enter amount"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              )}
              
              {paymentPreference.type === 'commission' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Maximum commission percentage
                  </label>
                  <input
                    type="number"
                    value={paymentPreference.commissionPercentage}
                    onChange={(e) => handleCommissionChange(e.target.value)}
                    placeholder="Enter percentage"
                    min="0"
                    max="6"
                    step="0.5"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              )}
              
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={paymentPreference.requireRebate}
                    onChange={(e) => handleRebateChange(e.target.checked)}
                  />
                  <span>Require rebate if seller pays agent commission</span>
                </label>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '0.5rem'
                }}>
                  If the seller offers to pay your agent's commission, you expect a portion to be rebated to you.
                </p>
              </div>
            </div>
          )}

          {/* Cost Calculator Summary */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {userType === 'seller' ? 'Commission Savings Calculator' : 'Commission Cost Calculator'}
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                backgroundColor: '#fee2e2',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#991b1b', marginBottom: '0.25rem' }}>
                  Traditional {userType === 'seller' ? '6%' : '3%'}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                  ${((userType === 'seller' ? 0.06 : 0.03) * basePropertyValue).toLocaleString()}
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#dcfce7',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.25rem' }}>
                  Your Cost
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#15803d' }}>
                  ${calculateTotalCost().toLocaleString()}
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#dbeafe',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.25rem' }}>
                  You Save
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                  ${calculateSavings().toLocaleString()}
                </p>
              </div>
            </div>
            
            <p style={{
              textAlign: 'center',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}>
              Based on property value: ${basePropertyValue.toLocaleString()}
            </p>
          </div>
        </>
      )}
      
      {/* Category selection with Modern Tab Style */}
      {showCategories && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            padding: '0 16px',
            WebkitScrollbar: 'display: none',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}>
            {serviceCategories[userType].map(category => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  type="button"
                  style={{
                    // Reset browser default button styles
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    background: 'none',
                    border: 'none',
                    margin: 0,
                    padding: 0,
                    font: 'inherit',
                    color: 'inherit',
                    cursor: 'pointer',
                    
                    // Apply our tab styles
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                    color: isActive ? '#3b82f6' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderBottom: '3px solid',
                    borderBottomColor: isActive ? '#3b82f6' : 'transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    boxShadow: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Service cards */}
      {selectedPackage === 'custom' && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>
            Select individual services below to build your custom package.
          </p>
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
            selectable={selectedPackage === 'custom'}
          />
        ))}
      </div>
      
      {selectedPackage !== 'custom' && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          textAlign: 'center' 
        }}>
          <p style={{ color: '#374151', fontSize: '0.875rem' }}>
            Package services are pre-selected. Choose "À La Carte Services" to customize your selection.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;