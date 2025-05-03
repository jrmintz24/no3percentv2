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
          Our agents will customize their proposals based on your selections.
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
          Common Service Packages
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
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#1e40af'
            }}>
              First-Time Buyer Package
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              {[
                'Property Search Assistance',
                'Market Analysis',
                'Mortgage Guidance',
                'Inspection Coordination',
                'Full Transaction Support'
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
              color: '#1e40af',
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
              color: '#059669'
            }}>
              Experienced Buyer Package
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              {[
                'Property Search Support',
                'Negotiation Services',
                'Contract Review',
                'Closing Coordination'
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
              color: '#059669',
              marginBottom: '1rem'
            }}>
              2-2.5% Commission
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
              color: '#7c3aed'
            }}>
              Remote Buyer Package
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1.5rem'
            }}>
              {[
                'Virtual Property Tours',
                'Video Consultations',
                'Digital Document Signing',
                'Local Area Research',
                'Remote Closing Support'
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
              color: '#7c3aed',
              marginBottom: '1rem'
            }}>
              2.5-3% Commission
            </div>
          </div>
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
              question: 'Which services are typically included in the commission?',
              answer: 'Most essential services like property search, showings, negotiation, and transaction coordination are included in the standard commission. Additional services like virtual tours or extended market analysis may have separate fees.'
            },
            {
              question: 'Can I change my service selections later?',
              answer: 'Yes! You can adjust your service needs at any time. Your agent will update their proposal accordingly, and you\'ll have full transparency on any cost changes.'
            },
            {
              question: 'What if I only need help with specific parts of the process?',
              answer: 'That\'s exactly what our platform is designed for. You can select only the services you need, and agents will customize their proposals and pricing based on your specific requirements.'
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