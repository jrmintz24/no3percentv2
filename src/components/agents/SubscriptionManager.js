// src/components/agents/SubscriptionManager.js

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionTiers, tokenPackages, getTokenPackagePrice } from '../../config/subscriptions';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const SubscriptionManager = () => {
  const { userProfile, getUserSubscriptionTier } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('monthly'); // 'monthly' or 'annual'
  
  const currentTier = getUserSubscriptionTier(userProfile);
  
  const handleUpgrade = async (tierId) => {
    try {
      setLoading(true);
      setError('');
      
      await updateDoc(doc(db, 'users', userProfile.id), {
        subscription: {
          tier: tierId,
          startDate: serverTimestamp(),
          nextBillingDate: serverTimestamp(),
          status: 'active'
        },
        tokens: (userProfile.tokens || 0) + subscriptionTiers[tierId].monthlyTokens
      });
      
      setSuccess(`Successfully upgraded to ${subscriptionTiers[tierId].name}!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError('Failed to upgrade subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate annual pricing (10% discount)
  const getAnnualPrice = (monthlyPrice) => {
    return Math.round(monthlyPrice * 12 * 0.9);
  };

  const tierOrder = ['starter', 'professional', 'premium', 'enterprise'];
  const orderedTiers = tierOrder.map(id => subscriptionTiers[id]).filter(Boolean);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      paddingTop: '2rem',
      paddingBottom: '4rem'
    }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '4rem',
        padding: '0 1rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '1rem',
          color: '#111827',
          letterSpacing: '-0.025em'
        }}>
          Pricing Plans
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280',
          maxWidth: '42rem',
          margin: '0 auto 2rem',
          lineHeight: '1.75'
        }}>
          Choose the perfect plan for your business. Upgrade anytime as you grow.
        </p>

        {/* Billing Toggle */}
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          padding: '0.25rem',
          borderRadius: '0.75rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setSelectedInterval('monthly')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: selectedInterval === 'monthly' ? 'white' : 'transparent',
              color: selectedInterval === 'monthly' ? '#111827' : '#6b7280',
              boxShadow: selectedInterval === 'monthly' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedInterval('annual')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: selectedInterval === 'annual' ? 'white' : 'transparent',
              color: selectedInterval === 'annual' ? '#111827' : '#6b7280',
              boxShadow: selectedInterval === 'annual' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Annual
            <span style={{ 
              marginLeft: '0.5rem',
              color: '#059669',
              fontWeight: '600'
            }}>
              Save 10%
            </span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div style={{ 
          maxWidth: '64rem',
          margin: '0 auto 2rem',
          padding: '1rem',
          backgroundColor: '#fef2f2', 
          color: '#991b1b', 
          borderRadius: '0.75rem', 
          textAlign: 'center',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          maxWidth: '64rem',
          margin: '0 auto 2rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4', 
          color: '#166534', 
          borderRadius: '0.75rem', 
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          {success}
        </div>
      )}

      {/* Pricing Cards */}
      <div style={{ 
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem'
      }}>
        {orderedTiers.map((tier) => {
          const isCurrentPlan = currentTier.id === tier.id;
          const isPopular = tier.id === 'professional';
          const monthlyPrice = tier.price;
          const annualPrice = getAnnualPrice(monthlyPrice);
          const displayPrice = selectedInterval === 'annual' ? annualPrice : monthlyPrice;
          
          return (
            <div
              key={tier.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: isPopular ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: isPopular ? '2px solid #2563eb' : '1px solid #e5e7eb',
                overflow: 'hidden',
                position: 'relative',
                transform: isPopular ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  borderBottomLeftRadius: '0.5rem'
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ padding: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  {tier.name}
                </h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <span style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: '800',
                    color: '#111827'
                  }}>
                    ${displayPrice}
                  </span>
                  <span style={{ 
                    color: '#6b7280',
                    marginLeft: '0.5rem'
                  }}>
                    /{selectedInterval === 'annual' ? 'year' : 'month'}
                  </span>
                  {selectedInterval === 'annual' && tier.price > 0 && (
                    <div style={{ 
                      color: '#6b7280',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem'
                    }}>
                      ${Math.round(annualPrice / 12)}/month, billed annually
                    </div>
                  )}
                </div>

                {tier.monthlyTokens > 0 && (
                  <div style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                      {tier.monthlyTokens} tokens
                    </span>
                    <span style={{ color: '#6b7280', marginLeft: '0.25rem' }}>
                      included monthly
                    </span>
                  </div>
                )}

                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  marginBottom: '2rem',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1.5rem'
                }}>
                  {tier.features.map((feature, index) => (
                    <li key={index} style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem',
                      color: '#4b5563',
                      fontSize: '0.875rem'
                    }}>
                      <svg 
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          marginRight: '0.75rem',
                          color: '#059669',
                          flexShrink: 0
                        }} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      fontWeight: '600',
                      cursor: 'default'
                    }}
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: isPopular ? '#2563eb' : '#3b82f6',
                      color: 'white',
                      fontWeight: '600',
                      cursor: loading ? 'wait' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {loading ? 'Processing...' : `Upgrade to ${tier.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div style={{ 
        maxWidth: '80rem',
        margin: '6rem auto 0',
        padding: '0 1rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Compare Plans
        </h2>

        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ 
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  Features
                </th>
                {orderedTiers.map(tier => (
                  <th key={tier.id} style={{ 
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  Monthly Tokens
                </td>
                {orderedTiers.map(tier => (
                  <td key={tier.id} style={{ 
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {tier.monthlyTokens}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  Token Discount
                </td>
                {orderedTiers.map(tier => (
                  <td key={tier.id} style={{ 
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {tier.tokenDiscount * 100}%
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  Saved Searches
                </td>
                {orderedTiers.map(tier => (
                  <td key={tier.id} style={{ 
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {tier.limits.savedSearches === -1 ? 'Unlimited' : tier.limits.savedSearches}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  Proposal Templates
                </td>
                {orderedTiers.map(tier => (
                  <td key={tier.id} style={{ 
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    {tier.limits.proposalTemplates === -1 ? 'Unlimited' : tier.limits.proposalTemplates}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '1rem 1.5rem' }}>
                  Analytics Retention
                </td>
                {orderedTiers.map(tier => (
                  <td key={tier.id} style={{ 
                    padding: '1rem 1.5rem',
                    textAlign: 'center'
                  }}>
                    {tier.limits.analyticsRetention === -1 ? 'Forever' : `${tier.limits.analyticsRetention} days`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ 
        maxWidth: '48rem',
        margin: '6rem auto 0',
        padding: '0 1rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            {
              question: "Can I change plans at any time?",
              answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be credited for any unused time."
            },
            {
              question: "What happens to my unused tokens?",
              answer: "Monthly tokens don't roll over, but purchased tokens never expire. Your monthly allocation refreshes at the beginning of each billing cycle."
            },
            {
              question: "How does the token discount work?",
              answer: "Higher tier plans get discounts on additional token purchases. This means you pay less per token when you need more than your monthly allocation."
            },
            {
              question: "Is there a contract or commitment?",
              answer: "No contracts! All plans are month-to-month (or annual if you choose). You can cancel or change plans at any time."
            }
          ].map((faq, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#111827'
              }}>
                {faq.question}
              </h3>
              <p style={{ 
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;