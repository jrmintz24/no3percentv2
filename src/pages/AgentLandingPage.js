import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';

const AgentLandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 1rem',
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        textAlign: 'center',
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
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '2rem',
            padding: '0.625rem 1.5rem',
            marginBottom: '2rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>🚀</span>
            <span>For Top Real Estate Agents</span>
          </div>
          
          <h1 style={{ 
            fontSize: '4.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1',
            letterSpacing: '-0.02em'
          }}>
            Stop Paying for<br />Cold Leads
          </h1>
          
          <p style={{ 
            fontSize: '1.5rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            color: '#e0e7ff',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Get matched with serious buyers and sellers who choose you based on merit, not who pays the most for ads.
          </p>
          
          {!currentUser ? (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/signup?type=agent">
                <Button size="large" style={{
                  backgroundColor: 'white',
                  color: '#7c3aed',
                  padding: '1rem 3rem',
                  fontSize: '1.125rem',
                  borderRadius: '0.625rem',
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  fontWeight: '700'
                }}>
                  Join Our Network
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="secondary" size="large" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  borderRadius: '0.625rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/agent/dashboard">
              <Button size="large" style={{
                backgroundColor: 'white',
                color: '#7c3aed',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                fontWeight: '700'
              }}>
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '4rem 1rem',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { value: '85%', label: 'Lead-to-Client Conversion', subtext: 'vs 3-5% industry average' },
              { value: '$0', label: 'Monthly Fees', subtext: 'Pay only when you close' },
              { value: '2.5x', label: 'Higher Commission', subtext: 'Than traditional referrals' },
              { value: '95%', label: 'Client Satisfaction', subtext: 'Verified reviews' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#7c3aed', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#1f2937', fontWeight: '600', marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Better Than Zillow Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              borderRadius: '2rem',
              padding: '0.625rem 1.75rem',
              marginBottom: '1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#92400e'
            }}>
              The RealEstateMatch Advantage
            </div>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '1rem'
            }}>
              Why We're Better Than Zillow
            </h2>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Stop competing with 50+ agents for the same lead. Get matched with clients who actually want to work with you.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'Qualified Leads Only',
                zillow: 'Random inquiries from browsers',
                us: 'Pre-qualified buyers and motivated sellers',
                icon: '✅'
              },
              {
                title: 'Pricing Model',
                zillow: 'Pay upfront for maybe-leads',
                us: 'Pay only when you close deals',
                icon: '💰'
              },
              {
                title: 'Competition',
                zillow: 'Fight with 50+ agents per lead',
                us: 'Clients choose YOU specifically',
                icon: '🎯'
              },
              {
                title: 'Client Relationship',
                zillow: 'Cold outreach to strangers',
                us: 'Warm intro to interested clients',
                icon: '🤝'
              },
              {
                title: 'Commission Control',
                zillow: 'Race to the bottom on fees',
                us: 'Set your own competitive rates',
                icon: '📊'
              },
              {
                title: 'Lead Quality',
                zillow: '3-5% conversion rate',
                us: '85% lead-to-client conversion',
                icon: '📈'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                backgroundColor: '#f8fafc',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  fontSize: '2rem', 
                  marginBottom: '1rem',
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#0f180a'
                }}>
                  {item.title}
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    color: '#ef4444', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>✕</span>
                    <span>Zillow: {item.zillow}</span>
                  </div>
                  <div style={{ 
                    color: '#22c55e',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>✓</span>
                    <span>Us: {item.us}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#dbeafe',
              borderRadius: '2rem',
              padding: '0.625rem 1.75rem',
              marginBottom: '1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1e40af'
            }}>
              How it works
            </div>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Your Path to Better Clients
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gap: '2rem'
          }}>
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                desc: 'Showcase your expertise, experience, and unique value proposition. Add credentials, reviews, and specializations.',
                icon: '👤'
              },
              {
                step: '2',
                title: 'Browse Real Opportunities',
                desc: 'See detailed buyer requirements and seller listings. No more guessing - know exactly what clients need before you reach out.',
                icon: '🔍'
              },
              {
                step: '3',
                title: 'Submit Winning Proposals',
                desc: 'Craft personalized proposals with your commission structure and service offerings. Stand out with your expertise, not just price.',
                icon: '📝'
              },
              {
                step: '4',
                title: 'Get Chosen by Clients',
                desc: 'Clients review proposals and choose you based on merit. Start with a warm relationship, not a cold call.',
                icon: '🤝'
              },
              {
                step: '5',
                title: 'Close Deals, Get Paid',
                desc: 'Work with motivated clients who value your expertise. Pay only a small success fee when you close - no upfront costs.',
                icon: '💰'
              }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'flex-start',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.5rem'
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.875rem'
                    }}>
                      {item.step}
                    </span>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0
                    }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{
                    color: '#475569',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#dcfce7',
            borderRadius: '2rem',
            padding: '0.625rem 1.75rem',
            marginBottom: '1.25rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#166534'
          }}>
            Simple pricing
          </div>
          <h2 style={{ 
            fontSize: '3rem',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.025em',
            marginBottom: '1rem'
          }}>
            Pay Only When You Succeed
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            color: '#475569',
            maxWidth: '600px',
            margin: '0 auto 3rem'
          }}>
            No monthly fees. No upfront costs. Just a small success fee when you close deals.
          </p>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '1.5rem',
            padding: '3rem',
            border: '1px solid #e2e8f0',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
              10%
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '2rem' }}>
              Of Your Commission
            </div>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
              {[
                'No monthly subscription fees',
                'No pay-per-lead charges',
                'No advertising costs',
                'Unlimited proposal submissions',
                'Full platform access',
                'Direct client messaging'
              ].map((item, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  color: '#374151'
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#22c55e"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup?type=agent">
              <Button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                width: '100%',
                padding: '1rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '600'
              }}>
                Start Free Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#e0f2fe',
              borderRadius: '2rem',
              padding: '0.625rem 1.75rem',
              marginBottom: '1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0369a1'
            }}>
              Success stories
            </div>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Agents Love Working With Us
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Sarah Chen',
                role: 'Luxury Real Estate Specialist',
                image: '👩‍💼',
                quote: 'I closed 3 deals in my first month, all from clients who specifically chose me. No more wasting time on tire kickers.',
                stats: '$2.1M in sales'
              },
              {
                name: 'Michael Rodriguez',
                role: 'First-Time Buyer Expert',
                image: '👨‍💼',
                quote: 'The quality of leads is incredible. These are real buyers with real budgets, not just people browsing.',
                stats: '12 closed deals'
              },
              {
                name: 'Emily Thompson',
                role: 'Investment Property Agent',
                image: '👩‍💼',
                quote: 'I love that I can set my own commission and showcase my expertise. Clients choose me for my value, not just price.',
                stats: '95% client satisfaction'
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {testimonial.image}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{testimonial.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{testimonial.role}</div>
                    </div>
                  </div>
                  <p style={{ color: '#374151', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </p>
                </div>
                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb',
                  color: '#3b82f6',
                  fontWeight: '600'
                }}>
                  {testimonial.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              borderRadius: '2rem',
              padding: '0.625rem 1.75rem',
              marginBottom: '1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#92400e'
            }}>
              FAQs
            </div>
            <h2 style={{ 
              fontSize: '3rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Common Questions
            </h2>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                q: 'How is this different from Zillow Premier Agent?',
                a: 'Unlike Zillow, where you pay upfront for leads that 50+ agents compete for, our clients specifically choose YOU. You only pay when you close deals, and you set your own commission rates.'
              },
              {
                q: 'What\'s the catch? Why no monthly fees?',
                a: 'No catch! We believe in aligning our success with yours. We only make money when you make money. This ensures we\'re focused on quality matches, not quantity.'
              },
              {
                q: 'How do clients find and choose agents?',
                a: 'Clients post their requirements, and you submit tailored proposals. They review your experience, approach, and pricing, then choose the agent that best fits their needs.'
              },
              {
                q: 'Can I work in multiple markets?',
                a: 'Yes! You can submit proposals for any listing in your licensed areas. Many agents expand their business by working across multiple cities or regions.'
              },
              {
                q: 'What happens after a client chooses me?',
                a: 'You\'ll connect directly through our messaging system to discuss details, schedule meetings, and move forward with the transaction. We provide tools to manage the entire process.'
              }
            ].map((faq, index) => (
              <div key={index} style={{
                backgroundColor: '#fafafa',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '0.75rem'
                }}>
                  {faq.q}
                </h3>
                <p style={{
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 1rem',
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Ready to Work with Better Clients?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Join our network of top agents who are closing more deals with less hassle and higher commissions.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/signup?type=agent">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#7c3aed',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700'
              }}>
                Start Free Today
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="large" style={{ 
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '600'
              }}>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentLandingPage;