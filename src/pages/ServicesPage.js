// src/pages/ServicesPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import ServiceCard from '../components/services/ServiceCard';
import { buyerServices, sellerServices, serviceCategories } from '../config/services';

const ServicesPage = () => {
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
          Real Estate Services Explained
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4b5563',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Understand exactly what services are available and choose only what you need. 
          No more bundled packages or hidden fees.
        </p>
      </div>
      
      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        <Link to="/services/buyers">
          <Button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '9999px'
            }}
          >
            Buyer Services
          </Button>
        </Link>
        <Link to="/services/sellers">
          <Button
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              borderRadius: '9999px'
            }}
          >
            Seller Services
          </Button>
        </Link>
      </div>
      
      {/* Quick Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        <div style={{
          backgroundColor: '#eff6ff',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            For Home Buyers
          </h2>
          <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
            Get expert guidance through your home buying journey. Choose from property search, 
            negotiation support, inspection coordination, and more.
          </p>
          <Link to="/services/buyers">
            <Button variant="secondary">Explore Buyer Services</Button>
          </Link>
        </div>
        
        <div style={{
          backgroundColor: '#ecfdf5',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            For Home Sellers
          </h2>
          <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
            Maximize your sale price while minimizing costs. Pick from full service, 
            limited service, or à la carte options.
          </p>
          <Link to="/services/sellers">
            <Button variant="secondary">Explore Seller Services</Button>
          </Link>
        </div>
      </div>
      
      {/* How It Works */}
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
          How Our Service Model Works
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            {
              step: '1',
              title: 'Choose Your Services',
              description: 'Browse our service catalog and select only what you need'
            },
            {
              step: '2',
              title: 'Get Custom Proposals',
              description: 'Agents compete with personalized service packages and pricing'
            },
            {
              step: '3',
              title: 'Compare & Select',
              description: 'Review proposals side-by-side and choose your perfect match'
            },
            {
              step: '4',
              title: 'Pay for What You Use',
              description: 'No bundled fees or surprise costs - transparent pricing always'
            }
          ].map(item => (
            <div key={item.step} style={{ textAlign: 'center' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: '0 auto 1rem'
              }}>
                {item.step}
              </div>
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
        backgroundColor: '#111827',
        color: 'white',
        borderRadius: '1rem',
        padding: '3rem 2rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Ready to Get Started?
        </h2>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Create your listing and let agents compete for your business
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Link to="/signup?type=buyer">
            <Button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 2rem'
              }}
            >
              I'm Buying
            </Button>
          </Link>
          <Link to="/signup?type=seller">
            <Button
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 2rem'
              }}
            >
              I'm Selling
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;