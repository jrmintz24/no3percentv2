import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: '🏡',
      questions: [
        {
          q: 'What is no3%?',
          a: 'no3% is a revolutionary real estate platform that connects buyers and sellers with agents through a transparent, competitive process. Unlike traditional real estate where agents charge standard 3% commissions, our platform lets agents compete for your business with custom service packages and competitive rates, often resulting in significant savings.'
        },
        {
          q: 'How does the platform work?',
          a: 'Buyers and sellers create detailed listings describing their needs and choose from our service packages (Showing Only, Essential, Full Service, or Premium). Agents then submit proposals with their rates and services. Clients can compare proposals side-by-side and choose the best fit for their needs.'
        },
        {
          q: 'Is no3% free to use?',
          a: 'Yes! It\'s completely free for buyers and sellers. Agents use a token system to submit proposals, but there\'s no cost to clients using our platform.'
        },
        {
          q: 'How quickly will I receive agent proposals?',
          a: 'Most clients receive their first proposals within 24 hours. For detailed listings in popular areas, you might start receiving proposals within just a few hours. Our token system ensures you receive serious, quality proposals from motivated agents.'
        },
        {
          q: 'What makes no3% different from other real estate platforms?',
          a: 'We offer a package-first approach where you choose your service level upfront, then add specific services as needed. This transparency, combined with our competitive bidding process, often results in savings of 30-50% compared to traditional real estate commissions.'
        }
      ]
    },
    buyers: {
      title: 'For Home Buyers',
      icon: '🏠',
      questions: [
        {
          q: 'What service packages are available for buyers?',
          a: 'We offer four packages: Showing Only (just property tours), Essential (basic services for experienced buyers), Full Service (traditional agent services), and Premium (luxury service with all features). Each package can be customized with add-on services.'
        },
        {
          q: 'What is the "Showing Only" package?',
          a: 'Perfect for self-sufficient buyers who just need someone to show properties. Agents typically charge per showing or offer packages of showings. This is ideal if you\'re comfortable handling negotiations and paperwork yourself.'
        },
        {
          q: 'Can I get a rebate when buying a home?',
          a: 'Yes! When sellers pay the buyer\'s agent commission (which is common), many agents offer to rebate a portion back to you. This can be thousands of dollars that you can use for closing costs, down payment, or home improvements.'
        },
        {
          q: 'How do I choose between agent proposals?',
          a: 'Compare factors like commission rates, rebate offers, services included, agent experience in your target area, and reviews. Our platform makes it easy to compare these factors side-by-side. You can also message agents directly to ask questions before accepting a proposal.'
        },
        {
          q: 'Can I negotiate with agents after receiving proposals?',
          a: 'Absolutely! Use our messaging system to discuss terms, ask questions, or negotiate rates before accepting. Many agents are willing to adjust their proposals to win your business.'
        },
        {
          q: 'Is my information kept private?',
          a: 'Yes. Your contact information is only shared with agents after you accept their proposal. During the proposal stage, agents only see the details you\'ve included in your listing.'
        }
      ]
    },
    sellers: {
      title: 'For Home Sellers',
      icon: '💰',
      questions: [
        {
          q: 'What service packages are available for sellers?',
          a: 'We offer three main packages: Essential (1-1.5% commission for basic services), Full Service (2.5-3% for traditional agent services), and Premium (3-4% for luxury marketing and concierge service). All packages can be customized with add-ons.'
        },
        {
          q: 'How much can I save on commission?',
          a: 'Most sellers save 30-50% compared to traditional 6% commissions. By choosing only the services you need and having agents compete, you could save thousands on your home sale.'
        },
        {
          q: 'Can I list as "For Sale By Owner" and just get specific help?',
          a: 'Yes! Choose our Essential package or select specific services à la carte. Many agents offer individual services like professional photography, contract review, or negotiation assistance without requiring full representation.'
        },
        {
          q: 'What if I\'m not satisfied with the proposals?',
          a: 'You\'re never obligated to accept any proposal. You can update your listing, adjust your service requirements, or wait for more agents to submit proposals. You maintain complete control throughout the process.'
        },
        {
          q: 'How does the verification badge work?',
          a: 'Verified sellers get a badge on their listing and often receive more competitive proposals. Verification requires identity confirmation and proof of property ownership, which gives agents more confidence in your listing.'
        },
        {
          q: 'Can I change my service package after accepting a proposal?',
          a: 'Yes, you can discuss modifications with your agent. Many agents are flexible and can adjust services and pricing based on your changing needs during the sale process.'
        }
      ]
    },
    agents: {
      title: 'For Real Estate Agents',
      icon: '🏆',
      questions: [
        {
          q: 'How do I join no3% as an agent?',
          a: 'Sign up through our agent portal, provide your license information, and complete our verification process. Once approved, you can start submitting proposals immediately. We offer different subscription tiers with varying benefits.'
        },
        {
          q: 'How does the token system work?',
          a: 'Tokens are used to submit proposals. Costs vary based on listing type, verification status, and market demand. Buyer listings typically cost 1-2 tokens, while seller listings cost 2-4 tokens. Verified listings cost more but often result in higher-quality leads.'
        },
        {
          q: 'What are the subscription tiers?',
          a: 'We offer three tiers: Starter (pay-as-you-go), Professional ($49/month with 10 tokens), and Enterprise ($199/month with 50 tokens). Higher tiers include benefits like featured agent badges and token discounts.'
        },
        {
          q: 'How can I make my proposals stand out?',
          a: 'Focus on the client\'s specific needs, offer competitive rates, and use our priority boost feature to appear at the top of their proposal list. Include detailed service descriptions and highlight your local expertise.'
        },
        {
          q: 'Can I specialize in certain service packages?',
          a: 'Yes! Some agents focus on "Showing Only" services for buyers or Essential packages for sellers. Specializing can help you stand out and operate more efficiently.'
        },
        {
          q: 'How does proposal priority work?',
          a: 'You can add extra tokens to boost your proposal\'s visibility. Proposals with more tokens appear higher in the client\'s list. The current highest priority for each listing is shown when you submit.'
        }
      ]
    },
    platform: {
      title: 'Platform Features',
      icon: '⚙️',
      questions: [
        {
          q: 'What are service packages?',
          a: 'Service packages are pre-defined bundles of real estate services at different price points. Clients choose a package first, then can add individual services as needed. This makes pricing transparent and comparison easy.'
        },
        {
          q: 'How do add-on services work?',
          a: 'After selecting a base package, clients can add specific services like professional photography, staging consultation, or attorney review. Agents price these services individually in their proposals.'
        },
        {
          q: 'What is the verification system?',
          a: 'Both agents and clients can get verified. Verified agents have confirmed licenses and background checks. Verified clients have confirmed identity and property ownership. Verified users often get better results on the platform.'
        },
        {
          q: 'How does messaging work?',
          a: 'Our secure messaging system allows communication between clients and agents after a proposal is submitted. Once a proposal is accepted, you can exchange contact information and continue conversations off-platform if desired.'
        },
        {
          q: 'What happens after accepting a proposal?',
          a: 'The agent and client are connected directly. You\'ll move forward with your real estate transaction just like a traditional agent-client relationship, but with the terms you\'ve already agreed upon.'
        },
        {
          q: 'Is the platform available nationwide?',
          a: 'Yes! We have agents throughout the United States. Some areas have more coverage than others, but our network is growing daily.'
        }
      ]
    },
    pricing: {
      title: 'Pricing & Payments',
      icon: '💳',
      questions: [
        {
          q: 'How much do agents charge on no3%?',
          a: 'Commission rates vary by package: Showing Only (flat fee or per showing), Essential (1-1.5%), Full Service (2-2.5% for buyers, 2.5-3% for sellers), Premium (2.5-3% for buyers, 3-4% for sellers). Many agents offer rates below these ranges to win business.'
        },
        {
          q: 'When do I pay the agent?',
          a: 'Just like traditional real estate, commissions are paid at closing. There are no upfront fees for buyers or sellers. Agents only get paid when your transaction successfully closes.'
        },
        {
          q: 'How do buyer rebates work?',
          a: 'In states where legal, agents can rebate part of their commission to buyers. For example, if the seller pays a 3% buyer agent commission and your agent charges 2%, you might receive a 1% rebate at closing.'
        },
        {
          q: 'What do tokens cost for agents?',
          a: 'Token packages start at $20 for 5 tokens, with better rates for larger packages. Subscription tiers include monthly token allowances and offer the best value for active agents.'
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No hidden fees for buyers or sellers. Agents pay for tokens to submit proposals, but all client services are free. The only costs are the agreed-upon commissions or fees in accepted proposals.'
        },
        {
          q: 'Can I cancel after accepting a proposal?',
          a: 'Yes, but terms depend on your agreement with the agent. Most agents understand that circumstances change. Discuss cancellation policies before accepting a proposal.'
        }
      ]
    }
  };

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem',
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
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
            Frequently Asked Questions
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Everything you need to know about saving on real estate commissions. Can't find your answer? We're here to help.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section style={{ 
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: '0',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ 
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: '-ms-autohiding-scrollbar',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}>
            {Object.entries(faqCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: activeCategory === key ? '#3b82f6' : 'white',
                  color: activeCategory === key ? 'white' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: activeCategory === key ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ 
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '0.5rem'
          }}>
            {faqCategories[activeCategory].title}
          </h2>
          <p style={{ 
            color: '#64748b',
            fontSize: '1.125rem'
          }}>
            Click any question to expand the answer
          </p>
        </div>

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {faqCategories[activeCategory].questions.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: openQuestion === index ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              <button
                onClick={() => toggleQuestion(index)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#0f172a',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  gap: '1rem'
                }}
              >
                <span>{item.q}</span>
                <span style={{
                  fontSize: '1.5rem',
                  color: '#3b82f6',
                  transform: openQuestion === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  lineHeight: '1'
                }}>
                  ⌄
                </span>
              </button>
              
              {openQuestion === index && (
                <div style={{
                  padding: '0 1.5rem 1.5rem',
                  color: '#475569',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <p style={{ marginTop: '1rem' }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section style={{ 
        backgroundColor: '#f8fafc',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Still have questions?
          </h2>
          <p style={{ 
            color: '#475569',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}>
            Our support team is here to help you get started saving on real estate commissions.
          </p>
          <div style={{ 
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="mailto:support@no3percent.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>📧</span>
              Email Support
            </a>
            <Link 
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                backgroundColor: 'white',
                color: '#3b82f6',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>💬</span>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 1rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
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
          background: 'radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Ready to Save on Your Next Real Estate Transaction?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Join thousands of homeowners who've saved thousands on commissions.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup?type=buyer">
              <Button size="large" style={{ 
                backgroundColor: 'white',
                color: '#1e3a8a',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🏠</span>
                I'm Buying
              </Button>
            </Link>
            
            <Link to="/signup?type=seller">
              <Button size="large" style={{ 
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>💰</span>
                I'm Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;