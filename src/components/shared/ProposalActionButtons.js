// src/components/shared/ProposalActionButtons.js
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

// Simple icons
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * A standalone component that provides Accept/Reject buttons for proposals
 * @param {Object} props 
 * @param {Object} props.proposal - The proposal data
 * @param {Object} props.listing - The listing data
 */
const ProposalActionButtons = ({ proposal, listing }) => {
  const { currentUser } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!proposal || !listing || !currentUser) {
    return null;
  }

  // Only show for active proposals
  if (proposal.status !== 'active' && proposal.status !== 'pending') {
    return null;
  }
  
  // Only show for the owner of the listing
  if (listing.userId !== currentUser.uid) {
    return null;
  }

  const handleAcceptProposal = async () => {
    if (accepting) return;

    setAccepting(true);
    try {
      // Update proposal status
      const proposalRef = doc(db, 'proposals', proposal.id);
      await updateDoc(proposalRef, {
        status: 'Accepted',
        acceptedAt: serverTimestamp()
      });

      // Update listing status
      const listingRef = doc(db, proposal.listingType === 'seller' ? 'sellerListings' : 'buyerListings', proposal.listingId);
      await updateDoc(listingRef, {
        status: 'accepted',
        acceptedProposalId: proposal.id,
        acceptedAgentId: proposal.agentId,
        acceptedAt: serverTimestamp()
      });

      // Notify other agents that this listing has been accepted
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
        if (otherProposalDoc.id !== proposal.id) {
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
      
      // Create notification for the agent
      try {
        await addDoc(collection(db, 'notifications'), {
          type: 'proposal_accepted',
          title: 'Proposal Accepted!',
          message: `Your proposal for ${listing.propertyAddress || 'a property'} has been accepted.`,
          userId: proposal.agentId,
          read: false,
          actionUrl: `/agent/proposals/${proposal.id}`,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Error creating notification:', err);
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (err) {
      console.error('Error accepting proposal:', err);
      alert('Error accepting proposal. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const handleRejectProposal = async () => {
    if (rejecting) return;
    
    setRejecting(true);
    try {
      // Update proposal status
      const proposalRef = doc(db, 'proposals', proposal.id);
      await updateDoc(proposalRef, {
        status: 'rejected',
        rejectedReason: rejectReason || 'Declined by client',
        rejectedAt: serverTimestamp()
      });
      
      // Create notification for the agent
      try {
        await addDoc(collection(db, 'notifications'), {
          type: 'proposal_rejected',
          title: 'Proposal Rejected',
          message: `Your proposal for ${listing.propertyAddress || 'a property'} has been rejected.`,
          userId: proposal.agentId,
          read: false,
          actionUrl: `/agent/proposals/${proposal.id}`,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Error creating notification:', err);
      }
      
      setShowRejectModal(false);
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      alert('Error rejecting proposal. Please try again.');
    } finally {
      setRejecting(false);
    }
  };

  // Simple Reject Modal
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
        width: '90%',
        maxWidth: '30rem'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Reject Proposal</h3>
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
            style={{ backgroundColor: '#9ca3af', color: 'white' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectProposal}
            disabled={rejecting}
            style={{ backgroundColor: '#ef4444', color: 'white' }}
          >
            {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showRejectModal && <RejectModal />}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '1rem',
        margin: '2rem 0' 
      }}>
        <Button
          onClick={() => setShowRejectModal(true)}
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <XIcon />
          Reject Proposal
        </Button>
        
        <Button
          onClick={handleAcceptProposal}
          disabled={accepting}
          style={{ 
            backgroundColor: '#16a34a', 
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {accepting ? 'Accepting...' : (
            <>
              <CheckIcon />
              Accept Proposal
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default ProposalActionButtons;