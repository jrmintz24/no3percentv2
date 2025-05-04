import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const AgentLandingPage = () => {
  const subscriptionTiers = [
    {
      name: 'Starter',
      price: 'Pay as you go',
      icon: '🌱',
      features: [
        'Pay per token used',
        'Access to all listings',
        'Basic agent profile',
        'Standard support',
        'No monthly commitment'
      ]
    },
    {
      name: 'Professional',
      price: '$49/month',
      icon: '⭐',
      features: [
        '10 tokens included monthly',
        'Featured agent badge',
        'Advanced analytics',
        'Priority support',
        '10% token discount',
        'Enhanced profile'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199/month',
      icon: '🚀',
      features: [
        '50 tokens included monthly',
        'Premium agent badge',
        'Team collaboration tools',
        'API access',
        '20% token discount',
        'Dedicated support'
      ]
    }
  ];

  const benefits = [
    {
      icon: '🎯',
      title: 'Quality Leads',
      description: 'Connect with motivated buyers and sellers ready to transact'
    },
    {
      icon: '💰',
      title: 'Flexible Commission',
      description: 'Set your own rates and service packages to win business'
    },
    {
      icon: '🏆',
      title: 'Build Your Brand',
      description: 'Showcase your expertise and grow your client base'
    },
    {
      icon: '📈',
      title: 'Grow Your Business',
      description: 'Access a steady stream of new client opportunities'
    }
  ];

  const features = [
    {
      icon: '🔍',
      title: 'Smart Matching',
      description: 'Get matched with clients looking for your specific expertise'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your performance and optimize your proposals'
    },
    {
      icon: '💬',
      title: 'Secure Messaging',
      description: 'Communicate with clients directly through our platform'
    },
    {
      icon: '🛡️',
      title: 'Verified Listings',
      description: 'Work with pre-qualified buyers and sellers'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Manage your business on the go with our mobile app'
    },
    {
      icon: '🎓',
      title: 'Training Resources',
      description: 'Access exclusive training to improve your success rate'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
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
                FOR REAL ESTATE AGENTS
              </span>
            </div>
            
            <h1 style={{ 
              fontSize: '3.5rem',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.1'
            }}>
              Grow Your Business<br />
              <span style={{ color: '#e9d5ff' }}>With Quality Leads</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.5rem',
              marginBottom: '2.5rem',
              opacity: '0.9',
              lineHeight: '1.5'
            }}>
              Connect with motivated buyers and sellers. Set your own rates. Build your brand.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/signup?type=agent">
                <Button size="large" style={{ 
                  backgroundColor: 'white',
                  color: '#7c3aed',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🚀</span>
                  Join as Agent
                </Button>
              </Link>
              
              <Link to="/how-it-works-agents">
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

      {/* Benefits Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>
              Why Join no3%
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: '700px', margin: '0 auto' }}>
              Join a platform designed to help you grow your real estate business
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {benefits.map((benefit, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  backgroundColor: '#faf5ff',
                  width: '5rem',
                  height: '5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '1rem',
                  margin: '0 auto 1rem',
                  color: '#7c3aed'
                }}>
                  {benefit.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {benefit.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Platform Features
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Everything you need to succeed in one platform
            </p>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#faf5ff',
                  borderRadius: '0.5rem',
                  flexShrink: 0,
                  color: '#7c3aed'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Choose Your Plan
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Start free or choose a plan that fits your business needs
            </p>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {subscriptionTiers.map((tier, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '2rem',
                  position: 'relative',
                  border: tier.popular ? '2px solid #a855f7' : '1px solid #e2e8f0',
                  boxShadow: tier.popular ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {tier.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#a855f7',
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
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tier.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {tier.name}
                  </h3>
                  <div style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#a855f7',
                    marginBottom: '0.25rem'
                  }}>
                    {tier.price}
                  </div>
                </div>
                
                <ul style={{ 
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 2rem 0',
                  flex: 1
                }}>
                  {tier.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.9375rem',
                      color: '#475569'
                    }}>
                      <span style={{ color: '#a855f7', flexShrink: 0 }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup?type=agent" style={{ display: 'block' }}>
                  <Button 
                    fullWidth
                    variant={tier.popular ? 'primary' : 'secondary'}
                    style={tier.popular ? { backgroundColor: '#a855f7', borderColor: '#a855f7' } : {}}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Tokens Work Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              How Tokens Work
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Our token system ensures quality proposals and motivated clients
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#a855f7'
              }}>
                🪙
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Token Pricing
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Buyer listings: 1-2 tokens<br />
                Seller listings: 2-4 tokens<br />
                Price varies by demand
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#a855f7'
              }}>
                ⭐
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Priority Boost
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Add extra tokens to appear higher in client proposal lists and win more business
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#a855f7'
              }}>
                ✨
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Verified Listings
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Verified listings cost more tokens but have higher conversion rates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
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
            Ready to Grow Your Business?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: '0.9' }}>
            Join thousands of successful agents on our platform
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=agent">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#7c3aed',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🚀</span>
                Start Free Today
              </Button>
            </Link>
            
            <Link to="/how-it-works-agents">
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

export default AgentLandingPage;