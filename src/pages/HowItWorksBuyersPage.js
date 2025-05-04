import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const HowItWorksBuyersPage = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Your Buyer Profile',
      description: 'Tell us about your dream home and what you\'re looking for',
      details: [
        'Specify your budget and preferred locations',
        'List must-have features and property types',
        'Set your timeline and move-in date',
        'Choose between commission-based or flat-fee pricing'
      ],
      icon: '📝'
    },
    {
      number: '2',
      title: 'Choose Your Service Package',
      description: 'Select the level of service that fits your needs',
      details: [
        'Showing Only: Just need someone to show properties',
        'Essential: Basic representation and contract help',
        'Full Service: Traditional agent services with savings',
        'Premium: White-glove service for luxury homes'
      ],
      icon: '📦'
    },
    {
      number: '3',
      title: 'Add Custom Services',
      description: 'Enhance your package with additional services',
      details: [
        'Home inspection coordination',
        'Market analysis and research',
        'Mortgage and financing assistance',
        'Legal document review',
        'Relocation services'
      ],
      icon: '➕'
    },
    {
      number: '4',
      title: 'Review Agent Proposals',
      description: 'Compare proposals from qualified agents',
      details: [
        'See commission rates and rebate offers',
        'Review included services and experience',
        'Read agent profiles and client reviews',
        'Message agents before accepting'
      ],
      icon: '🔍'
    },
    {
      number: '5',
      title: 'Choose Your Agent',
      description: 'Select the best agent for your needs',
      details: [
        'Accept the proposal that offers the best value',
        'Connect directly with your chosen agent',
        'Sign representation agreement',
        'Begin your home search'
      ],
      icon: '🤝'
    },
    {
      number: '6',
      title: 'Find Your Dream Home',
      description: 'Work with your agent to find and purchase your home',
      details: [
        'View properties that match your criteria',
        'Receive expert negotiation support',
        'Get help with inspections and paperwork',
        'Close on your new home and save thousands'
      ],
      icon: '🏡'
    }
  ];

  const faqs = [
    {
      question: 'How much does it cost to use the platform?',
      answer: 'It\'s completely free for buyers! Agents pay to submit proposals, but there\'s no cost to you. You only pay the agreed commission when you successfully purchase a home.'
    },
    {
      question: 'What are buyer rebates?',
      answer: 'When sellers pay your agent\'s commission (typically 2.5-3%), many agents on our platform offer to rebate a portion back to you. This can be thousands of dollars you can use for closing costs, moving expenses, or keep as cash.'
    },
    {
      question: 'How long does it take to get proposals?',
      answer: 'Most buyers receive their first proposals within 24 hours. Well-detailed listings in popular areas often get proposals within just a few hours.'
    },
    {
      question: 'Can I interview agents before choosing?',
      answer: 'Yes! You can message agents through our platform to ask questions and get to know them before accepting any proposal. Many buyers have phone or video calls before making their decision.'
    },
    {
      question: 'What if I don\'t like any of the proposals?',
      answer: 'You\'re never obligated to accept a proposal. You can update your listing to attract different agents, wait for more proposals, or adjust your requirements. You\'re always in control.'
    },
    {
      question: 'Are the agents qualified?',
      answer: 'All agents on our platform are licensed professionals who have passed our verification process. Many have years of experience and excellent client reviews.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            How It Works for Buyers
          </h1>
          <p style={{ 
            fontSize: '1.5rem',
            opacity: '0.9',
            marginBottom: '2.5rem',
            lineHeight: '1.5'
          }}>
            Your step-by-step guide to saving thousands on your home purchase
          </p>
          <Link to="/signup?type=buyer">
            <Button size="large" style={{ 
              backgroundColor: 'white',
              color: '#1e3a8a',
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Get Started Now
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
              Your Home Buying Journey
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Follow these simple steps to find your dream home while saving thousands
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
                  backgroundColor: '#3b82f6',
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
                          color: '#3b82f6',
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

      {/* Service Packages Comparison */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}> 
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Compare Service Packages
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Choose the right level of service for your home buying needs
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Showing Only Package */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Showing Only
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: '600', marginBottom: '1rem' }}>
                Pay per showing
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Perfect for experienced buyers who only need property access
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Property showings
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Flexible scheduling
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✗</span> Negotiation support
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✗</span> Contract assistance
                </li>
              </ul>
            </div>

            {/* Essential Package */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Essential
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: '600', marginBottom: '1rem' }}>
                1-1.5% commission
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Basic representation for budget-conscious buyers
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Property showings
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Offer preparation
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Basic contract review
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#ef4444' }}>✗</span> Full negotiation support
                </li>
              </ul>
            </div>

            {/* Full Service Package */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '2px solid #3b82f6',
              position: 'relative'
            }}>
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
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Full Service
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: '600', marginBottom: '1rem' }}>
                2-2.5% commission
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Complete buyer representation with significant savings
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> All Essential services
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Full negotiation support
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Inspection coordination
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Closing assistance
                </li>
              </ul>
            </div>

            {/* Premium Package */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Premium
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: '600', marginBottom: '1rem' }}>
                2.5-3% commission
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                White-glove service for luxury home buyers
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> All Full Service features
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Luxury home specialist
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Off-market opportunities
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Concierge services
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Rebates Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              How Buyer Rebates Work
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Get money back when you purchase your home
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
                marginBottom: '1rem'
              }}>
                💰
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Seller Pays Commission
              </h3>
              <p style={{ color: '#64748b' }}>
                In most transactions, the seller pays both agent commissions (typically 5-6% total)
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
                marginBottom: '1rem'
              }}>
                🤝
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Agent Offers Rebate
              </h3>
              <p style={{ color: '#64748b' }}>
                Your agent rebates a portion of their commission back to you at closing
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
                marginBottom: '1rem'
              }}>
                🎯
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                You Save Money
              </h3>
              <p style={{ color: '#64748b' }}>
                Use the rebate for closing costs, down payment, or keep as cash
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '1rem',
            padding: '2rem',
            border: '2px solid #3b82f6'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
              Example Rebate Calculation
            </h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Home Price
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  $500,000
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Buyer Agent Commission
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  3% ($15,000)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Agent Rebate
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  1.5% ($7,500)
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Your Net Cost
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#16a34a' }}>
                  1.5% ($7,500)
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
              Get answers to common questions about the buying process
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
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem'
          }}>
            Ready to Start Saving?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9'
          }}>
            Join thousands of buyers who've saved money with our platform
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=buyer">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#1e3a8a',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                Get Started Now
              </Button>
            </Link>
            
            <Link to="/buyers">
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

export default HowItWorksBuyersPage;