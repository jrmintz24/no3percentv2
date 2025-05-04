// src/pages/SellerServicesPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import ServiceCard from '../components/services/ServiceCard';
import { sellerServices, serviceCategories, servicePackages } from '../config/services';

const SellerServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('complete');
  
  const filteredServices = sellerServices.filter(
    service => service.category === activeCategory
  );

  // Use packages directly from the imported servicePackages
  const packages = servicePackages.seller;
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '4rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          Services for Home Sellers
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4b5563',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          From full-service listings to à la carte options, control your costs 
          while maximizing your sale price. Let agents compete with their best offers.
        </p>
      </div>
      
      {/* Service Packages */}
      <div style={{
        marginBottom: '4rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Service Packages
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {Object.entries(packages).map(([key, pkg]) => (
            <div
              key={key}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: key === 'full' ? `2px solid #10b981` : '1px solid #e5e7eb',
                position: 'relative'
              }}
            >
              {key === 'full' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {pkg.name}
                </h3>
                <p style={{
                  color: '#4b5563',
                  fontSize: '0.875rem'
                }}>
                  {pkg.description}
                </p>
              </div>
              
              {key !== 'custom' ? (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '1.5rem'
                }}>
                  {pkg.services.slice(0, 8).map(serviceId => {
                    const service = sellerServices.find(s => s.id === serviceId);
                    return service ? (
                      <li key={serviceId} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#374151',
                        fontSize: '0.875rem'
                      }}>
                        <span style={{ color: '#10b981' }}>✓</span>
                        {service.name}
                      </li>
                    ) : null;
                  })}
                  {pkg.services.length > 8 && (
                    <li style={{
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      fontStyle: 'italic'
                    }}>
                      + {pkg.services.length - 8} more services
                    </li>
                  )}
                </ul>
              ) : (
                <div style={{
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <p>Select from any services below to create your custom package</p>
                </div>
              )}
              
              <div style={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Agents will propose their commission rates
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* All Services Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          All Available Services
        </h2>
        
        <p style={{
          textAlign: 'center',
          color: '#4b5563',
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem'
        }}>
          Browse all services below. You can choose any combination when creating your listing.
        </p>
        
        {/* Category Navigation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
          overflowX: 'auto',
          justifyContent: 'center',
          paddingBottom: '0.5rem'
        }}>
          {serviceCategories.seller.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeCategory === category.id ? '#10b981' : '#f3f4f6',
                color: activeCategory === category.id ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              showDetails={true}
              selectable={false}
            />
          ))}
        </div>
      </div>
      
      {/* How It Works Section */}
      <div style={{
        backgroundColor: '#f9fafb',
        borderRadius: '1rem',
        padding: '3rem 2rem',
        marginBottom: '4rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          How Our Commission Structure Works
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              icon: '📝',
              title: 'Choose Your Package',
              description: 'Select from Full Service, Essential Service, or build your own À La Carte package'
            },
            {
              icon: '💰',
              title: 'Agents Compete',
              description: 'Agents submit proposals with their commission rates and service offerings'
            },
            {
              icon: '🤝',
              title: 'You Compare & Choose',
              description: 'Review proposals side-by-side and select the best value for your needs'
            },
            {
              icon: '✨',
              title: 'Save Thousands',
              description: 'Pay only for services you need at competitive rates'
            }
          ].map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {item.title}
              </h3>
              <p style={{ color: '#4b5563' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        backgroundColor: '#065f46',
        color: 'white',
        borderRadius: '1rem',
        padding: '3rem 2rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Ready to Save on Commission?
        </h2>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          List your property and let agents compete with their best offers
        </p>
        <Link to="/signup?type=seller">
          <Button
            size="large"
            style={{
              backgroundColor: 'white',
              color: '#065f46',
              padding: '0.75rem 2rem'
            }}
          >
            List Your Property
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SellerServicesPage;