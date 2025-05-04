import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const HowItWorksSellersPage = () => {
  const steps = [
    {
      number: '1',
      title: 'Create Your Property Listing',
      description: 'Tell us about your home and what you want to sell it for',
      details: [
        'Provide property details and asking price',
        'Upload photos (or wait for agent photos)',
        'Share your timeline and preferred closing date',
        'Describe any special features or recent upgrades'
      ],
      icon: '🏠'
    },
    {
      number: '2',
      title: 'Choose Your Service Package',
      description: 'Select the level of service that fits your needs',
      details: [
        'Essential: Basic listing services (1-1.5%)',
        'Full Service: Traditional agent services (2.5-3%)',
        'Premium: Luxury marketing package (3-4%)',
        'Customize with add-on services as needed'
      ],
      icon: '📦'
    },
    {
      number: '3',
      title: 'Review Agent Proposals',
      description: 'Compare competitive offers from qualified agents',
      details: [
        'Receive proposals with detailed commission rates',
        'Review marketing strategies and experience',
        'See what services each agent includes',
        'Ask questions through secure messaging'
      ],
      icon: '🔍'
    },
    {
      number: '4',
      title: 'Select Your Agent',
      description: 'Choose the agent with the best offer and experience',
      details: [
        'Accept the proposal that best meets your needs',
        'Sign listing agreement with clear terms',
        'Agent begins marketing your property',
        'Stay updated through the platform'
      ],
      icon: '🤝'
    },
    {
      number: '5',
      title: 'Marketing & Showings',
      description: 'Your agent markets your property to potential buyers',
      details: [
        'Professional photos and virtual tours',
        'MLS listing and online marketing',
        'Open houses and private showings',
        'Regular updates on buyer interest'
      ],
      icon: '📸'
    },
    {
      number: '6',
      title: 'Sell Your Home',
      description: 'Successfully close the sale with professional support',
      details: [
        'Agent handles negotiations with buyers',
        'Review and accept the best offer',
        'Navigate inspections and contingencies',
        'Close the sale and save thousands'
      ],
      icon: '🎉'
    }
  ];

  const faqs = [
    {
      question: 'How much can I save on commission?',
      answer: 'Most sellers save 30-50% compared to traditional 6% commissions. With our Essential package starting at 1-1.5%, you could save $15,000-$20,000 on a $500,000 home sale.'
    },
    {
      question: 'Do agents on your platform have access to the MLS?',
      answer: 'Yes! All agents on our platform are licensed professionals with full MLS access. Your property will be listed on the MLS and all major real estate websites.'
    },
    {
      question: 'Can I choose which services I want?',
      answer: 'Absolutely! Start with a base package (Essential, Full Service, or Premium) and add specific services like professional photography, staging consultation, or extra marketing as needed.'
    },
    {
      question: 'How long does it take to get agent proposals?',
      answer: 'Most sellers receive their first proposals within 24 hours. Popular areas and well-priced homes often get proposals within just a few hours.'
    },
    {
      question: 'What if I need to sell quickly?',
      answer: 'Let agents know your timeline in your listing. Many agents specialize in quick sales and can create accelerated marketing plans to sell your home faster.'
    },
    {
      question: 'Are the agents experienced?',
      answer: 'All agents on our platform are licensed professionals. Many have years of experience and excellent reviews. You can see their experience and track record in their proposals.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            How It Works for Sellers
          </h1>
          <p style={{ 
            fontSize: '1.5rem',
            opacity: '0.9',
            marginBottom: '2.5rem',
            lineHeight: '1.5'
          }}>
            Your step-by-step guide to saving thousands on real estate commissions
          </p>
          <Link to="/signup?type=seller">
            <Button size="large" style={{ 
              backgroundColor: 'white',
              color: '#059669',
              padding: '1rem 2.5rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              List Your Property
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
              Your Selling Journey
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Follow these simple steps to sell your home while saving thousands
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
                  backgroundColor: '#10b981',
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
                          color: '#10b981',
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
              Choose the right level of service for your home sale
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
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
              <div style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: '600', marginBottom: '1rem' }}>
                1-1.5% commission
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Perfect for experienced sellers who need basic services
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> MLS listing
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Basic marketing
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Contract preparation
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
              border: '2px solid #10b981',
              position: 'relative'
            }}>
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
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Full Service
              </h3>
              <div style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: '600', marginBottom: '1rem' }}>
                2.5-3% commission
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Traditional agent services with significant savings
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> All Essential services
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Professional photography
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Open houses & showings
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Full negotiation support
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
              <div style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: '600', marginBottom: '1rem' }}>
                3-4% commission
              </div>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Luxury marketing for high-end properties
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> All Full Service features
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Luxury marketing
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Staging consultation
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span> Premium advertising
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#0f172a'
            }}>
              Your Potential Savings
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              See how much you could save compared to traditional 6% commission
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                $400,000 Home
              </h3>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                Save $12,000
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Traditional: $24,000<br />
                With no3%: $12,000
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                $600,000 Home
              </h3>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                Save $18,000
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Traditional: $36,000<br />
                With no3%: $18,000
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                $800,000 Home
              </h3>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
                Save $24,000
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Traditional: $48,000<br />
                With no3%: $24,000
              </p>
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
              Get answers to common questions about selling on our platform
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
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem'
          }}>
            Ready to Save Thousands?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9'
          }}>
            List your property today and start receiving competitive proposals
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=seller">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#059669',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                List Your Property
              </Button>
            </Link>
            
            <Link to="/sellers">
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

export default HowItWorksSellersPage;