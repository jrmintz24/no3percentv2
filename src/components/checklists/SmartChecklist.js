// src/components/checklists/SmartChecklist.js
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Card, CardBody } from '../common/Card';

const SmartChecklist = ({ stage, transactionType, userRole, transactionId }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [completedItems, setCompletedItems] = useState({});

  const checklistData = {
    'home-inspection': {
      buyer: [
        {
          id: 'schedule-inspection',
          title: 'Schedule Home Inspection',
          priority: 'high',
          deadline: '5 days from offer acceptance',
          description: 'Hire a qualified home inspector to examine the property',
          whyImportant: 'A thorough inspection can reveal hidden issues that could cost thousands in repairs.',
          tips: [
            'Get recommendations from your agent or friends',
            'Check online reviews and credentials',
            'Expect to pay $300-500 for the inspection',
            'Allow 2-4 hours for the inspection process'
          ],
          resources: [
            { title: 'How to Choose a Home Inspector', type: 'article' },
            { title: 'What to Expect During Inspection', type: 'video' }
          ],
          warningSignals: [
            'Inspector who discourages your attendance',
            'Unusually low prices (under $200)',
            'No written report provided',
            'Inspector who works for the seller'
          ]
        },
        {
          id: 'attend-inspection',
          title: 'Attend Home Inspection',
          priority: 'high',
          description: 'Be present during the inspection to ask questions and learn about the home',
          whyImportant: 'This is your opportunity to learn about the home\'s systems and potential issues firsthand.',
          tips: [
            'Bring a notebook and camera',
            'Ask questions - no question is too basic',
            'Focus on major systems (HVAC, plumbing, electrical)',
            'Don\'t panic over minor issues'
          ],
          whatToLookFor: [
            'Foundation cracks or settling',
            'Water stains or signs of moisture',
            'Age and condition of HVAC system',
            'Electrical panel capacity and safety',
            'Roof condition and age',
            'Plumbing leaks or outdated pipes'
          ]
        },
        {
          id: 'review-report',
          title: 'Review Inspection Report',
          priority: 'high',
          deadline: '24-48 hours after inspection',
          description: 'Carefully review the inspection report and decide on next steps',
          whyImportant: 'This report will guide your repair requests and could impact your decision to proceed.',
          tips: [
            'Read the entire report carefully',
            'Categorize issues by severity',
            'Research typical repair costs',
            'Consult with your agent on negotiation strategy'
          ],
          decisionFramework: {
            'Major Issues': {
              description: 'Structural, roof, HVAC, foundation problems',
              action: 'Request repairs, credits, or consider walking away'
            },
            'Safety Issues': {
              description: 'Electrical problems, mold, radon, lead paint',
              action: 'Must be addressed before closing'
            },
            'Minor Issues': {
              description: 'Cosmetic items, minor repairs',
              action: 'Typically buyer responsibility after closing'
            },
            'Maintenance Items': {
              description: 'Normal wear and tear',
              action: 'Budget for future maintenance'
            }
          }
        },
        {
          id: 'submit-repair-request',
          title: 'Submit Repair Request',
          priority: 'high',
          deadline: 'Per contract inspection period',
          description: 'Formally request repairs or credits based on inspection findings',
          whyImportant: 'This is your opportunity to negotiate repairs before finalizing the purchase.',
          tips: [
            'Focus on major and safety issues',
            'Be reasonable with requests',
            'Consider asking for credits instead of repairs',
            'Have your agent submit in writing'
          ],
          template: `Re: Property at [ADDRESS]

Following the home inspection conducted on [DATE], we respectfully request the following:

SAFETY ISSUES:
1. [Issue]: [Requested remedy]

MAJOR SYSTEMS:
1. [Issue]: [Requested remedy]

We request response by [DATE].

Sincerely,
[Buyer Name]`
        }
      ]
    },
    'closing-preparation': {
      buyer: [
        {
          id: 'final-walkthrough',
          title: 'Schedule Final Walk-Through',
          priority: 'high',
          deadline: '24-48 hours before closing',
          description: 'Final inspection to ensure property condition hasn\'t changed',
          whyImportant: 'This is your last chance to verify the property\'s condition before taking ownership.',
          checklist: [
            'All agreed repairs completed',
            'No new damage to property',
            'All fixtures and appliances present',
            'Utilities functioning properly',
            'Property is clean and vacant (if agreed)'
          ],
          whatToDo: [
            'Test all light switches and outlets',
            'Run water in all faucets',
            'Check heating/cooling system',
            'Test all appliances',
            'Check for any new damage',
            'Verify agreed items are present'
          ]
        },
        {
          id: 'review-closing-disclosure',
          title: 'Review Closing Disclosure',
          priority: 'high',
          deadline: '3 days before closing',
          description: 'Review final loan terms and closing costs',
          whyImportant: 'Ensures no surprises at closing and gives you time to address any issues.',
          whatToCheck: [
            'Loan amount matches expectations',
            'Interest rate is correct',
            'Monthly payment calculation',
            'Closing costs match Loan Estimate',
            'Cash to close amount',
            'Seller credits properly applied'
          ],
          redFlags: [
            'Significant changes from Loan Estimate',
            'Unexpected fees',
            'Different loan terms',
            'Missing seller credits'
          ]
        }
      ]
    }
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleItemCompletion = async (itemId) => {
    const newCompletedState = !completedItems[itemId];
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: newCompletedState
    }));

    // You would save this to Firebase
    // await updateChecklistItem(transactionId, itemId, newCompletedState);
  };

  const items = checklistData[stage]?.[userRole] || [];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        {stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Checklist
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <Card key={item.id}>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <input
                  type="checkbox"
                  checked={completedItems[item.id] || false}
                  onChange={() => toggleItemCompletion(item.id)}
                  style={{ 
                    marginTop: '0.25rem',
                    width: '1.25rem',
                    height: '1.25rem'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleItemExpansion(item.id)}
                  >
                    <div>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600',
                        color: completedItems[item.id] ? '#6b7280' : '#111827'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280',
                        marginTop: '0.25rem'
                      }}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {item.priority === 'high' && (
                        <span style={{
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          High Priority
                        </span>
                      )}
                      {item.deadline && (
                        <span style={{
                          color: '#6b7280',
                          fontSize: '0.875rem'
                        }}>
                          Due: {item.deadline}
                        </span>
                      )}
                      <span>
                        {expandedItems[item.id] ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>
                  
                  {expandedItems[item.id] && (
                    <div style={{ marginTop: '1rem' }}>
                      {item.whyImportant && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            Why This Matters
                          </h4>
                          <p style={{ 
                            backgroundColor: '#f0fdf4',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            color: '#166534',
                            fontSize: '0.875rem'
                          }}>
                            {item.whyImportant}
                          </p>
                        </div>
                      )}
                      
                      {item.tips && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            Tips & Best Practices
                          </h4>
                          <ul style={{ 
                            listStyle: 'disc', 
                            paddingLeft: '1.5rem',
                            fontSize: '0.875rem',
                            color: '#374151'
                          }}>
                            {item.tips.map((tip, index) => (
                              <li key={index} style={{ marginBottom: '0.25rem' }}>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.warningSignals && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#dc2626' }}>
                            ⚠️ Warning Signs
                          </h4>
                          <ul style={{ 
                            listStyle: 'disc', 
                            paddingLeft: '1.5rem',
                            fontSize: '0.875rem',
                            color: '#dc2626'
                          }}>
                            {item.warningSignals.map((warning, index) => (
                              <li key={index} style={{ marginBottom: '0.25rem' }}>
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.decisionFramework && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            Decision Framework
                          </h4>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem'
                          }}>
                            {Object.entries(item.decisionFramework).map(([category, info]) => (
                              <div key={category} style={{
                                padding: '1rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb'
                              }}>
                                <h5 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                                  {category}
                                </h5>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                  {info.description}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                                  Action: {info.action}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.resources && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            Helpful Resources
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {item.resources.map((resource, index) => (
                              <button key={index} style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                borderRadius: '0.5rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                {resource.type === 'video' ? '🎥' : '📄'} {resource.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {item.template && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                            Template
                          </h4>
                          <pre style={{
                            backgroundColor: '#f3f4f6',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace'
                          }}>
                            {item.template}
                          </pre>
                          <button style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                          }}>
                            Copy Template
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartChecklist;