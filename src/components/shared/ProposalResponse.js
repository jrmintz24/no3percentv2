// src/components/shared/ProposalResponse.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';

const CheckCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MessageCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Calendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MapPin = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProposalResponse = () => {
  console.log("ProposalResponse component rendering");
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [existingChannel, setExistingChannel] = useState(null);
  const [creatingChannel, setCreatingChannel] = useState(false);
  const [transaction, setTransaction] = useState(null);
  
  // Add isMobile state to handle responsive layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Add resize listener to update isMobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !proposalId) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching proposal data:", proposalId);
        const proposalRef = doc(db, 'proposals', proposalId);
        const proposalDoc = await getDoc(proposalRef);

        if (!proposalDoc.exists()) {
          console.error("Proposal not found");
          setError('Proposal not found');
          setLoading(false);
          return;
        }

        const proposalData = { id: proposalDoc.id, ...proposalDoc.data() };
        console.log("Retrieved proposal data:", proposalData);
        
        // Check if user is authorized to view this proposal
        const listingRef = doc(db, proposalData.listingType === 'seller' ? 'sellerListings' : 'buyerListings', proposalData.listingId);
        const listingDoc = await getDoc(listingRef);
        
        if (!listingDoc.exists() || listingDoc.data().userId !== currentUser.uid) {
          console.error("User not authorized to view this proposal");
          setError('Not authorized to view this proposal');
          setLoading(false);
          return;
        }

        const listingData = { id: listingDoc.id, ...listingDoc.data() };
        console.log("Retrieved listing data:", listingData);
        
        const agentRef = doc(db, 'users', proposalData.agentId);
        const agentDoc = await getDoc(agentRef);
        const agentData = agentDoc.exists() ? { id: agentDoc.id, ...agentDoc.data() } : null;
        console.log("Retrieved agent data:", agentData);

        setProposal(proposalData);
        setListing(listingData);
        setAgent(agentData);

        // Check for existing transaction if the proposal is accepted
        if (proposalData.status === 'Accepted' && proposalData.transactionId) {
          console.log("Checking for existing transaction:", proposalData.transactionId);
          try {
            const transactionRef = doc(db, 'transactions', proposalData.transactionId);
            const transactionDoc = await getDoc(transactionRef);
            
            if (transactionDoc.exists()) {
              setTransaction({ id: transactionDoc.id, ...transactionDoc.data() });
              console.log("Retrieved transaction data");
            } else {
              console.log("Transaction referenced but not found");
            }
          } catch (err) {
            console.error("Error fetching transaction:", err);
          }
        }

        // Check for existing message channel
        if (listingData.messagingEnabled) {
          console.log("Checking for existing message channel");
          try {
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
              console.log("Found existing message channel");
            } else {
              console.log("No existing message channel found");
            }
          } catch (err) {
            console.error("Error checking for message channel:", err);
          }
        }
      } catch (err) {
        console.error('Error fetching proposal data:', err);
        setError('Failed to load proposal data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, proposalId]);

  const createMessageChannel = async () => {
    if (!listing?.messagingEnabled || !agent || existingChannel) return;
    
    setCreatingChannel(true);
    try {
      const channelData = {
        participants: [currentUser.uid, agent.id],
        proposalId: proposalId,
        listingId: listing.id,
        listingType: proposal.listingType,
        lastMessage: null,
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp(),
        status: 'active',
        participantInfo: {
          [currentUser.uid]: {
            name: currentUser.displayName || 'Client',
            role: proposal.listingType === 'seller' ? 'seller' : 'buyer',
            avatar: null
          },
          [agent.id]: {
            name: agent.displayName || 'Agent',
            role: 'agent',
            avatar: agent.profilePhotoURL || null
          }
        }
      };

      const channelRef = await addDoc(collection(db, 'messageChannels'), channelData);
      setExistingChannel({ id: channelRef.id, ...channelData });
      navigate(`/messages/${channelRef.id}`);
    } catch (err) {
      console.error('Error creating message channel:', err);
      setError('Failed to start conversation');
    } finally {
      setCreatingChannel(false);
    }
  };

  const handleAcceptProposal = async () => {
    if (!currentUser || !proposal) return;

    setAccepting(true);
    try {
      console.log("Accepting proposal:", proposalId);
      
      // Update proposal status - using 'Accepted' with capital A
      const proposalRef = doc(db, 'proposals', proposalId);
      await updateDoc(proposalRef, {
        status: 'Accepted',
        acceptedAt: serverTimestamp()
      });
      console.log("Updated proposal status to Accepted");

      // Update listing status
      const listingRef = doc(db, proposal.listingType === 'seller' ? 'sellerListings' : 'buyerListings', proposal.listingId);
      await updateDoc(listingRef, {
        status: 'accepted',
        acceptedProposalId: proposalId,
        acceptedAgentId: proposal.agentId,
        acceptedAt: serverTimestamp()
      });
      console.log("Updated listing status to accepted");

      // Notify other agents that this listing has been accepted
      console.log("Updating other proposals");
      const proposalsRef = collection(db, 'proposals');
      const q = query(
        proposalsRef,
        where('listingId', '==', proposal.listingId),
        where('listingType', '==', proposal.listingType),
        where('status', '==', 'active')
      );
      
      const otherProposals = await getDocs(q);
      const updatePromises = [];
      
      for (const otherProposalDoc of otherProposals.docs) {
        if (otherProposalDoc.id !== proposalId) {
          updatePromises.push(
            updateDoc(doc(db, 'proposals', otherProposalDoc.id), {
              status: 'rejected',
              rejectedReason: 'Another proposal was accepted',
              rejectedAt: serverTimestamp()
            })
          );
        }
      }
      
      await Promise.all(updatePromises);
      console.log("All other proposals updated");
      
      // Create notification for the agent
      console.log("Creating notification for agent");
      await addDoc(collection(db, 'notifications'), {
        type: 'proposal_accepted',
        title: 'Proposal Accepted!',
        message: `Your proposal for ${listing.propertyAddress || 'a property'} has been accepted.`,
        userId: proposal.agentId,
        read: false,
        actionUrl: `/agent/proposals/${proposalId}`,
        createdAt: serverTimestamp()
      });

      // Update local state
      setProposal({
        ...proposal,
        status: 'Accepted',
        acceptedAt: serverTimestamp()
      });
      
      // NOTE: We're not creating a transaction directly here - 
      // You should implement a separate process for that or update the navigation
      
      // Show success message and reload page (transaction might be created by a cloud function)
      alert('Proposal accepted successfully!');
      window.location.reload();

    } catch (err) {
      console.error('Error accepting proposal:', err);
      setError('Failed to accept proposal: ' + err.message);
      alert('Error accepting proposal: ' + err.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleRejectProposal = async () => {
    if (!currentUser || !proposal) return;
    
    setRejecting(true);
    try {
      console.log("Rejecting proposal:", proposalId);
      
      // Update proposal status
      const proposalRef = doc(db, 'proposals', proposalId);
      await updateDoc(proposalRef, {
        status: 'rejected',
        rejectedReason: rejectReason || 'Declined by client',
        rejectedAt: serverTimestamp()
      });
      console.log("Updated proposal status to rejected");
      
      // Create notification for the agent
      console.log("Creating notification for agent");
      await addDoc(collection(db, 'notifications'), {
        type: 'proposal_rejected',
        title: 'Proposal Rejected',
        message: `Your proposal for ${listing.propertyAddress || 'a property'} has been rejected.`,
        userId: proposal.agentId,
        read: false,
        actionUrl: `/agent/proposals/${proposalId}`,
        createdAt: serverTimestamp()
      });
      
      // Update local state
      setProposal({
        ...proposal,
        status: 'rejected',
        rejectedReason: rejectReason || 'Declined by client',
        rejectedAt: serverTimestamp()
      });
      
      // Close modal
      setShowRejectModal(false);
      
      // Show success message and reload page
      alert('Proposal rejected successfully');
      window.location.reload();
      
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      setError('Failed to reject proposal: ' + err.message);
      alert('Error rejecting proposal: ' + err.message);
    } finally {
      setRejecting(false);
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

  // Rejection Modal Component
  const RejectModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        width: isMobile ? '90%' : '30rem',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
          Reject Proposal
        </h3>
        <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
          Please provide a reason for rejecting this proposal (optional):
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Optional: Provide feedback to the agent"
          style={{
            width: '100%',
            minHeight: '5rem',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            border: '1px solid #d1d5db',
            marginBottom: '1.5rem'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            onClick={() => setShowRejectModal(false)}
            variant="secondary"
            style={{ border: '1px solid #d1d5db' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectProposal}
            disabled={rejecting}
            style={{
              backgroundColor: '#ef4444',
              color: 'white'
            }}
          >
            {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!proposal || !listing || !agent) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ backgroundColor: '#fef9c3', color: '#854d0e', padding: '1rem', borderRadius: '0.5rem' }}>
          Proposal data incomplete
        </div>
      </div>
    );
  }

  // Case insensitive status check
  const isAccepted = proposal.status === 'accepted' || proposal.status === 'Accepted';
  const isRejected = proposal.status === 'rejected';
  const isActive = proposal.status === 'active' || proposal.status === 'pending';

  // Simple version with minimal UI
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem' }}>
      {showRejectModal && <RejectModal />}
      
      <Card>
        <CardBody>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Proposal Details
          </h2>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div>
              <p>Status: <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                ...getStatusStyle(proposal.status)
              }}>
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span></p>
            </div>
          </div>
          
          {/* Agent info */}
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Agent Information</h3>
            <p><strong>Name:</strong> {agent.displayName}</p>
            <p><strong>Brokerage:</strong> {agent.brokerageName}</p>
          </div>
          
          {/* Proposal info */}
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Proposal Information</h3>
            <p><strong>Commission Rate:</strong> {proposal.commissionRate}%</p>
            <p><strong>Services:</strong> {proposal.services?.join(', ')}</p>
          </div>
          
          {/* Action buttons */}
          {isActive && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <Button
                onClick={() => setShowRejectModal(true)}
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <XCircle />
                Reject Proposal
              </Button>
              
              <Button
                onClick={handleAcceptProposal}
                disabled={accepting}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {accepting ? 'Accepting...' : (
                  <>
                    <CheckCircle />
                    Accept Proposal
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Show if rejected */}
          {isRejected && (
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              backgroundColor: '#fee2e2', 
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ color: '#b91c1c', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Proposal Rejected
              </h3>
              {proposal.rejectedReason && (
                <p style={{ color: '#b91c1c' }}>Reason: {proposal.rejectedReason}</p>
              )}
            </div>
          )}
          
          {/* Show if accepted */}
          {isAccepted && (
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              backgroundColor: '#dcfce7', 
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Proposal Accepted!
              </h3>
              <p style={{ color: '#16a34a' }}>
                This proposal has been accepted and is now active.
              </p>
            </div>
          )}
          
          {/* Back button */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button
              onClick={() => navigate(-1)}
              style={{ padding: '0.5rem 1rem' }}
            >
              Back to Proposals
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProposalResponse;