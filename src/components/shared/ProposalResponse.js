// src/components/shared/ProposalResponse.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { createTransaction } from '../../services/firebase/transactions';
import LoadingSpinner from '../common/LoadingSpinner';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Button } from '../common/Button';

// Icons
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

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Message related states
  const [existingChannel, setExistingChannel] = useState(null);
  const [creatingChannel, setCreatingChannel] = useState(false);
  
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
        const listingCollection = proposalData.listingType === 'seller' ? 'sellerListings' : 'buyerListings';
        const listingRef = doc(db, listingCollection, proposalData.listingId);
        const listingDoc = await getDoc(listingRef);
        
        if (!listingDoc.exists()) {
          console.error("Listing not found");
          setError('Listing not found');
          setLoading(false);
          return;
        }
        
        if (listingDoc.data().userId !== currentUser.uid) {
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
        console.log("Checking for existing message channel");
        try {
          const channelsRef = collection(db, 'messageChannels');
          const q = query(
            channelsRef,
            where('participants', 'array-contains', currentUser.uid),
            where('proposalId', '==', proposalId)
          );
          const channelDocs = await getDocs(q);
          
          if (!channelDocs.empty) {
            const channel = channelDocs.docs[0];
            setExistingChannel({ id: channel.id, ...channel.data() });
            console.log("Found existing message channel:", channel.id);
          } else {
            console.log("No existing message channel found");
          }
        } catch (err) {
          console.error("Error checking for message channel:", err);
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

  // Function to create or navigate to a message channel
  const handleMessage = async () => {
    if (!listing || !agent || !currentUser) return;
    
    // If there's already a channel, navigate to it
    if (existingChannel) {
      navigate(`/${proposal.listingType === 'buyer' ? 'buyer' : 'seller'}/messages/${existingChannel.id}`);
      return;
    }
    
    // Otherwise, create a new channel
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
      console.log("Created new message channel:", channelRef.id);
      
      // Create first welcome message
      await addDoc(collection(db, 'messageChannels', channelRef.id, 'messages'), {
        text: `Hi ${agent.displayName}! I'm interested in discussing my ${proposal.listingType === 'buyer' ? 'property search' : 'property listing'} further.`,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        read: false,
        type: 'text'
      });
      
      // Navigate to the new channel
      navigate(`/${proposal.listingType === 'buyer' ? 'buyer' : 'seller'}/messages/${channelRef.id}`);
    } catch (err) {
      console.error('Error creating message channel:', err);
      setError('Failed to start conversation: ' + err.message);
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
      
      // Create transaction for this accepted proposal
      console.log("Creating transaction for accepted proposal");
      const transactionId = await createTransaction(
        proposal,
        currentUser.uid,  // Client ID
        proposal.agentId  // Agent ID
      );
      console.log("Transaction created with ID:", transactionId);
      
      // Create notification for the agent
      console.log("Creating notification for agent");
      await addDoc(collection(db, 'notifications'), {
        type: 'proposal_accepted',
        title: 'Proposal Accepted!',
        message: `Your proposal for ${listing.propertyAddress || listing.location || 'a property'} has been accepted.`,
        userId: proposal.agentId,
        read: false,
        actionUrl: `/agent/proposals/${proposalId}`,
        createdAt: serverTimestamp()
      });

      // Update local state
      setProposal({
        ...proposal,
        status: 'Accepted',
        acceptedAt: serverTimestamp(),
        transactionId: transactionId
      });
      
      // Show success message and redirect to the transaction
      setSuccess('Proposal accepted! Creating your transaction workspace...');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate(`/transaction/${transactionId}`);
      }, 2000);

    } catch (err) {
      console.error('Error accepting proposal:', err);
      setError('Failed to accept proposal: ' + err.message);
    } finally {
      setAccepting(false);
      setShowAcceptConfirmation(false);
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
        message: `Your proposal for ${listing.propertyAddress || listing.location || 'a property'} has been rejected.`,
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
      setSuccess('Proposal rejected successfully');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      setError('Failed to reject proposal: ' + err.message);
    } finally {
      setRejecting(false);
    }
  };

  const getStatusStyle = (status) => {
    if (!status) return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'accepted':
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

  // Confirmation Modal Component
  const AcceptConfirmationModal = () => (
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
          Accept Proposal
        </h3>
        <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#166534', marginBottom: '1rem' }}>
            <strong>You're about to accept this proposal from {agent?.displayName || 'this agent'}.</strong>
          </p>
          <p style={{ color: '#166534', marginBottom: '0.5rem' }}>
            What happens next:
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#166534' }}>
            <li>All other proposals for this listing will be automatically rejected</li>
            <li>Your listing status will be updated to "Accepted"</li>
            <li>A transaction workspace will be created for you and the agent</li>
            <li>The agent will be notified that their proposal was accepted</li>
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            onClick={() => setShowAcceptConfirmation(false)}
            variant="secondary"
            style={{ border: '1px solid #d1d5db' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAcceptProposal}
            disabled={accepting}
            style={{
              backgroundColor: '#16a34a',
              color: 'white'
            }}
          >
            {accepting ? 'Accepting...' : 'Confirm Acceptance'}
          </Button>
        </div>
      </div>
    </div>
  );

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem' }}>
        <LoadingSpinner />
        <span style={{ marginLeft: '1rem' }}>Loading proposal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem' }}>
          {error}
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
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
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Case insensitive status check
  const isAccepted = proposal.status?.toLowerCase() === 'accepted';
  const isRejected = proposal.status?.toLowerCase() === 'rejected';
  const isActive = proposal.status?.toLowerCase() === 'active' || proposal.status?.toLowerCase() === 'pending';
  
  // Success message display
  if (success) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: isRejected ? '#fee2e2' : '#dcfce7', 
          color: isRejected ? '#b91c1c' : '#15803d', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            {success}
          </h2>
          <p>{isRejected ? 'Redirecting you back to proposals...' : 'Redirecting you to the transaction workspace...'}</p>
          <div style={{ marginTop: '1rem' }}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // Enhanced version with better UI
  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1rem' }}>
      {showRejectModal && <RejectModal />}
      {showAcceptConfirmation && <AcceptConfirmationModal />}
      
      <Card>
        <CardHeader style={{
          backgroundColor: '#f9fafb',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              Proposal Details
            </h2>
          </div>
          <div>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              ...getStatusStyle(proposal.status),
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {proposal.status ? proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1) : 'Pending'}
            </span>
          </div>
        </CardHeader>
        
        <CardBody style={{ padding: '1.5rem' }}>
          {/* Listing info */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              backgroundColor: '#e0f2fe',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <HomeIcon />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {proposal.listingType === 'buyer' 
                  ? `Buyer Listing: ${listing.location || 'Not specified'}`
                  : `Seller Listing: ${listing.address || 'Not specified'}`}
              </h3>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                margin: 0 
              }}>
                {proposal.listingType === 'buyer' 
                  ? `Budget: ${listing.budget ? `$${listing.budget.toLocaleString()}` : 'Not specified'}`
                  : `Price: ${listing.price ? `$${listing.price.toLocaleString()}` : 'Not specified'}`}
              </p>
            </div>
          </div>
          
          {/* Agent info with message button */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'flex-start', 
            gap: '1rem', 
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flex: 1
            }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <UserIcon />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {agent.displayName}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  <strong>Agency:</strong> {agent.brokerageName || 'Not specified'}
                </p>
                {agent.location && (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <strong>Location:</strong> {agent.location}
                  </p>
                )}
              </div>
            </div>
            
            {/* Message button */}
            <div style={{ alignSelf: isMobile ? 'stretch' : 'center' }}>
              <Button
                onClick={handleMessage}
                disabled={creatingChannel}
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <MessageIcon />
                {existingChannel ? 'Continue Conversation' : 'Message Agent'}
              </Button>
            </div>
          </div>
          
          {/* Proposal info */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Proposal Details
            </h3>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Fee Structure
                  </p>
                  <p style={{ fontWeight: '500' }}>
                    {proposal.feeStructure === 'percentage' ? 'Percentage Commission' : 'Flat Fee'}
                  </p>
                </div>
                
                {proposal.feeStructure === 'percentage' && (
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Commission Rate
                    </p>
                    <p style={{ fontWeight: '500' }}>
                      {proposal.commissionRate}%
                    </p>
                  </div>
                )}
                
                {proposal.feeStructure === 'flat' && (
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Flat Fee
                    </p>
                    <p style={{ fontWeight: '500' }}>
                      ${proposal.flatFee}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Services */}
              {proposal.services && proposal.services.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Services Included
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {proposal.services.map((service, index) => (
                      <span key={index} style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Agent Message */}
              {proposal.message && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Agent's Message
                  </p>
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: 'white', 
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {proposal.message}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          {isActive && (
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'center', 
              gap: '1rem',
              marginTop: '2rem',
              marginBottom: '1rem'
            }}>
              <Button
                onClick={() => setShowRejectModal(true)}
                style={{ 
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <XCircle />
                Reject Proposal
              </Button>
              
              <Button
                onClick={() => setShowAcceptConfirmation(true)}
                disabled={accepting}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <CheckCircle />
                Accept Proposal
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
              <h3 style={{ color: '#b91c1c', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <XCircle />
                Proposal Rejected
              </h3>
              {proposal.rejectedReason && (
                <p style={{ color: '#b91c1c' }}>Reason: {proposal.rejectedReason}</p>
              )}
              {proposal.rejectedAt && (
                <p style={{ color: '#b91c1c', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Rejected on {proposal.rejectedAt.toDate().toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          {/* Show if accepted */}
          {isAccepted && (
            <div style={{ 
              marginTop: '1rem',
              padding: '1rem', 
              backgroundColor: '#dcfce7', 
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle />
                Proposal Accepted
              </h3>
              <p style={{ color: '#16a34a', marginBottom: '1rem' }}>
                This proposal has been accepted and a transaction workspace has been created.
              </p>
              
              {proposal.acceptedAt && (
                <p style={{ color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Accepted on {proposal.acceptedAt.toDate().toLocaleDateString()}
                </p>
              )}
              
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {proposal.transactionId && (
                  <Button
                    onClick={() => navigate(`/transaction/${proposal.transactionId}`)}
                    style={{ 
                      backgroundColor: '#16a34a', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Go to Transaction Workspace
                  </Button>
                )}
                
                <Button
                  onClick={handleMessage}
                  disabled={creatingChannel}
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  <MessageIcon />
                  {existingChannel ? 'Continue Conversation' : 'Message Agent'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Back button */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button
              onClick={() => navigate(-1)}
              variant="secondary"
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