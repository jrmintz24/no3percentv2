import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const SellerLandingPage = () => {
  const [salePrice, setSalePrice] = useState(500000);
  const traditionalFee = salePrice * 0.06;
  const ourFee = salePrice * 0.04;
  const savings = traditionalFee - ourFee;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '6rem 1rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Sell Your Home for Less Commission
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Save thousands on agent fees. Get multiple offers from top agents competing for your listing.
          </p>
          <Link to="/signup?type=seller">
            <Button
              size="large"
              style={{
                backgroundColor: 'white',
                color: '#059669',
                padding: '1rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              List Your Property
            </Button>
          </Link>
        </div>
      </section>

      {/* Commission Savings Calculator */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#111827'
          }}>
            Commission Savings Calculator
          </h2>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Your Home's Sale Price
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1.125rem'
                }}
              />
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <div style={{
                backgroundColor: '#fee2e2',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#991b1b', marginBottom: '0.25rem' }}>
                  Traditional 6%
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                  ${traditionalFee.toLocaleString()}
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#dcfce7',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.25rem' }}>
                  With Us (3-4%)
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#15803d' }}>
                  ${ourFee.toLocaleString()}
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#dbeafe',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.25rem' }}>
                  You Save
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                  ${savings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Choose Your Service Level
          </h2>
          <p style={{
            fontSize: '1.25rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#4b5563',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            Pay only for the services you need. No hidden fees, no surprises.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'Full Service',
                commission: '4-5%',
                features: [
                  'Professional photography',
                  'Virtual tours & videos',
                  'MLS listing & syndication',
                  'Open houses',
                  'Price negotiations',
                  'Contract to closing'
                ],
                best: true
              },
              {
                title: 'Limited Service',
                commission: '2-3%',
                features: [
                  'MLS listing',
                  'Basic photography',
                  'Yard sign',
                  'Contract preparation',
                  'Limited showings',
                  'You handle negotiations'
                ]
              },
              {
                title: 'À La Carte',
                commission: 'Pay per service',
                features: [
                  'Choose only what you need',
                  'MLS listing only: $299',
                  'Photography: $350',
                  'Virtual tour: $250',
                  'Contract review: $500',
                  'Negotiation support: $800'
                ]
              }
            ].map((option, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: option.best ? '2px solid #10b981' : '1px solid #e5e7eb',
                position: 'relative'
              }}>
                {option.best && (
                  <div style={{
                    position: 'absolute',
                    top: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Most Popular
                  </div>
                )}
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  {option.title}
                </h3>
                <p style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#059669',
                  marginBottom: '1.5rem'
                }}>
                  {option.commission}
                </p>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {option.features.map((feature, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                      color: '#374151'
                    }}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#111827'
          }}>
            How It Works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                step: '1',
                title: 'List Your Property',
                description: 'Create your listing with photos, details, and your preferred service level.'
              },
              {
                step: '2',
                title: 'Receive Proposals',
                description: 'Get competitive offers from verified agents within 24-48 hours.'
              },
              {
                step: '3',
                title: 'Compare & Choose',
                description: 'Review commission rates, services, and agent profiles side-by-side.'
              },
              {
                step: '4',
                title: 'Sell & Save',
                description: 'Work with your chosen agent and save thousands on commission.'
              }
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '2rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.6'
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Features Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#111827'
          }}>
            You're Always in Control
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Set Your Terms',
                description: 'Specify exactly what you need and what you\'re willing to pay.'
              },
              {
                icon: '👥',
                title: 'Choose Your Agent',
                description: 'Interview agents, review their track records, and pick the best fit.'
              },
              {
                icon: '💬',
                title: 'Direct Communication',
                description: 'Communicate directly with agents through our secure platform.'
              },
              {
                icon: '📊',
                title: 'Transparent Pricing',
                description: 'See all fees upfront. No hidden costs or surprise charges.'
              },
              {
                icon: '🔄',
                title: 'Change Services Anytime',
                description: 'Upgrade or downgrade your service package as needed.'
              },
              {
                icon: '💰',
                title: 'Pay at Closing',
                description: 'No upfront fees. Pay commission only when your home sells.'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.5',
                  fontSize: '0.875rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Explore Available Services
          </h2>
          <p style={{ color: '#4b5563', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Browse our full catalog of services to understand exactly what you can expect from our agents.
          </p>
          <Link to="/services/sellers">
            <Button
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 2rem'
              }}
            >
              View All Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Success Stories Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#111827'
          }}>
            Success Stories
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'David & Sarah M.',
                location: 'Portland, OR',
                text: 'We saved $12,000 in commission and sold our home in just 3 weeks. The agents competed to give us the best service.',
                savings: 'Saved $12,000',
                soldIn: 'Sold in 3 weeks'
              },
              {
                name: 'Jennifer K.',
                location: 'Miami, FL',
                text: 'I chose exactly which services I needed and paid only 3.5% commission. Traditional agents quoted me 6%!',
                savings: 'Saved $8,500',
                soldIn: 'Sold in 2 weeks'
              },
              {
                name: 'Robert T.',
                location: 'Chicago, IL',
                text: 'The transparency was incredible. I knew exactly what I was paying for and got amazing service.',
                savings: 'Saved $15,000',
                soldIn: 'Sold in 4 weeks'
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <p style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  color: '#374151'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1rem'
                }}>
                  <p style={{ fontWeight: '600', color: '#111827' }}>{testimonial.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{testimonial.location}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {testimonial.savings}
                    </span>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {testimonial.soldIn}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#111827'
          }}>
            Common Questions
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                question: 'How much can I really save?',
                answer: 'Most sellers save between $6,000-$15,000 on a $400,000 home. Our agents typically charge 3-4% total commission instead of the traditional 6%.'
              },
              {
                question: 'Will my home get the same exposure?',
                answer: 'Yes! Your home will be listed on the MLS and all major real estate websites. You get the same exposure as traditional listings.'
              },
              {
                question: 'How quickly will I get agent proposals?',
                answer: 'Most sellers receive their first proposals within 24 hours. You typically get 3-5 proposals within 48 hours.'
              }
            ].map((faq, index) => (
              <div key={index} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
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
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/faq">
              <Button variant="secondary">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Ready to Save Thousands?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            List your property today and let top agents compete for your business.
          </p>
          <Link to="/signup?type=seller">
            <Button
              size="large"
              style={{
                backgroundColor: 'white',
                color: '#059669',
                padding: '1rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              List Your Property
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SellerLandingPage;