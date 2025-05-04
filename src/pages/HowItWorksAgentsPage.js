import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const HowItWorksAgentsPage = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Your Agent Profile',
      description: 'Set up your professional profile and verification',
      details: [
        'Provide your license information',
        'Add your experience and specialties',
        'Upload professional headshot',
        'Complete verification process'
      ],
      icon: '👤'
    },
    {
      number: '2',
      title: 'Choose Your Subscription',
      description: 'Select a plan that fits your business needs',
      details: [
        'Starter: Pay as you go with tokens',
        'Professional: $49/month with 10 tokens included',
        'Enterprise: $199/month with 50 tokens included',
        'Upgrade or downgrade anytime'
      ],
      icon: '💳'
    },
    {
      number: '3',
      title: 'Browse Available Listings',
      description: 'Find clients looking for your expertise',
      details: [
        'Filter by location, price range, and type',
        'View detailed client requirements',
        'See what services they need',
        'Identify verified vs unverified listings'
      ],
      icon: '🔍'
    },
    {
      number: '4',
      title: 'Submit Proposals',
      description: 'Craft competitive proposals to win business',
      details: [
        'Set your commission rate',
        'Choose services you\'ll provide',
        'Write personalized message',
        'Use priority boost for visibility'
      ],
      icon: '📝'
    },
    {
      number: '5',
      title: 'Connect with Clients',
      description: 'Build relationships with potential clients',
      details: [
        'Message clients through the platform',
        'Answer questions about your proposal',
        'Schedule calls or meetings',
        'Negotiate terms if needed'
      ],
      icon: '💬'
    },
    {
      number: '6',
      title: 'Close the Deal',
      description: 'Win the listing and complete the transaction',
      details: [
        'Client accepts your proposal',
        'Sign representation agreement',
        'Complete the real estate transaction',
        'Get paid your agreed commission'
      ],
      icon: '🎯'
    }
  ];

  const faqs = [
    {
      question: 'How much does it cost to join?',
      answer: 'You can start with our free Starter plan and pay only for the tokens you use. Professional and Enterprise plans offer better value with included tokens and additional features.'
    },
    {
      question: 'What are tokens and how do they work?',
      answer: 'Tokens are used to submit proposals. Buyer listings typically cost 1-2 tokens, while seller listings cost 2-4 tokens. Prices vary based on demand and whether listings are verified.'
    },
    {
      question: 'How do I get more clients?',
      answer: 'Submit compelling proposals, maintain a strong profile with good reviews, respond quickly to messages, and use priority boost to appear higher in client proposal lists.'
    },
    {
      question: 'Can I set my own commission rates?',
      answer: 'Yes! You have complete control over your commission rates and service packages. You can offer different rates for different service levels.'
    },
    {
      question: 'What types of clients are on the platform?',
      answer: 'We have both buyers and sellers across all price ranges. Many are sophisticated clients looking for better value and transparency in their real estate transactions.'
    },
    {
      question: 'How do priority boosts work?',
      answer: 'You can add extra tokens to your proposal to appear higher in the client\'s list. The more tokens you add, the higher your priority. This can significantly increase your chances of winning the business.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            How It Works for Agents
          </h1>
          <p style={{ 
            fontSize: '1.5rem',
            opacity: '0.9',
            marginBottom: '2.5rem',
            lineHeight: '1.5'
          }}>
            Your guide to growing your real estate business on no3%
          </p>
          <Link to="/signup?type=agent">
            <Button size="large" style={{ 
              backgroundColor: 'white',
              color: '#7c3aed',
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Join as Agent
            </Button>
          </Link>
        </div>
      </section>

      {/* Process Steps Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Your Path to Success
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Follow these steps to connect with clients and grow your business
            </p>
          </div>

          <div style={{ display: 'grid', gap: '3rem' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ 
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '2rem',
                alignItems: 'start'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: '#a855f7',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {step.number}
                </div>
                
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{step.icon}</span>
                    <h3 style={{ 
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}>
                      {step.title}
                    </h3>
                  </div>
                  
                  <p style={{ 
                    fontSize: '1.125rem',
                    color: '#475569',
                    marginBottom: '1.5rem'
                  }}>
                    {step.description}
                  </p>
                  
                  <ul style={{ 
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: '0.75rem'
                  }}>
                    {step.details.map((detail, idx) => (
                      <li key={idx} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#64748b'
                      }}>
                        <span style={{ 
                          color: '#a855f7',
                          fontSize: '1.25rem'
                        }}>
                          ✓
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
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
              Select the subscription that matches your business goals
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Starter Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Starter
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#a855f7', fontWeight: '600', marginBottom: '1rem' }}>
                Pay as you go
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Perfect for agents just getting started
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> No monthly fee
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Pay per token
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Basic agent profile
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✗</span> No monthly tokens
                </li>
              </ul>
            </div>

            {/* Professional Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '2px solid #a855f7',
              position: 'relative'
            }}>
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
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Professional
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#a855f7', fontWeight: '600', marginBottom: '1rem' }}>
                $49/month
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Best for active agents
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> 10 tokens included
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Featured agent badge
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Advanced analytics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> 10% token discount
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Enterprise
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#a855f7', fontWeight: '600', marginBottom: '1rem' }}>
                $199/month
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                For teams and top producers
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> 50 tokens included
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Premium agent badge
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Team features
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> 20% token discount
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Token System Explanation */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Understanding Tokens
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              How our token system ensures quality connections
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#a855f7'
              }}>
                🪙
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Dynamic Pricing
              </h3>
              <p style={{ color: '#64748b' }}>
                Token costs vary based on listing type, verification status, and market demand
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center'
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
              <p style={{ color: '#64748b' }}>
                Add extra tokens to your proposal to appear higher in client lists
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#a855f7'
              }}>
                💎
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Quality Leads
              </h3>
              <p style={{ color: '#64748b' }}>
                Token system ensures serious clients and reduces spam proposals
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '1rem',
            padding: '2rem',
            border: '2px solid #a855f7'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
              Token Pricing Guide
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Buyer Listings
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  1-2 tokens
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Seller Listings
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  2-4 tokens
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Verified Listings
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  1.5x multiplier
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Priority Boost
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  +1-10 tokens
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569'
            }}>
              Get answers to common questions about our agent platform
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#0f172a'
                }}>
                  {faq.question}
                </h3>
                <p style={{ 
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {faq.answer}
                </p>
              </div>
            ))}
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
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem'
          }}>
            Ready to Grow Your Business?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9'
          }}>
            Join thousands of successful agents on our platform
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=agent">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#7c3aed',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Join as Agent
              </Button>
            </Link>
            
            <Link to="/agents">
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

export default HowItWorksAgentsPage;