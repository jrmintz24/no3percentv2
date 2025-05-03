// src/pages/SellerServicesPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import ServiceCard from '../components/services/ServiceCard';
import { sellerServices, serviceCategories } from '../config/services';

const SellerServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('complete');
  
  const filteredServices = sellerServices.filter(
    service => service.category === activeCategory
  );
  
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
          while maximizing your sale price. Choose only what you need.
        </p>
      </div>
      
      {/* Savings Calculator Preview */}
      <div style={{
        backgroundColor: '#ecfdf5',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#065f46'
        }}>
          Potential Commission Savings
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4rem',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
              6%
            </div>
            <div style={{ color: '#4b5563', fontSize: '0.875rem' }}>Traditional</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>
              3-4%
            </div>
            <div style={{ color: '#4b5563', fontSize: '0.875rem' }}>With Us</div>
          </div>
        </div>
        <p style={{ color: '#065f46', fontWeight: '500' }}>
          Save $6,000-$12,000 on a $400,000 home
        </p>
      </div>
      
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
        gap: '1.5rem',
        marginBottom: '4rem'
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
      
      {/* Service Packages */}
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
          Popular Service Packages
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '2px solid #10b981'
          }}>
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
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#065f46'
            }}>
              Full Service Package
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              {[
                'Professional Photography',
                'MLS Listing & Syndication',
                'Open Houses',
                'All Marketing Materials',
                'Negotiation & Closing'
              ].map(item => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  <span style={{ color: '#10b981' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#065f46',
              marginBottom: '1rem'
            }}>
              2.5-3% Commission
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#0891b2'
            }}>
              Limited Service Package
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              {[
                'MLS Listing',
                'Basic Photography',
                'Yard Sign & Lockbox',
                'Contract Preparation',
                'Limited Consultation'
              ].map(item => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  <span style={{ color: '#10b981' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#0891b2',
              marginBottom: '1rem'
            }}>
              1-1.5% Commission
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#9333ea'
            }}>
              À La Carte Services
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              {[
                'Choose Individual Services',
                'Pay Per Service',
                'No Commission Required',
                'Full Control',
                'Mix and Match'
              ].map(item => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  <span style={{ color: '#10b981' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#9333ea',
              marginBottom: '1rem'
            }}>
              Flat Fee Per Service
            </div>
          </div>
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