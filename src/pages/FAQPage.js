import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: '📚',
      questions: [
        {
          q: 'What is RealEstateMatch?',
          a: 'RealEstateMatch is a platform that connects home buyers and sellers with real estate agents through a transparent, competitive bidding process. Agents compete for your business by submitting detailed proposals, allowing you to compare services, commission rates, and rebate offers.'
        },
        {
          q: 'How is RealEstateMatch different from traditional real estate services?',
          a: 'Unlike traditional services where you get assigned an agent or have to interview multiple agents yourself, our platform lets agents come to you with their best offers. You can compare everything transparently—commission rates, services offered, rebates, and agent experience—all in one place.'
        },
        {
          q: 'Is RealEstateMatch free to use?',
          a: 'Yes! It\'s completely free for buyers and sellers to create listings and receive proposals from agents. Agents pay for tokens to submit proposals, but there\'s no cost to you as a buyer or seller.'
        },
        {
          q: 'How quickly can I expect to receive agent proposals?',
          a: 'Most users receive their first proposals within 24 hours of posting their listing. For popular areas or well-detailed listings, you might start receiving proposals within just a few hours.'
        },
        {
          q: 'What areas does RealEstateMatch serve?',
          a: 'We currently serve major metropolitan areas across the United States. Our network of agents is constantly growing, so even if your area isn\'t heavily covered yet, we likely have agents who can help.'
        }
      ]
    },
    buyers: {
      title: 'For Home Buyers',
      icon: '🏠',
      questions: [
        {
          q: 'What are buyer rebates and how do they work?',
          a: 'When sellers pay the buyer\'s agent commission (which is common), many agents on our platform offer to rebate a portion of that commission back to you. This can be thousands of dollars returned to you at closing, which you can use for your down payment, closing costs, or home improvements.'
        },
        {
          q: 'How do I create a buyer listing?',
          a: 'Simply click "Start Your Home Search" and fill out details about what you\'re looking for: location, budget, property type, must-have features, and timeline. The more detailed you are, the better proposals you\'ll receive from agents.'
        },
        {
          q: 'Can I negotiate with agents after receiving proposals?',
          a: 'Absolutely! Once you receive proposals, you can message agents directly through our platform to discuss their offers, ask questions, or negotiate terms before making your decision.'
        },
        {
          q: 'What if I already have a pre-approval letter?',
          a: 'Great! You can mention this in your listing, which makes you a more attractive client to agents. Many agents will offer better terms or higher rebates to pre-approved buyers.'
        },
        {
          q: 'How do I choose the right agent from multiple proposals?',
          a: 'Consider factors like: commission/rebate offered, services included, agent experience in your target area, communication style, availability, and reviews from past clients. Our platform makes it easy to compare all these factors side by side.'
        },
        {
          q: 'Is my information kept private?',
          a: 'Yes, your personal contact information is only shared with agents after you accept their proposal. During the proposal stage, agents can only see the details you\'ve chosen to share in your listing.'
        }
      ]
    },
    sellers: {
      title: 'For Home Sellers',
      icon: '💰',
      questions: [
        {
          q: 'How can I save money on commissions?',
          a: 'By having agents compete for your listing, you\'ll often receive proposals with lower commission rates than the traditional 6%. Many agents offer reduced rates or à la carte services that let you pay only for what you need.'
        },
        {
          q: 'What services can I choose from?',
          a: 'Agents offer various service levels: full-service (traditional), limited service (you do some tasks yourself for lower commission), or à la carte (pay only for specific services like listing photos, paperwork, or negotiation).'
        },
        {
          q: 'How do I create a seller listing?',
          a: 'Click "List Your Property" and provide details about your home, including location, asking price, property features, and what services you need. You can also upload photos to give agents a better idea of your property.'
        },
        {
          q: 'Can I list my home as "For Sale By Owner" and just get help with specific tasks?',
          a: 'Yes! Many agents on our platform offer à la carte services. You can handle most of the sale yourself and just hire an agent for specific tasks like paperwork, negotiations, or professional photography.'
        },
        {
          q: 'How long does it take to sell a home through RealEstateMatch?',
          a: 'The timeline is similar to traditional sales—it depends on your market, pricing, and property condition. However, our competitive process often results in more motivated agents who work harder to sell your home quickly.'
        },
        {
          q: 'What if I\'m not satisfied with the proposals I receive?',
          a: 'You\'re never obligated to accept any proposal. You can update your listing with more details, adjust your requirements, or wait for more agents to submit proposals. You\'re always in control.'
        }
      ]
    },
    agents: {
      title: 'For Real Estate Agents',
      icon: '🏆',
      questions: [
        {
          q: 'How do I join RealEstateMatch as an agent?',
          a: 'Click "Join Our Network" on the agents page to sign up. You\'ll need to provide your license information and go through our verification process. Once approved, you can start submitting proposals immediately.'
        },
        {
          q: 'How does the token system work?',
          a: 'Agents purchase tokens to submit proposals. Different types of listings require different numbers of tokens. This system ensures serious inquiries and helps maintain quality interactions on the platform.'
        },
        {
          q: 'How much do tokens cost?',
          a: 'Token packages start at $50 for 10 tokens. Bulk packages offer better value. The exact number of tokens needed per proposal varies based on the listing type and market conditions.'
        },
        {
          q: 'How do I stand out from other agents?',
          a: 'Provide detailed, personalized proposals that address the client\'s specific needs. Offer competitive rates, highlight your expertise in their area, include client testimonials, and respond quickly to messages.'
        },
        {
          q: 'Can I offer rebates to buyers?',
          a: 'Yes, in states where it\'s legal. Many successful agents on our platform offer buyer rebates as a competitive advantage. Check your state\'s regulations regarding rebates.'
        },
        {
          q: 'What happens after a client accepts my proposal?',
          a: 'You\'ll be connected directly with the client through our messaging system. From there, you can schedule meetings, share documents, and proceed with the traditional agent-client relationship.'
        },
        {
          q: 'Is there a minimum commission I must charge?',
          a: 'No, you set your own commission rates and service packages. However, we encourage sustainable business practices that allow you to provide quality service to your clients.'
        }
      ]
    },
    pricing: {
      title: 'Pricing & Payments',
      icon: '💳',
      questions: [
        {
          q: 'How do commission rates on RealEstateMatch compare to traditional rates?',
          a: 'Commission rates on our platform typically range from 1% to 5%, compared to the traditional 5-6%. Because agents compete for business, they often offer more competitive rates or added value services.'
        },
        {
          q: 'When do I pay the agent\'s commission?',
          a: 'Just like traditional real estate transactions, commissions are paid at closing from the proceeds of the sale. There are no upfront fees for buyers or sellers using our platform.'
        },
        {
          q: 'Are buyer rebates legal?',
          a: 'Buyer rebates are legal in most states, but regulations vary. Agents on our platform will only offer rebates where legally permitted. Always consult with your agent about rebate eligibility in your state.'
        },
        {
          q: 'How are disputes handled?',
          a: 'We provide a resolution center for any disputes between clients and agents. Most issues are resolved through direct communication, but our support team is available to mediate if necessary.'
        },
        {
          q: 'Can I cancel after accepting a proposal?',
          a: 'Yes, though we encourage you to carefully review proposals before accepting. Cancellation terms should be discussed with your agent and included in your agreement.'
        }
      ]
    },
    safety: {
      title: 'Safety & Security',
      icon: '🔒',
      questions: [
        {
          q: 'How are agents verified?',
          a: 'All agents must provide valid real estate license information, which we verify with state databases. We also conduct background checks and monitor agent performance and client feedback.'
        },
        {
          q: 'Is my personal information secure?',
          a: 'Yes, we use bank-level encryption to protect your data. Personal contact information is only shared with agents after you accept their proposal. Financial information is never stored on our platform.'
        },
        {
          q: 'What if I have a bad experience with an agent?',
          a: 'You can report issues through our platform, leave reviews, and contact our support team. We take all complaints seriously and may suspend agents who violate our terms of service.'
        },
        {
          q: 'How do reviews work?',
          a: 'After completing a transaction, both clients and agents can leave reviews. Reviews are monitored for authenticity and inappropriate content. Fake reviews result in account suspension.'
        },
        {
          q: 'Can I block or report inappropriate messages?',
          a: 'Yes, you can block any user and report inappropriate behavior directly through our messaging system. Our team reviews all reports promptly.'
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
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
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
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Everything you need to know about RealEstateMatch. Can't find what you're looking for? Contact our support team.
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
                  borderRadius: '2rem',
                  border: 'none',
                  backgroundColor: activeCategory === key ? '#3b82f6' : 'white',
                  color: activeCategory === key ? 'white' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: activeCategory === key ? '0 2px 8px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
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
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ 
          marginBottom: '2rem',
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
            Click on any question to see the answer
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
                transition: 'all 0.2s ease'
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
                  transition: 'transform 0.2s ease'
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div style={{ 
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="mailto:support@realestatematch.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.625rem',
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
                borderRadius: '0.625rem',
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
        
        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Join thousands of satisfied users who've found their perfect real estate match.
          </p>
          
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
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;