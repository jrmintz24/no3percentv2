import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';

const HomePage = () => {
  const { currentUser, userProfile } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 1rem',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Agent CTA in top right corner */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 2
        }}>
          <Link to="/agents">
            <Button style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#60a5fa',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 0.5)'
              }
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            >
              Are you an agent?
            </Button>
          </Link>
        </div>

        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 50% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '2rem',
            padding: '0.625rem 1.5rem',
            marginBottom: '2.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>🎯</span>
            <span>You're in charge. Finally.</span>
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
            Real Estate,<br />Your Way
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem',
            maxWidth: '650px',
            margin: '0 auto 3rem',
            color: '#cbd5e1',
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            Stop paying for services you don't need. Let top agents compete 
            for your business. Get exactly what you want, when you want it.
          </p>
          
          {!currentUser ? (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/signup">
                <Button size="large" style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '1rem 3rem',
                  fontSize: '1.125rem',
                  borderRadius: '0.625rem',
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
                  border: 'none'
                }}>
                  Take Control
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="secondary" size="large" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
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
            <Link to={`/${userProfile?.userType}`}>
              <Button size="large" style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
              }}>
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Social Proof Section */}
      <section style={{ 
        padding: '3rem 1rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {[
              { value: '$2.5M+', label: 'Saved on commissions' },
              { value: '10,000+', label: 'Happy homeowners' },
              { value: '4.9/5', label: 'Average rating' },
              { value: '14 days', label: 'Average match time' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9375rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#fafafa' }}>
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
              Why we're different
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              The Power is Yours
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '🎮',
                title: 'You Control Everything',
                desc: 'Choose your services à la carte style. Want just paperwork? Cool. Need the full VIP treatment? Also cool. You decide, you pay for only what you need.'
              },
              {
                icon: '⚡',
                title: 'Instant Access',
                desc: 'No more waiting for callbacks. Connect with verified agents instantly. They come to you with their best offers. It\'s like having agents on speed dial.'
              },
              {
                icon: '🏆',
                title: 'Top Talent Only',
                desc: 'Every agent is vetted and rated. They compete for your business, so you get the cream of the crop. Think of it as a talent show where you\'re the judge.'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                textAlign: 'center', 
                padding: '2.5rem 2rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ 
                  backgroundColor: '#f8fafc', 
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
                <h3 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '0.875rem', color: '#0f172a' }}>
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
      
      {/* How It Works Section - Updated to link to landing pages */}
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
              How it works
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Your Journey, Simplified
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '3rem',
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            {/* For Buyers */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#dbeafe',
                borderRadius: '1.5rem',
                padding: '0.5rem 1.25rem',
                marginBottom: '2rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: '#1e40af',
                gap: '0.5rem'
              }}>
                <span>For Buyers</span>
                <span>🏠</span>
              </div>
              
              <h3 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                color: '#0f172a'
              }}>
                Find Your Dream Home
              </h3>
              
              {[
                {
                  step: '1',
                  title: 'Share Your Vision',
                  desc: 'Tell us about your perfect home - location, budget, must-haves. Be as detailed as you want, this is your future we\'re talking about.',
                  icon: '✨'
                },
                {
                  step: '2',
                  title: 'Agents Compete for You',
                  desc: 'Qualified agents review your needs and submit personalized proposals. Compare their experience, strategies, and commission rates side by side.',
                  icon: '🎯'
                },
                {
                  step: '3',
                  title: 'Choose & Close',
                  desc: 'Pick the agent that feels right. Work together at your pace, paying only for the services you actually need. Welcome home!',
                  icon: '🔑'
                }
              ].map((item, index) => (
                <div key={index} style={{ marginBottom: index < 2 ? '2rem' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ 
                      backgroundColor: '#dbeafe',
                      borderRadius: '0.75rem',
                      width: '2.5rem',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      fontWeight: '700',
                      color: '#1e40af',
                      flexShrink: 0,
                      fontSize: '1rem'
                    }}>{item.step}</div>
                    <div>
                      <h4 style={{ 
                        fontWeight: '600', 
                        marginBottom: '0.5rem', 
                        color: '#0f172a', 
                        fontSize: '1.125rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {item.title}
                        <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      </h4>
                      <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link to="/buyers">
                <Button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.625rem',
                  fontWeight: '600',
                  marginTop: '2rem',
                  fontSize: '1.0625rem'
                }}>
                  Start Your Home Search
                </Button>
              </Link>
            </div>
            
            {/* For Sellers */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#dcfce7',
                borderRadius: '1.5rem',
                padding: '0.5rem 1.25rem',
                marginBottom: '2rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: '#166534',
                gap: '0.5rem'
              }}>
                <span>For Sellers</span>
                <span>💰</span>
              </div>
              
              <h3 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                color: '#0f172a'
              }}>
                Sell Smart, Save Big
              </h3>
              
              {[
                {
                  step: '1',
                  title: 'List Your Property',
                  desc: 'Upload photos, add details, and specify what help you need. From full-service to just paperwork, you\'re in control of the process.',
                  icon: '📸'
                },
                {
                  step: '2',
                  title: 'Review Proposals',
                  desc: 'Agents compete for your listing with custom proposals. See exactly what each offers, their commission rates, and marketing strategies.',
                  icon: '📊'
                },
                {
                  step: '3',
                  title: 'Sell with Confidence',
                  desc: 'Choose your agent and sell on your terms. Save thousands in commissions while getting the exact services you need. Celebrate your sale!',
                  icon: '🎉'
                }
              ].map((item, index) => (
                <div key={index} style={{ marginBottom: index < 2 ? '2rem' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ 
                      backgroundColor: '#dcfce7',
                      borderRadius: '0.75rem',
                      width: '2.5rem',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      fontWeight: '700',
                      color: '#166534',
                      flexShrink: 0,
                      fontSize: '1rem'
                    }}>{item.step}</div>
                    <div>
                      <h4 style={{ 
                        fontWeight: '600', 
                        marginBottom: '0.5rem', 
                        color: '#0f172a', 
                        fontSize: '1.125rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {item.title}
                        <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      </h4>
                      <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.9375rem' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link to="/sellers">
                <Button style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '0.625rem',
                  fontWeight: '600',
                  marginTop: '2rem',
                  fontSize: '1.0625rem'
                }}>
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section style={{ padding: '6rem 1rem', backgroundColor: '#fafafa' }}>
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
              The good stuff
            </div>
            <h2 style={{ 
              fontSize: '2.75rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>
              Why People Love Us
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
                title: 'You Pick What You Pay For',
                desc: 'No bundled services you don\'t want. Choose exactly what you need, skip the rest.'
              },
              {
                icon: '💎',
                title: 'Premium Agents, Better Rates',
                desc: 'Top-tier agents compete for your business. Quality service without the premium price tag.'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast Matching',
                desc: 'Post your needs, get proposals within hours. No more endless phone tag.'
              },
              {
                icon: '🛡️',
                title: 'Verified & Vetted',
                desc: 'Every agent is background-checked and rated by real clients. No surprises.'
              },
              {
                icon: '📱',
                title: 'Everything in One Place',
                desc: 'Messages, documents, scheduling - all in your dashboard. Real estate made organized.'
              },
              {
                icon: '🤝',
                title: 'You\'re Always in Control',
                desc: 'Change services, switch agents, or handle things yourself. Your journey, your rules.'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                padding: '1.75rem',
                borderRadius: '0.875rem',
                backgroundColor: 'white',
                border: '1px solid #f1f5f9',
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
      
      {/* CTA Section */}
      <section style={{ 
        padding: '8rem 1rem',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
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
        
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            Ready to Take Control of<br />Your Real Estate Journey?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Join thousands who've ditched the old way and saved big. 
            Better agents, better rates, and you call the shots.
          </p>
          
          {!currentUser ? (
            <Link to="/signup">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#1e3a8a',
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                borderRadius: '0.625rem',
                fontWeight: '700',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
              }}>
                Let's Get Started
              </Button>
            </Link>
          ) : (
            <Link to={`/${userProfile?.userType}`}>
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
          )}
        </div>
      </section>
      
      {/* Footer - Updated FAQ links */}
      <footer style={{ 
        padding: '4rem 1rem 2rem',
        backgroundColor: '#0f172a',
        color: '#94a3b8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                color: 'white'
              }}>
                no3%
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                Putting you in control of your real estate journey. 
                Better agents, transparent pricing, your rules.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'white', fontSize: '1rem' }}>
                For Buyers
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Learn More', 'Sign Up', 'How It Works', 'FAQ'].map((item) => (
                  <li key={item} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      to={item === 'Learn More' ? '/buyers' : 
                         item === 'Sign Up' ? '/signup?type=buyer' : 
                         item === 'FAQ' ? '/faq' : '#'} 
                      style={{ 
                        color: '#94a3b8', 
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '0.9375rem'
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'white', fontSize: '1rem' }}>
                For Sellers
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Learn More', 'Sign Up', 'How It Works', 'FAQ'].map((item) => (
                  <li key={item} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      to={item === 'Learn More' ? '/sellers' : 
                         item === 'Sign Up' ? '/signup?type=seller' : 
                         item === 'FAQ' ? '/faq' : '#'} 
                      style={{ 
                        color: '#94a3b8', 
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '0.9375rem'
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'white', fontSize: '1rem' }}>
                For Agents
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Learn More', 'Sign Up', 'Dashboard', 'Resources'].map((item) => (
                  <li key={item} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      to={item === 'Learn More' ? '/agents' : 
                         item === 'Sign Up' ? '/signup?type=agent' : '#'} 
                      style={{ 
                        color: '#94a3b8', 
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '0.9375rem'
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1.5rem', color: 'white', fontSize: '1rem' }}>
                Services
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['All Services', 'Buyer Services', 'Seller Services', 'Service Packages'].map((item) => (
                  <li key={item} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      to={item === 'All Services' ? '/services' : 
                         item === 'Buyer Services' ? '/services/buyers' : 
                         item === 'Seller Services' ? '/services/sellers' : '#'} 
                      style={{ 
                        color: '#94a3b8', 
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        fontSize: '0.9375rem'
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div style={{ 
            borderTop: '1px solid #1e293b',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              © 2025 no3%. All rights reserved.
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontSize: '0.875rem'
              }}>
                Terms
              </a>
              <a href="#" style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontSize: '0.875rem'
              }}>
                Privacy
              </a>
              <a href="#" style={{ 
                color: '#64748b', 
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontSize: '0.875rem'
              }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;