// src/components/agents/ProposalDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc as firestoreDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const Calendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MessageCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const MapPin = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Phone = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Mail = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const AlertCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ProposalDetail = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingChannel, setExistingChannel] = useState(null);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchProposalData = async () => {
      if (!currentUser || !proposalId) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        // Fetch proposal
        const proposalRef = firestoreDoc(db, 'proposals', proposalId);
        const proposalDoc = await getDoc(proposalRef);

        if (!proposalDoc.exists()) {
          setError('Proposal not found');
          setLoading(false);
          return;
        }

        const proposalData = { id: proposalDoc.id, ...proposalDoc.data() };
        
        // Verify the agent owns this proposal
        if (proposalData.agentId !== currentUser.uid) {
          setError('You are not authorized to view this proposal');
          setLoading(false);
          return;
        }

        setProposal(proposalData);

        // Check if there's an associated transaction
        if (proposalData.transactionId) {
          const transactionRef = firestoreDoc(db, 'transactions', proposalData.transactionId);
          const transactionDoc = await getDoc(transactionRef);
          
          if (transactionDoc.exists()) {
            setTransaction({ id: transactionDoc.id, ...transactionDoc.data() });
          }
        }

        // Fetch listing
        const listingRef = firestoreDoc(
          db, 
          proposalData.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', 
          proposalData.listingId
        );
        const listingDoc = await getDoc(listingRef);

        if (listingDoc.exists()) {
          const listingData = { id: listingDoc.id, ...listingDoc.data() };
          setListing(listingData);

          // Fetch client info
          const clientRef = firestoreDoc(db, 'users', listingData.userId);
          const clientDoc = await getDoc(clientRef);
          
          if (clientDoc.exists()) {
            setClient({ id: clientDoc.id, ...clientDoc.data() });
          }

          // Check for existing message channel
          if (listingData.messagingEnabled) {
            const channelsRef = collection(db, 'messageChannels');
            const q = query(
              channelsRef,
              where('proposalId', '==', proposalId),
              where('participants', 'array-contains', currentUser.uid)
            );
            const channelDocs = await getDocs(q);
            
            if (!channelDocs.empty) {
              const channel = channelDocs.docs[0];
              setExistingChannel({ id: channel.id, ...channel.data() });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching proposal data:', err);
        setError('Failed to load proposal data');
      } finally {
        setLoading(false);
      }
    };

    fetchProposalData();
  }, [currentUser, proposalId]);

  const handleMessageClient = () => {
    if (existingChannel) {
      navigate(`/agent/messages/${existingChannel.id}`);
    } else {
      // Navigate to messages with proposal ID to create new channel
      navigate(`/agent/messages/new?proposalId=${proposalId}`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
      case 'Accepted':
        return { backgroundColor: '#dcfce7', color: '#15803d' };
      case 'rejected':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      case 'active':
      case 'pending':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          maxWidth: '28rem' 
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!proposal || !listing) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          backgroundColor: '#fef9c3', 
          color: '#854d0e', 
          padding: '1.5rem', 
          borderRadius: '0.5rem', 
          maxWidth: '28rem' 
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Data Incomplete</h3>
          <p>Some required data is missing.</p>
        </div>
      </div>
    );
  }

  const isAccepted = proposal.status === 'accepted' || proposal.status === 'Accepted';
  const isRejected = proposal.status === 'rejected';

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
      <Link 
        to="/agent/proposals" 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: '#2563eb', 
          textDecoration: 'none',
          marginBottom: '1.5rem' 
        }}
      >
        ← Back to Proposals
      </Link>

      {/* Transaction Banner - Only show if there's an active transaction */}
      {isAccepted && transaction && (
        <div style={{
          backgroundColor: '#dcfce7',
          borderRadius: '0.5rem',
          border: '1px solid #86efac',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#166534' }}>
              Active Transaction
            </h2>
            <p style={{ color: '#059669', marginTop: '0.25rem' }}>
              This proposal has been accepted and is part of an active transaction
            </p>
          </div>
          <Button
            to={`/transaction/${transaction.id}`}
            style={{ 
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: '600'
            }}
          >
            View Transaction Dashboard
          </Button>
        </div>
      )}

      <Card>
        <CardBody style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '1.5rem' 
          }}>
            <div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#111827' 
              }}>
                Proposal Details
              </h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                Submitted on {proposal.createdAt?.toDate().toLocaleDateString()}
              </p>
            </div>
            <span style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '9999px', 
              fontSize: '0.875rem', 
              fontWeight: '500',
              ...getStatusStyle(proposal.status)
            }}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          </div>

          {/* Listing Info */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem' 
            }}>
              Listing Information
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Type</p>
                <p style={{ fontWeight: '500' }}>
                  {listing.listingType === 'buyer' ? 'Buyer Listing' : 'Seller Listing'}
                </p>
              </div>
              {listing.propertyAddress && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Property Address</p>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                    <MapPin style={{ marginRight: '0.25rem' }} />
                    {listing.propertyAddress}
                  </p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Price Range</p>
                <p style={{ fontWeight: '500' }}>
                  ${listing.minPrice?.toLocaleString() || 0} - ${listing.maxPrice?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Timeline</p>
                <p style={{ fontWeight: '500' }}>{listing.timeline}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            padding: '1.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem' 
            }}>
              Client Information
            </h2>
            {isAccepted ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Name</p>
                  <p style={{ fontWeight: '500' }}>{client?.displayName || 'Not provided'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email</p>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                    <Mail style={{ marginRight: '0.25rem' }} />
                    {client?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Phone</p>
                  <p style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                    <Phone style={{ marginRight: '0.25rem' }} />
                    {client?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ 
                backgroundColor: '#fef9c3', 
                borderLeft: '4px solid #fbbf24', 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex' }}>
                  <AlertCircle style={{ color: '#f59e0b' }} />
                  <div style={{ marginLeft: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
                      Client contact information will be available once your proposal is accepted.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Proposal Details */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem' 
            }}>
              Your Proposal
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Commission Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                {proposal.commissionRate}%
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Services Offered
              </p>
              <ul style={{ listStyle: 'disc', listStylePosition: 'inside' }}>
                {proposal.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Cover Letter
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{proposal.coverLetter}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '1rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #e5e7eb' 
          }}>
            {listing?.messagingEnabled && !isRejected && (
              <Button
                onClick={handleMessageClient}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  backgroundColor: '#2563eb',
                  color: 'white'
                }}
              >
                <MessageCircle />
                <span style={{ marginLeft: '0.5rem' }}>
                  {existingChannel ? 'Continue Conversation' : 'Message Client'}
                </span>
              </Button>
            )}
            
            {isAccepted && transaction && (
              <Button
                to={`/transaction/${transaction.id}`}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  backgroundColor: '#059669',
                  color: 'white',
                  gap: '0.5rem'
                }}
              >
                <DocumentIcon />
                <span>View Transaction</span>
              </Button>
            )}
            
            {isAccepted && (
              <Button
                onClick={() => navigate(`/agent/appointments/${client?.id}`)}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  backgroundColor: '#16a34a',
                  color: 'white'
                }}
              >
                <Calendar />
                <span style={{ marginLeft: '0.5rem' }}>Schedule Appointment</span>
              </Button>
            )}
          </div>

          {/* Status Messages */}
          {isRejected && (
            <div style={{ 
              marginTop: '1.5rem', 
              backgroundColor: '#fee2e2', 
              borderLeft: '4px solid #ef4444', 
              padding: '1rem' 
            }}>
              <div style={{ display: 'flex' }}>
                <AlertCircle style={{ color: '#ef4444' }} />
                <div style={{ marginLeft: '0.75rem' }}>
                  <h3 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#991b1b' 
                  }}>
                    Proposal Rejected
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginTop: '0.25rem' }}>
                    {proposal.rejectedReason || 'The client has chosen to work with another agent.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isAccepted && (
            <div style={{ 
              marginTop: '1.5rem', 
              backgroundColor: '#dcfce7', 
              borderLeft: '4px solid #16a34a', 
              padding: '1rem' 
            }}>
              <div style={{ display: 'flex' }}>
                <AlertCircle style={{ color: '#16a34a' }} />
                <div style={{ marginLeft: '0.75rem' }}>
                  <h3 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#166534' 
                  }}>
                    Proposal Accepted!
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#15803d', marginTop: '0.25rem' }}>
                    Congratulations! You can now contact the client and schedule appointments.
                    {transaction && (
                      <span style={{ display: 'block', marginTop: '0.5rem' }}>
                        <Link 
                          to={`/transaction/${transaction.id}`}
                          style={{ 
                            color: '#059669', 
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <DocumentIcon /> Go to your transaction dashboard
                        </Link>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProposalDetail;