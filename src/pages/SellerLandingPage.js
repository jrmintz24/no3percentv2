import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';

const SellerLandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 1rem',
        background: 'linear-gradient(180deg, #065f46 0%, #10b981 100%)',
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
          background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '2rem',
            padding: '0.625rem 1.5rem',
            marginBottom: '2.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>💰</span>
            <span>Save Thousands on Commission</span>
          </div>
          
          <h1 style={{ 
            fontSize: '4.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #ffffff 20%, #6ee7b7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Sell Smarter,<br />Not Harder
          </h1>
          
          <p style={{ 
            fontSize: '1.5rem',
            maxWidth: '750px',
            margin: '0 auto 3rem',
            color: '#d1fae5',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            Take control of your home sale. Let agents compete to sell your property 
            with transparent pricing and custom service packages. Save thousands while 
            getting exactly what you need.
          </p>
          
          {currentUser ? (
            <Link to="/seller">
              <Button size="large" style={{
                backgroundColor: 'white',
                color: '#065f46',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.25)',
              }}>
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signup?type=seller">
              <Button size="large" style={{
                backgroundColor: 'white',
                color: '#065f46',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.25)',
              }}>
                List Your Property Today
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Commission Savings Calculator */}
      <section style={{ 
        padding: '6rem 1rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              Commission Savings
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              See How Much You Can Save
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div style={{ 
              backgroundColor: '#f8fafc',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                color: '#0f172a' 
              }}>
                Commission Savings Calculator
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#374151',
                  fontWeight: '500' 
                }}>
                  Your Home's Value
                </label>
                <div style={{ 
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#166534',
                  marginBottom: '0.5rem'
                }}>
                  $500,000
                </div>
                <input 
                  type="range" 
                  min="200000" 
                  max="2000000" 
                  step="50000" 
                  defaultValue="500000"
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={{ 
                  backgroundColor: '#fee2e2',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    fontSize: '0.875rem',
                    color: '#991b1b',
                    marginBottom: '0.5rem'
                  }}>
                    Traditional 6% Commission
                  </p>
                  <p style={{ 
                    fontSize: '1.875rem',
                    fontWeight: '800',
                    color: '#991b1b',
                    margin: 0
                  }}>
                    $30,000
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    fontSize: '0.875rem',
                    color: '#166534',
                    marginBottom: '0.5rem'
                  }}>
                    Average on RealEstateMatch
                  </p>
                  <p style={{ 
                    fontSize: '1.875rem',
                    fontWeight: '800',
                    color: '#166534',
                    margin: 0
                  }}>
                    $15,000
                  </p>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: '#f0fdf4',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginTop: '1.5rem',
                textAlign: 'center',
                border: '1px solid #bbf7d0'
              }}>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#166534',
                  marginBottom: '0.5rem'
                }}>
                  Your Potential Savings
                </p>
                <p style={{ 
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#166534',
                  margin: 0
                }}>
                  $15,000
                </p>
              </div>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '1.5rem'
              }}>
                Why Pay 6% When You Don't Have To?
              </h3>
              <p style={{ 
                fontSize: '1.125rem',
                color: '#374151',
                lineHeight: '1.7',
                marginBottom: '2rem'
              }}>
                The traditional 6% commission structure hasn't changed in decades, 
                while technology has made selling homes more efficient. Our platform 
                lets agents compete for your business, driving commissions down to 
                fair market rates.
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
                color: '#374151'
              }}>
                {[
                  'Agents typically offer 1.5-4% commission rates',
                  'Choose full service or à la carte options',
                  'Pay only for the services you actually need',
                  'Keep more equity in your pocket'
                ].map((item, index) => (
                  <li key={index} style={{ 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1rem'
                  }}>
                    <span style={{ 
                      color: '#059669',
                      fontSize: '1.25rem',
                      fontWeight: 'bold'
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options */}
      <section style={{ 
        padding: '6rem 1rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              Choose Your Service Level
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Sell Your Way
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'Full Service',
                price: '4-5%',
                desc: 'Traditional full-service experience with competitive rates. Your agent handles everything from listing to closing.',
                features: [
                  'Professional photography',
                  'Marketing & advertising',
                  'Open houses & showings',
                  'Offer negotiation',
                  'Paperwork & closing'
                ],
                color: '#3b82f6',
                bgColor: '#dbeafe'
              },
              {
                title: 'Limited Service',
                price: '2-3%',
                desc: 'Perfect for hands-on sellers. Get professional help where you need it, handle some tasks yourself.',
                features: [
                  'MLS listing',
                  'Professional photos',
                  'Contract preparation',
                  'Negotiation support',
                  'You handle showings'
                ],
                color: '#8b5cf6',
                bgColor: '#ede9fe'
              },
              {
                title: 'À La Carte',
                price: 'Pay per service',
                desc: 'Maximum savings for DIY sellers. Choose only the services you need, when you need them.',
                features: [
                  'Choose services individually',
                  'Pay as you go',
                  'Photography: $300-500',
                  'Contract review: $500',
                  'Showing service: $50/showing'
                ],
                color: '#10b981',
                bgColor: '#d1fae5'
              }
            ].map((option, index) => (
              <div key={index} style={{ 
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                position: 'relative',
                transition: 'all 0.3s ease',
                ':hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <div style={{
                  backgroundColor: option.bgColor,
                  color: option.color,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  {option.price}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#0f172a'
                }}>
                  {option.title}
                </h3>
                
                <p style={{ 
                  color: '#475569', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  {option.desc}
                </p>
                
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  margin: 0
                }}>
                  {option.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#374151',
                      fontSize: '0.9375rem'
                    }}>
                      <span style={{ 
                        color: option.color,
                        fontSize: '1rem'
                      }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              Simple Process
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Sell in 4 Easy Steps
            </h2>
          </div>
          
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {[
              {
                step: '1',
                title: 'List Your Property',
                desc: 'Create your listing in minutes. Add photos, describe your home, and specify what services you need from an agent.',
                icon: '📝'
              },
              {
                step: '2',
                title: 'Receive Proposals',
                desc: 'Qualified agents review your listing and submit custom proposals with their commission rates and service offerings.',
                icon: '📥'
              },
              {
                step: '3',
                title: 'Compare & Choose',
                desc: 'Review proposals side by side. Compare commission rates, services, experience, and reviews. Choose the best fit.',
                icon: '🔍'
              },
              {
                step: '4',
                title: 'Sell & Save',
                desc: 'Work with your chosen agent to sell your home. Save thousands on commission while getting great service.',
                icon: '🎉'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: index < 3 ? '3rem' : '0',
                gap: '1.5rem'
              }}>
                <div style={{ 
                  backgroundColor: '#dcfce7',
                  borderRadius: '1rem',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: '#166534',
                  flexShrink: 0,
                  fontSize: '1.25rem'
                }}>{item.step}</div>
                <div>
                  <h3 style={{ 
                    fontWeight: '700', 
                    marginBottom: '0.5rem', 
                    color: '#0f172a', 
                    fontSize: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    {item.title}
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  </h3>
                  <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '1rem' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Features */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              You're In Control
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Sell on Your Terms
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Set Your Own Terms',
                desc: 'Specify exactly what you need - from full service to minimal assistance. You decide how much help you want.'
              },
              {
                icon: '💡',
                title: 'Complete Transparency',
                desc: 'See all fees, services, and agent qualifications upfront. No hidden costs or surprise charges.'
              },
              {
                icon: '🏆',
                title: 'Quality Agents Only',
                desc: 'All agents are verified, licensed professionals. Read reviews from past clients before choosing.'
              },
              {
                icon: '⚡',
                title: 'Fast Proposals',
                desc: 'Most sellers receive their first proposals within 24 hours. Compare and choose quickly.'
              },
              {
                icon: '💬',
                title: 'Direct Communication',
                desc: 'Message agents directly through our platform. Ask questions and negotiate before committing.'
              },
              {
                icon: '🔒',
                title: 'No Obligations',
                desc: 'Review proposals with no commitment. Only pay when you sign an agreement with your chosen agent.'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                padding: '1.75rem',
                borderRadius: '0.875rem',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  fontWeight: '700', 
                  fontSize: '1.125rem', 
                  marginBottom: '0.625rem',
                  color: '#0f172a'
                }}>
                  {item.title}
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9375rem' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              Success Stories
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Sellers Love Our Platform
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                quote: "Saved $18,000 on commission! I chose a 2.5% full-service agent instead of paying 6%. The service was excellent and my home sold in 12 days.",
                author: "Jennifer K.",
                location: "Seattle, WA",
                savings: "$18,000 saved",
                soldIn: "12 days"
              },
              {
                quote: "I used the à la carte option and only paid $2,500 total. Did my own showings but had professional photos and contract help. Perfect for my needs!",
                author: "Robert M.",
                location: "Phoenix, AZ",
                savings: "$22,500 saved",
                soldIn: "18 days"
              },
              {
                quote: "Received 6 proposals within 24 hours. Compared everything side by side and chose an agent offering 3% with amazing marketing. So much better than interviewing agents myself!",
                author: "Maria S.",
                location: "Miami, FL",
                savings: "$15,000 saved",
                soldIn: "8 days"
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                padding: '2rem',
                borderRadius: '1rem',
                backgroundColor: '#fafafa',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '2rem' }}>★★★★★</span>
                </div>
                <p style={{ 
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: '#374151',
                  marginBottom: '1.5rem',
                  fontStyle: 'italic'
                }}>
                  "{item.quote}"
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {item.author}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {item.location}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {item.savings}
                  </div>
                  <div style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Sold in {item.soldIn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              Common Questions
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Quick Answers for Sellers
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {[
              {
                q: 'How quickly will I receive proposals?',
                a: 'Most sellers receive their first proposals within 24 hours. For well-priced homes in popular areas, you might start seeing proposals within just a few hours.'
              },
              {
                q: 'Are the agents qualified?',
                a: 'Yes! All agents on our platform are licensed professionals who have been verified. You can view their credentials, experience, and reviews from past clients.'
              },
              {
                q: 'Can I negotiate commission rates?',
                a: 'Absolutely! You can message agents directly to discuss their proposals, negotiate rates, or request different service packages before making your decision.'
              },
              {
                q: 'What if I\'m not happy with the proposals?',
                a: 'You\'re never obligated to accept any proposal. You can update your listing, adjust your requirements, or wait for more agents to submit proposals.'
              }
            ].map((item, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '0.75rem'
                }}>
                  {item.q}
                </h3>
                <p style={{
                  color: '#475569',
                  lineHeight: '1.6',
                  fontSize: '0.9375rem'
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/faq"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              View All FAQs
              <span style={{ fontSize: '1.25rem' }}>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '8rem 1rem',
        background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
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
          background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            Ready to Save Thousands?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            List your property today and let qualified agents compete for your business. 
            It's free to list, and you're never obligated to accept a proposal.
          </p>
          
          {currentUser ? (
            <Link to="/seller">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#065f46',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
              }}>
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signup?type=seller">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#065f46',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
              }}>
                List Your Property Now
              </Button>
            </Link>
          )}
          
          <p style={{ 
            marginTop: '1.5rem',
            fontSize: '1rem',
            opacity: '0.8'
          }}>
            No upfront costs • No obligations • Get proposals in 24 hours
          </p>
        </div>
      </section>
    </div>
  );
};

export default SellerLandingPage;