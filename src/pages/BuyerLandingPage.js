import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const BuyerLandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Find Your Dream Home Without the Hassle
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Let top agents compete for your business. Get personal service, better rates, and the home you deserve.
          </p>
          <Link to="/signup?type=buyer">
            <Button
              size="large"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '1rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Start Your Search
            </Button>
          </Link>
        </div>
      </section>

      {/* Pain Points Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Tired of the Traditional Home Buying Process?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#4b5563',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            We understand your frustrations. That's why we're changing the game.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {[
              {
                problem: 'Endless Cold Calls',
                solution: 'Choose Who Contacts You',
                icon: '📞'
              },
              {
                problem: 'Hidden Fees',
                solution: 'Transparent Pricing',
                icon: '💰'
              },
              {
                problem: 'Locked-In Contracts',
                solution: 'Work on Your Terms',
                icon: '🔒'
              },
              {
                problem: 'One-Size-Fits-All Service',
                solution: 'Customized Assistance',
                icon: '📋'
              }
            ].map((item, index) => (
              <div key={index} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                ':hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '0.5rem'
                }}>
                  {item.problem}
                </h3>
                <div style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  ↓
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#059669'
                }}>
                  {item.solution}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
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
                title: 'Create Your Profile',
                description: 'Tell us what you\'re looking for in your dream home - location, budget, must-haves, and deal-breakers.'
              },
              {
                step: '2',
                title: 'Receive Proposals',
                description: 'Local agents review your needs and submit personalized proposals with their services and fees.'
              },
              {
                step: '3',
                title: 'Compare & Choose',
                description: 'Review proposals side-by-side, interview agents, and select the one that fits your needs.'
              },
              {
                step: '4',
                title: 'Find Your Home',
                description: 'Work with your chosen agent to find and purchase your perfect home, on your terms.'
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
                  backgroundColor: '#2563eb',
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

      {/* Rebate Calculator Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Buyer Rebates: Your Money Back
          </h2>
          <p style={{
            fontSize: '1.25rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#4b5563'
          }}>
            When sellers pay agent commissions, you can get cash back at closing!
          </p>
          
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#166534'
            }}>
              Potential Rebate Calculator
            </h3>
            <div style={{
              display: 'grid',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Home Price
                </label>
                <input
                  type="number"
                  placeholder="$500,000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Commission Rate
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db'
                }}>
                  <option>2.5% (Typical with us)</option>
                  <option>3% (Traditional)</option>
                </select>
              </div>
            </div>
            <div style={{
              backgroundColor: '#dcfce7',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.125rem', color: '#166534', marginBottom: '0.25rem' }}>
                Estimated Rebate
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#166534' }}>
                $6,250
              </p>
              <p style={{ fontSize: '0.875rem', color: '#166534' }}>
                Back in your pocket at closing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Explore Available Services
          </h2>
          <p style={{ color: '#4b5563', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Browse our full catalog of services to understand exactly what you can expect from our agents.
          </p>
          <Link to="/services/buyers">
            <Button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 2rem'
              }}
            >
              View All Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#111827'
          }}>
            What Buyers Are Saying
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Sarah J.',
                location: 'Seattle, WA',
                text: 'I received 5 proposals within 24 hours! Ended up with an amazing agent who got me a $8,000 rebate at closing.',
                savings: '$8,000 rebate'
              },
              {
                name: 'Michael R.',
                location: 'Austin, TX',
                text: 'No more random calls from agents. I chose who to work with and saved money in the process.',
                savings: '$5,500 rebate'
              },
              {
                name: 'Emily L.',
                location: 'Denver, CO',
                text: 'The transparency was refreshing. I knew exactly what services I was getting and what I\'d pay.',
                savings: '$6,800 rebate'
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                backgroundColor: '#f9fafb',
                borderRadius: '1rem',
                padding: '2rem',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '3rem',
                  color: '#2563eb',
                  position: 'absolute',
                  top: '1rem',
                  left: '1.5rem',
                  opacity: '0.2'
                }}>
                  "
                </div>
                <p style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  color: '#374151',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {testimonial.text}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827' }}>{testimonial.name}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{testimonial.location}</p>
                  </div>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {testimonial.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
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
                question: 'How do buyer rebates work?',
                answer: 'When sellers pay the traditional 5-6% commission, your agent can rebate part of their commission back to you at closing. This puts thousands back in your pocket!'
              },
              {
                question: 'Are buyer rebates legal?',
                answer: 'Yes! Buyer rebates are legal in 40 states. We\'ll let you know if they\'re available in your area when you sign up.'
              },
              {
                question: 'How quickly will I receive proposals?',
                answer: 'Most buyers receive their first proposals within 24 hours. You typically get 3-5 proposals within the first 48 hours.'
              }
            ].map((faq, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
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
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Ready to Find Your Dream Home?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            Join thousands of happy homeowners who saved money and found their perfect home.
          </p>
          <Link to="/signup?type=buyer">
            <Button
              size="large"
              style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '1rem 2.5rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Start Your Search
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BuyerLandingPage;