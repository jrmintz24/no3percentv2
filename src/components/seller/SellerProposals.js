// src/components/seller/SellerProposals.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Button } from '../common/Button';

const SellerProposals = () => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        
        // First, get all listings owned by the seller
        const listingsQuery = query(
          collection(db, 'sellerListings'),
          where('userId', '==', currentUser.uid)
        );
        const listingsSnapshot = await getDocs(listingsQuery);
        
        const listingIds = listingsSnapshot.docs.map(doc => doc.id);
        
        if (listingIds.length === 0) {
          setProposals([]);
          setLoading(false);
          return;
        }

        // Then, get all proposals for those listings
        const proposalsQuery = query(
          collection(db, 'proposals'),
          where('listingId', 'in', listingIds),
          where('listingType', '==', 'seller')
        );
        
        const proposalsSnapshot = await getDocs(proposalsQuery);
        
        // Fetch additional data for each proposal
        const proposalsWithDetails = await Promise.all(
          proposalsSnapshot.docs.map(async (proposalDoc) => {
            const proposalData = proposalDoc.data();
            
            // Get agent details
            const agentDoc = await getDoc(doc(db, 'users', proposalData.agentId));
            const agentData = agentDoc.exists() ? agentDoc.data() : null;
            
            // Get listing details
            const listingDoc = await getDoc(doc(db, 'sellerListings', proposalData.listingId));
            const listingData = listingDoc.exists() ? listingDoc.data() : null;
            
            return {
              id: proposalDoc.id,
              ...proposalData,
              agentName: agentData?.displayName || 'Unknown Agent',
              agentEmail: agentData?.email || '',
              listingTitle: listingData?.propertyAddress || listingData?.address || 'Property Listing',
              listingType: 'Seller',
              listingData: listingData
            };
          })
        );

        setProposals(proposalsWithDetails);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setError('Failed to load proposals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return '#10B981'; // Green
      case 'rejected':
        return '#EF4444'; // Red
      case 'active':
      case 'pending':
      default:
        return '#F59E0B'; // Yellow
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'active':
        return 'Active';
      default:
        return 'Pending';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        fontSize: isMobile ? '0.875rem' : '1rem'
      }}>
        <p>Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: isMobile ? '1rem' : '2rem' 
      }}>
        <Card>
          <CardBody>
            <p style={{ 
              color: '#EF4444', 
              textAlign: 'center',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              {error}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem 1rem' 
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: isMobile ? '1.25rem' : '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem' 
        }}>
          Property Listing Proposals
        </h1>
        <p style={{ 
          color: '#6B7280',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          View and manage proposals from agents for your property listings.
        </p>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
            <p style={{ 
              textAlign: 'center', 
              color: '#6B7280',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              No proposals yet. Agents will appear here when they submit proposals for your listings.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: isMobile ? '1.125rem' : '1.25rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.25rem' 
                    }}>
                      {proposal.listingTitle}
                    </h3>
                    <p style={{ 
                      color: '#6B7280',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      wordBreak: 'break-word'
                    }}>
                      From: {proposal.agentName} ({proposal.agentEmail})
                    </p>
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.75rem',
                    backgroundColor: getStatusColor(proposal.status) + '20',
                    color: getStatusColor(proposal.status),
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    alignSelf: isMobile ? 'flex-start' : 'center'
                  }}>
                    {getStatusText(proposal.status)}
                  </div>
                </div>
              </CardHeader>
              <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <h4 style={{ 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      Commission Structure
                    </h4>
                    <p style={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                      {proposal.feeStructure === 'percentage' ? 
                        `${proposal.commissionRate}% Commission` : 
                        `$${proposal.flatFee?.toLocaleString() || '0'} Flat Fee`}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      Proposed Services
                    </h4>
                    <ul style={{ 
                      listStyle: 'disc', 
                      marginLeft: '1.5rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      {proposal.services?.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}>
                      Cover Letter
                    </h4>
                    <p style={{ 
                      whiteSpace: 'pre-wrap',
                      fontSize: isMobile ? '0.875rem' : '1rem',
                      lineHeight: '1.5'
                    }}>
                      {proposal.coverLetter}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'stretch' : 'flex-end',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <Link 
                      to={`/seller/proposals/${proposal.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      View Details
                    </Link>
                    {proposal.status === 'accepted' && (
                      <Link
                        to={`/seller/messages/${proposal.messagingChannelId || ''}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#10B981',
                          color: 'white',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          textAlign: 'center',
                          width: isMobile ? '100%' : 'auto'
                        }}
                      >
                        Message Agent
                      </Link>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProposals;