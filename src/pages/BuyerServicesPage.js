// src/pages/BuyerServicesPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import ServiceCard from '../components/services/ServiceCard';
import { buyerServices, serviceCategories } from '../config/services';

const BuyerServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState('search');
  
  const filteredServices = buyerServices.filter(
    service => service.category === activeCategory
  );

  // Define the same packages as in ServiceSelector
  const packages = {
    showing_only: {
      name: 'Showing Only Package',
      services: ['Property Showings'],
      icon: '👁️',
      color: '#6366f1',
      description: 'Property tours only - perfect for experienced buyers'
    },
    basic: {
      name: 'Basic Buyer Package',
      services: [
        'Property Search Assistance', 
        'Property Showings', 
        'Contract Review & Support', 
        'Closing Coordination'
      ],
      icon: '🏠',
      color: '#0891b2',
      description: 'Essential services for first-time buyers'
    },
    full: {
      name: 'Full Service Package',
      services: [
        'Property Search Assistance', 
        'Property Showings', 
        'Comparative Market Analysis', 
        'Negotiation Representation', 
        'Contract Review & Support', 
        'Inspection Coordination', 
        'Closing Coordination', 
        'Mortgage Lender Recommendations'
      ],
      icon: '🌟',
      color: '#10b981',
      description: 'Complete buyer representation with all services included'
    },
    custom: {
      name: 'À La Carte Services',
      services: [],
      icon: '🛠️',
      color: '#9333ea',
      description: 'Choose exactly what you need, pay only for what you use'
    }
  };
  
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
          Services for Home Buyers
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4b5563',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          From property search to closing, choose exactly the services you need. 
          Agents will compete with customized proposals based on your preferences.
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {Object.entries(packages).map(([key, pkg]) => (
            <div
              key={key}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: key === 'full' ? `2px solid ${pkg.color}` : '1px solid #e5e7eb',
                position: 'relative'
              }}
            >
              {key === 'full' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
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
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{pkg.icon}</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: pkg.color,
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
                  {pkg.services.map(service => (
                    <li key={service} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ color: pkg.color }}>✓</span>
                      {service}
                    </li>
                  ))}
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
                Agents will propose their rates
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Preferences Notice */}
      <div style={{
        backgroundColor: '#f3f4f6',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '4rem',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Flexible Payment Options
        </h3>
        <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
          You choose your preferred payment structure:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <strong>Commission-based</strong>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Traditional percentage of purchase price
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <strong>Flat fee</strong>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Fixed amount regardless of price
            </p>
          </div>
        </div>
        <p style={{ 
          color: '#2563eb', 
          fontSize: '0.875rem', 
          marginTop: '1rem',
          fontWeight: '500'
        }}>
          You can also require rebates if the seller pays commission
        </p>
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
          Browse all services below. You can choose any combination when creating your buyer profile.
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
          {serviceCategories.buyer.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeCategory === category.id ? '#3b82f6' : '#f3f4f6',
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
      
      {/* FAQ Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Frequently Asked Questions
        </h2>
        
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            {
              question: 'How do agents determine their rates?',
              answer: 'Agents will submit competitive proposals based on your selected services and preferences. Rates vary depending on the package and level of service you choose.'
            },
            {
              question: 'Can I change my service selections later?',
              answer: 'Yes! You can adjust your service needs at any time. Your agent will update their proposal accordingly, and you\'ll have full transparency on any changes.'
            },
            {
              question: 'What if I only need minimal assistance?',
              answer: 'Our "Showing Only" package is perfect for experienced buyers who just need access to properties. You can also build a custom package with only the services you need.'
            },
            {
              question: 'What are rebates and how do they work?',
              answer: 'If the seller offers to pay your agent\'s commission, you can require that a portion be rebated back to you. This is specified in your preferences and agents will indicate their rebate policy in their proposals.'
            }
          ].map((faq, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                color: '#111827'
              }}>
                {faq.question}
              </h3>
              <p style={{
                color: '#4b5563',
                lineHeight: '1.6'
              }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        backgroundColor: '#1e40af',
        color: 'white',
        borderRadius: '1rem',
        padding: '3rem 2rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Ready to Find Your Perfect Agent?
        </h2>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Create your buyer profile and let top agents compete for your business
        </p>
        <Link to="/signup?type=buyer">
          <Button
            size="large"
            style={{
              backgroundColor: 'white',
              color: '#1e40af',
              padding: '0.75rem 2rem'
            }}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BuyerServicesPage;