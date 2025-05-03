import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';

const BuyerLandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 1rem',
        background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
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
          background: 'radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
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
            <span style={{ fontSize: '1.25rem' }}>🏠</span>
            <span>Find Your Dream Home, Your Way</span>
          </div>
          
          <h1 style={{ 
            fontSize: '4.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #ffffff 20%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Stop the Endless<br />Agent Calls
          </h1>
          
          <p style={{ 
            fontSize: '1.5rem',
            maxWidth: '750px',
            margin: '0 auto 3rem',
            color: '#e0f2fe',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            Finally, transparency in real estate. Compare agents' services, commission rates, 
            and rebate offers—all in one place. No more mystery fees or unclear value propositions.
          </p>
          
          {currentUser ? (
            <Link to="/buyer">
              <Button size="large" style={{
                backgroundColor: 'white',
                color: '#1e3a8a',
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
            <Link to="/signup?type=buyer">
              <Button size="large" style={{
                backgroundColor: 'white',
                color: '#1e3a8a',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.25)',
              }}>
                Start Your Search Today
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Pain Points Section */}
      <section style={{ 
        padding: '6rem 1rem',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#fee2e2',
              borderRadius: '2rem',
              padding: '0.625rem 1.75rem',
              marginBottom: '1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#991b1b'
            }}>
              The Problem We Solve
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Sound Familiar?
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '📞',
                title: 'Non-Stop Agent Calls',
                desc: 'The moment you show interest in a home, your phone becomes a hotline for agents you\'ve never met.',
                color: '#ef4444'
              },
              {
                icon: '💸',
                title: 'Hidden Costs & Fees',
                desc: 'Commission rates are buried in fine print. You never know what you\'re actually paying for.',
                color: '#f59e0b'
              },
              {
                icon: '🤷‍♂️',
                title: 'Unclear Value Proposition',
                desc: 'Every agent claims to be "the best" but what services do they actually provide? What makes them different?',
                color: '#3b82f6'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                textAlign: 'center', 
                padding: '2.5rem 2rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  backgroundColor: `${item.color}10`, 
                  borderRadius: '0.875rem',
                  width: '3.5rem',
                  height: '3.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.75rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.375rem', 
                  fontWeight: '700', 
                  marginBottom: '0.875rem', 
                  color: '#0f172a' 
                }}>
                  {item.title}
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rebate Section */}
      <section style={{ 
        padding: '6rem 1rem',
        backgroundColor: '#dcfce7',
        borderBottom: '1px solid #bbf7d0'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                backgroundColor: 'white',
                borderRadius: '2rem',
                padding: '0.625rem 1.75rem',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#166534',
                border: '1px solid #bbf7d0'
              }}>
                💰 Money Back in Your Pocket
              </div>
              <h2 style={{ 
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.025em',
                marginBottom: '1.5rem'
              }}>
                Get Thousands Back<br />in Agent Rebates
              </h2>
              <p style={{ 
                fontSize: '1.125rem',
                color: '#374151',
                lineHeight: '1.7',
                marginBottom: '2rem'
              }}>
                Many agents on our platform offer buyer rebates when sellers pay their commission. 
                That's real money back in your pocket—money that could go toward your down payment, 
                closing costs, or that dream kitchen renovation.
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
                color: '#374151'
              }}>
                {[
                  'Average rebate: $2,000-$5,000',
                  'Transparent rebate percentages upfront',
                  'No hidden conditions or fine print',
                  'Money back at closing'
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
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #bbf7d0'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                color: '#0f172a' 
              }}>
                Rebate Calculator
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#374151',
                  fontWeight: '500' 
                }}>
                  Home Price: $500,000
                </label>
                <input 
                  type="range" 
                  min="200000" 
                  max="1000000" 
                  step="50000" 
                  defaultValue="500000"
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ 
                backgroundColor: '#dcfce7',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{ 
                  fontSize: '1rem',
                  color: '#166534',
                  marginBottom: '0.5rem'
                }}>
                  Potential Rebate:
                </p>
                <p style={{ 
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: '#166534',
                  margin: 0
                }}>
                  $3,750
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              How It Works
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Your Home Search, Simplified
            </h2>
          </div>
          
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {[
              {
                step: '1',
                title: 'Share Your Dream Home Criteria',
                desc: 'Tell us what you\'re looking for—location, budget, must-haves, and nice-to-haves. Be as specific as you want.',
                icon: '🎯'
              },
              {
                step: '2',
                title: 'Agents Compete for Your Business',
                desc: 'Receive custom proposals from verified agents. Compare their experience, services, rebate offers, and strategies side by side.',
                icon: '🏆'
              },
              {
                step: '3',
                title: 'Choose Your Perfect Match',
                desc: 'Select the agent that best fits your needs. Work together at your pace, with full transparency on costs and services.',
                icon: '🤝'
              },
              {
                step: '4',
                title: 'Save Money at Closing',
                desc: 'Get your rebate at closing and enjoy your new home. No hidden fees, no surprises—just the deal you agreed to.',
                icon: '💰'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: index < 3 ? '3rem' : '0',
                gap: '1.5rem'
              }}>
                <div style={{ 
                  backgroundColor: '#dbeafe',
                  borderRadius: '1rem',
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: '#1e40af',
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

      {/* Transparency Section */}
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
              Full Transparency
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Compare Everything, Choose Wisely
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                icon: '📊',
                title: 'Commission Rates',
                desc: 'See exactly what each agent charges and what rebates they offer. No hidden fees.'
              },
              {
                icon: '⭐',
                title: 'Verified Reviews',
                desc: 'Read real reviews from past clients. Know exactly who you\'re working with.'
              },
              {
                icon: '📋',
                title: 'Service Packages',
                desc: 'Compare what each agent offers: showings, negotiations, paperwork, and more.'
              },
              {
                icon: '📈',
                title: 'Track Record',
                desc: 'See agents\' success rates, average days on market, and average sale prices.'
              },
              {
                icon: '🗺️',
                title: 'Area Expertise',
                desc: 'Find agents who specialize in your target neighborhoods and property types.'
              },
              {
                icon: '🤝',
                title: 'Communication Style',
                desc: 'Match with agents whose communication preferences align with yours.'
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

      {/* Testimonials Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
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
              Success Stories
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Home Buyers Love Us
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                quote: "I got $4,200 back at closing! Never knew buyer rebates existed until I found this platform. My agent was transparent about everything from day one.",
                author: "Sarah M.",
                location: "San Francisco, CA",
                savings: "$4,200 rebate"
              },
              {
                quote: "Finally, no more mystery calls from random agents. I compared 5 proposals and chose the perfect match. The transparency was refreshing.",
                author: "Michael R.",
                location: "Austin, TX",
                savings: "$3,500 rebate"
              },
              {
                quote: "The ability to see exactly what services each agent offered made the decision so easy. Plus, I saved $2,800 that went straight to my renovation budget!",
                author: "Emily L.",
                location: "Denver, CO",
                savings: "$2,800 rebate"
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
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                      {item.author}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {item.location}
                    </p>
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '8rem 1rem',
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
            Ready to Find Your Perfect Agent?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            Join thousands of home buyers who've saved money and found their dream homes 
            with transparent, competitive agent matching.
          </p>
          
          {currentUser ? (
            <Link to="/buyer">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#1e3a8a',
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
            <Link to="/signup?type=buyer">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#1e3a8a',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
              }}>
                Start Your Free Search
              </Button>
            </Link>
          )}
          
          <p style={{ 
            marginTop: '1.5rem',
            fontSize: '1rem',
            opacity: '0.8'
          }}>
            No commitment required • Free to use • Get proposals within 24 hours
          </p>
        </div>
      </section>
    </div>
  );
};

export default BuyerLandingPage;