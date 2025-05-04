import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const SellerLandingPage = () => {
  const servicePackages = [
    {
      name: 'Essential',
      commission: '1-1.5%',
      price: 'Save up to 70%',
      icon: '📋',
      features: [
        'Basic listing services',
        'MLS listing',
        'Contract preparation',
        'Limited support',
        'Digital document handling'
      ]
    },
    {
      name: 'Full Service',
      commission: '2.5-3%',
      price: 'Traditional with savings',
      icon: '🌟',
      features: [
        'Complete seller representation',
        'Professional photography',
        'Marketing materials',
        'Open houses & showings',
        'Full negotiation support',
        'Transaction coordination'
      ],
      popular: true
    },
    {
      name: 'Premium',
      commission: '3-4%',
      price: 'Luxury marketing',
      icon: '🏆',
      features: [
        'Luxury property specialist',
        'Premium marketing package',
        'Virtual tours & drone footage',
        'Staging consultation',
        'Targeted advertising',
        'Concierge services'
      ]
    }
  ];

  const addOnServices = [
    {
      icon: '📸',
      title: 'Professional Photography',
      description: 'High-quality photos and virtual tours to showcase your property'
    },
    {
      icon: '🎨',
      title: 'Home Staging Consultation',
      description: 'Expert advice on presenting your home for maximum appeal'
    },
    {
      icon: '🎯',
      title: 'Digital Marketing Package',
      description: 'Social media marketing, targeted ads, and online promotion'
    },
    {
      icon: '📋',
      title: 'Pre-Listing Inspection',
      description: 'Identify and address issues before buyers\' inspections'
    },
    {
      icon: '🏠',
      title: 'Open House Services',
      description: 'Professional hosting of open houses and private showings'
    },
    {
      icon: '⚖️',
      title: 'Attorney Services',
      description: 'Legal review of contracts and closing documents'
    }
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Lower Commissions',
      description: 'Save thousands with competitive agent rates'
    },
    {
      icon: '🎯',
      title: 'Choose Your Services',
      description: 'Pay only for the services you actually need'
    },
    {
      icon: '🏆',
      title: 'Competitive Proposals',
      description: 'Agents compete for your business with their best offers'
    },
    {
      icon: '📊',
      title: 'Maximum Exposure',
      description: 'Your property marketed to motivated, qualified agents'
    }
  ];

  const processSteps = [
    {
      number: '1',
      title: 'Create Your Listing',
      description: 'Tell us about your property and selling goals'
    },
    {
      number: '2',
      title: 'Choose Your Package',
      description: 'Select the service level that fits your needs'
    },
    {
      number: '3',
      title: 'Review Agent Proposals',
      description: 'Compare offers from qualified agents'
    },
    {
      number: '4',
      title: 'Sell Your Home',
      description: 'Work with your chosen agent to close the deal'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
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
                FOR HOME SELLERS
              </span>
            </div>
            
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}>
              Sell Your Home<br />
              <span style={{ color: '#a7f3d0' }}>Without the 6% Fee</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.5rem',
              marginBottom: '2.5rem',
              opacity: '0.9',
              lineHeight: '1.5'
            }}>
              Choose your service level, get competitive proposals, and save thousands on commissions
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/signup?type=seller">
                <Button size="large" style={{ 
                  backgroundColor: 'white',
                  color: '#059669',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>💰</span>
                  List Your Property
                </Button>
              </Link>
              
              <Link to="/how-it-works-sellers">
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
              From basic listing services to full luxury marketing, find the perfect package for your home
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
                  border: pkg.popular ? '2px solid #10b981' : '1px solid #e2e8f0',
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
                    backgroundColor: '#10b981',
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
                    color: '#10b981',
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
                      <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup?type=seller" style={{ display: 'block' }}>
                  <Button 
                    fullWidth
                    variant={pkg.popular ? 'primary' : 'secondary'}
                    style={pkg.popular ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
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
              Enhance your package with additional services to maximize your home's appeal
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
          background: 'radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              Why Sell Through no3%
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: '0.9', maxWidth: '700px', margin: '0 auto' }}>
              Save money, get better service, and maintain control of your home sale
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
              Your path to selling your home in four simple steps
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {processSteps.map((step, index) => (
              <div key={index} style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#10b981',
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
                    background: 'linear-gradient(90deg, #10b981 0%, #e2e8f0 100%)',
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

      {/* Savings Calculator Section */}
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
                Calculate Your<br />
                <span style={{ color: '#10b981' }}>Commission Savings</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                Traditional real estate commissions typically cost 5-6% of your home's sale price. 
                Our platform helps you save 30-50% or more on these fees.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#10b981' }}>✓</span>
                  <span style={{ fontSize: '1rem', color: '#475569' }}>Save thousands on commission fees</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#10b981' }}>✓</span>
                  <span style={{ fontSize: '1rem', color: '#475569' }}>Get more money from your sale</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem', color: '#10b981' }}>✓</span>
                  <span style={{ fontSize: '1rem', color: '#475569' }}>Professional service at a fair price</span>
                </li>
              </ul>
              <Link to="/signup?type=seller">
                <Button size="large" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
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
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginBottom: '1rem' }}>
                $12,000 - $18,000
              </div>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Potential savings on a $600,000 home sale
              </p>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                  Traditional 6% commission: $36,000
                </p>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                  With no3% (3% total): $18,000
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a' }}>
                  Your savings: $18,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
            Ready to Save on Your Home Sale?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: '0.9' }}>
            Join thousands of smart sellers who've saved money on their real estate commissions
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=seller">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#059669',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>💰</span>
                List Your Property
              </Button>
            </Link>
            
            <Link to="/how-it-works-sellers">
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

export default SellerLandingPage;