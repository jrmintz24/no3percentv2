import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const BuyersLandingPage = () => {
  const servicePackages = [
    {
      name: 'Showing Only',
      commission: 'Per showing fee',
      price: '$50-100/showing',
      icon: '🏡',
      features: [
        'Property tours only',
        'Perfect for self-sufficient buyers',
        'No long-term commitment',
        'Pay per showing or package deals',
        'Ideal for experienced buyers'
      ]
    },
    {
      name: 'Essential',
      commission: '1-1.5%',
      price: 'Save up to 50%',
      icon: '📋',
      features: [
        'Basic buyer representation',
        'Contract preparation',
        'Offer submission',
        'Limited negotiation support',
        'Digital document handling'
      ]
    },
    {
      name: 'Full Service',
      commission: '2-2.5%',
      price: 'Traditional with savings',
      icon: '🌟',
      features: [
        'Complete buyer representation',
        'Property search assistance',
        'Full negotiation support',
        'Transaction coordination',
        'Inspection guidance',
        'Closing support'
      ],
      popular: true
    },
    {
      name: 'Premium',
      commission: '2.5-3%',
      price: 'White-glove service',
      icon: '🏆',
      features: [
        'Luxury home specialist',
        'Off-market opportunities',
        'Concierge services',
        'Priority showings',
        'Investment analysis',
        'Post-closing support'
      ]
    }
  ];

  const addOnServices = [
    {
      icon: '🔍',
      title: 'Home Inspection Coordination',
      description: 'Professional inspection scheduling and report analysis'
    },
    {
      icon: '📊',
      title: 'Market Analysis',
      description: 'Detailed comparative market analysis for your target area'
    },
    {
      icon: '💰',
      title: 'Mortgage Assistance',
      description: 'Connect with preferred lenders and rate comparison'
    },
    {
      icon: '📸',
      title: 'Virtual Tours',
      description: 'Remote property viewing via video calls'
    },
    {
      icon: '⚖️',
      title: 'Legal Review',
      description: 'Attorney review of contracts and documents'
    },
    {
      icon: '🚚',
      title: 'Relocation Services',
      description: 'Moving coordination and area orientation'
    }
  ];

  const benefits = [
    {
      icon: '💵',
      title: 'Buyer Rebates',
      description: 'Get cash back when sellers pay your agent commission'
    },
    {
      icon: '🏷️',
      title: 'Lower Commissions',
      description: 'Save thousands with competitive agent rates'
    },
    {
      icon: '🎯',
      title: 'Choose Your Services',
      description: 'Pay only for the services you actually need'
    },
    {
      icon: '🤝',
      title: 'Expert Negotiation',
      description: 'Experienced agents fighting for your best deal'
    }
  ];

  const processSteps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Tell us what you\'re looking for in your dream home'
    },
    {
      number: '2',
      title: 'Choose Your Package',
      description: 'Select from our service packages and customize with add-ons'
    },
    {
      number: '3',
      title: 'Review Proposals',
      description: 'Compare agent proposals with rates and services side-by-side'
    },
    {
      number: '4',
      title: 'Find Your Home',
      description: 'Work with your chosen agent to find and buy your perfect home'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                FOR HOME BUYERS
              </span>
            </div>
            
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}>
              Find Your Dream Home<br />
              <span style={{ color: '#93c5fd' }}>Without the 3% Fee</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.5rem',
              marginBottom: '2.5rem',
              opacity: '0.9',
              lineHeight: '1.5'
            }}>
              Choose your service level, get competitive proposals, and save thousands with buyer rebates
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/signup?type=buyer">
                <Button size="large" style={{ 
                  backgroundColor: 'white',
                  color: '#1e3a8a',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🏠</span>
                  Start Your Home Search
                </Button>
              </Link>
              
              <Link to="/how-it-works">
                <Button size="large" variant="secondary" style={{ 
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Choose Your Service Level
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              From basic showings to full-service representation, find the perfect package for your needs
            </p>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {servicePackages.map((pkg, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  position: 'relative',
                  border: pkg.popular ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  boxShadow: pkg.popular ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {pkg.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Most Popular
                  </div>
                )}
                
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{pkg.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {pkg.name}
                  </h3>
                  <div style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '0.25rem'
                  }}>
                    {pkg.commission}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {pkg.price}
                  </div>
                </div>
                
                <ul style={{ 
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 2rem 0',
                  flex: 1
                }}>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.9375rem',
                      color: '#475569'
                    }}>
                      <span style={{ color: '#3b82f6', flexShrink: 0 }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup?type=buyer" style={{ display: 'block' }}>
                  <Button 
                    fullWidth
                    variant={pkg.popular ? 'primary' : 'secondary'}
                  >
                    Choose {pkg.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-On Services Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Customize with Add-Ons
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Enhance your package with additional services tailored to your needs
            </p>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {addOnServices.map((service, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent',
                  ':hover': {
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0'
                  }
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  flexShrink: 0
                }}>
                  {service.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              Why Buy Through no3%
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '700px', margin: '0 auto' }}>
              Save money, get better service, and take control of your home buying journey
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {benefits.map((benefit, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  width: '5rem',
                  height: '5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '1rem',
                  margin: '0 auto 1rem'
                }}>
                  {benefit.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {benefit.title}
                </h3>
                <p style={{ opacity: '0.8', fontSize: '1rem' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto' }}>
              Your path to homeownership in four simple steps
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {processSteps.map((step, index) => (
              <div key={index} style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 1rem'
                }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '60%',
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #3b82f6 0%, #e2e8f0 100%)',
                    zIndex: 0,
                    '@media (max-width: 1024px)': {
                      display: 'none'
                    }
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Rebates Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>
                Get Cash Back with<br />
                <span style={{ color: '#3b82f6' }}>Buyer Rebates</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                When sellers pay your agent's commission, many agents offer to rebate a portion back to you. 
                This can mean thousands of dollars in your pocket at closing.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>✓</span>
                  <span style={{ fontSize: '1rem', color: '#475569' }}>Up to 2% of the purchase price back</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>✓</span>
                  <span style={{ fontSize: '1rem', color: '#475569' }}>Use for closing costs or down payment</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#3b82f6' }}>✓</span>
                  <span style={{ fontSize: '1rem', color: '#475569' }}>Available in most states (where legal)</span>
                </li>
              </ul>
              <Link to="/signup?type=buyer">
                <Button size="large">
                  Start Saving Today
                </Button>
              </Link>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
                Example Savings
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', marginBottom: '1rem' }}>
                $6,000 - $10,000
              </div>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Average rebate on a $500,000 home purchase
              </p>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                  Traditional 3% commission: $15,000
                </p>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                  With 2% rebate: $5,000 cost
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a' }}>
                  Your savings: $10,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            Ready to Save on Your Home Purchase?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: '0.9' }}>
            Join thousands of smart buyers who've saved money on their real estate transactions
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=buyer">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#1e3a8a',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🏠</span>
                Start Your Search
              </Button>
            </Link>
            
            <Link to="/how-it-works">
              <Button size="large" variant="secondary" style={{ 
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyersLandingPage;