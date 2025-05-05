// src/components/shared/InjectProposalButtons.js

import { doc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

// This function directly injects buttons into the DOM
export function injectProposalButtons(proposalId, currentUser) {
  // Check if buttons already exist
  if (document.getElementById('proposal-action-buttons')) {
    return; // Don't add buttons twice
  }
  
  // First, let's fetch the proposal data
  const fetchProposalData = async () => {
    try {
      const proposalRef = doc(db, 'proposals', proposalId);
      const proposalDoc = await proposalRef.get();
      
      if (!proposalDoc.exists()) {
        console.error('Proposal not found');
        return;
      }
      
      const proposalData = { id: proposalDoc.id, ...proposalDoc.data() };
      
      // Only proceed if proposal is active
      if (proposalData.status !== 'active' && proposalData.status !== 'pending') {
        return;
      }
      
      // Get listing data to check ownership
      const listingRef = doc(db, proposalData.listingType === 'seller' ? 'sellerListings' : 'buyerListings', proposalData.listingId);
      const listingDoc = await listingRef.get();
      
      if (!listingDoc.exists() || listingDoc.data().userId !== currentUser.uid) {
        return; // Not authorized
      }
      
      // Create buttons container
      const container = document.createElement('div');
      container.id = 'proposal-action-buttons';
      container.style.display = 'flex';
      container.style.justifyContent = 'center';
      container.style.gap = '16px';
      container.style.margin = '30px 0';
      
      // Create accept button
      const acceptButton = document.createElement('button');
      acceptButton.textContent = 'Accept Proposal';
      acceptButton.style.backgroundColor = '#16a34a';
      acceptButton.style.color = 'white';
      acceptButton.style.padding = '8px 16px';
      acceptButton.style.borderRadius = '6px';
      acceptButton.style.border = 'none';
      acceptButton.style.cursor = 'pointer';
      acceptButton.style.fontWeight = 'bold';
      
      // Create reject button
      const rejectButton = document.createElement('button');
      rejectButton.textContent = 'Reject Proposal';
      rejectButton.style.backgroundColor = '#ef4444';
      rejectButton.style.color = 'white';
      rejectButton.style.padding = '8px 16px';
      rejectButton.style.borderRadius = '6px';
      rejectButton.style.border = 'none';
      rejectButton.style.cursor = 'pointer';
      rejectButton.style.fontWeight = 'bold';
      
      // Add event listeners
      acceptButton.addEventListener('click', () => handleAcceptProposal(proposalData));
      rejectButton.addEventListener('click', () => showRejectDialog(proposalData));
      
      // Add buttons to container
      container.appendChild(rejectButton);
      container.appendChild(acceptButton);
      
      // Find a place to add the buttons in the DOM
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const contentDiv = mainContent.querySelector('div');
        if (contentDiv) {
          contentDiv.appendChild(container);
        } else {
          mainContent.appendChild(container);
        }
      } else {
        // Fallback to body
        document.body.appendChild(container);
      }
    } catch (error) {
      console.error('Error setting up proposal buttons:', error);
    }
  };
  
  // Handle accepting a proposal
  const handleAcceptProposal = async (proposal) => {
    // Instead of using confirm(), create a custom dialog
    const dialogContainer = document.createElement('div');
    dialogContainer.style.position = 'fixed';
    dialogContainer.style.top = '0';
    dialogContainer.style.left = '0';
    dialogContainer.style.right = '0';
    dialogContainer.style.bottom = '0';
    dialogContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogContainer.style.display = 'flex';
    dialogContainer.style.alignItems = 'center';
    dialogContainer.style.justifyContent = 'center';
    dialogContainer.style.zIndex = '1000';
    
    const dialogBox = document.createElement('div');
    dialogBox.style.backgroundColor = 'white';
    dialogBox.style.padding = '20px';
    dialogBox.style.borderRadius = '8px';
    dialogBox.style.maxWidth = '400px';
    dialogBox.style.width = '90%';
    
    const dialogTitle = document.createElement('h3');
    dialogTitle.textContent = 'Accept Proposal';
    dialogTitle.style.marginBottom = '15px';
    
    const dialogMessage = document.createElement('p');
    dialogMessage.textContent = 'Are you sure you want to accept this proposal?';
    dialogMessage.style.marginBottom = '20px';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '6px';
    cancelButton.style.border = '1px solid #d1d5db';
    cancelButton.style.cursor = 'pointer';
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Accept';
    confirmButton.style.backgroundColor = '#16a34a';
    confirmButton.style.color = 'white';
    confirmButton.style.padding = '8px 16px';
    confirmButton.style.borderRadius = '6px';
    confirmButton.style.border = 'none';
    confirmButton.style.cursor = 'pointer';
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    
    dialogBox.appendChild(dialogTitle);
    dialogBox.appendChild(dialogMessage);
    dialogBox.appendChild(buttonContainer);
    
    dialogContainer.appendChild(dialogBox);
    document.body.appendChild(dialogContainer);
    
    // Handle dialog buttons
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(dialogContainer);
    });
    
    confirmButton.addEventListener('click', async () => {
      document.body.removeChild(dialogContainer);
      
      try {
        // Update button states
        const acceptButton = document.querySelector('#proposal-action-buttons button:nth-child(2)');
        const rejectButton = document.querySelector('#proposal-action-buttons button:nth-child(1)');
        
        if (acceptButton) {
          acceptButton.textContent = 'Accepting...';
          acceptButton.disabled = true;
        }
        
        if (rejectButton) {
          rejectButton.disabled = true;
        }
        
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
            message: `Your proposal has been accepted.`,
            userId: proposal.agentId,
            read: false,
            actionUrl: `/agent/proposals/${proposal.id}`,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Error creating notification:', err);
        }

        // Show success message and refresh
        const successMessage = document.createElement('div');
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = '#dcfce7';
        successMessage.style.color = '#166534';
        successMessage.style.padding = '15px 20px';
        successMessage.style.borderRadius = '6px';
        successMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        successMessage.style.zIndex = '2000';
        successMessage.textContent = 'Proposal accepted successfully!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error accepting proposal:', error);
        alert('Error accepting proposal. Please try again.');
        
        // Reset button states
        const acceptButton = document.querySelector('#proposal-action-buttons button:nth-child(2)');
        const rejectButton = document.querySelector('#proposal-action-buttons button:nth-child(1)');
        
        if (acceptButton) {
          acceptButton.textContent = 'Accept Proposal';
          acceptButton.disabled = false;
        }
        
        if (rejectButton) {
          rejectButton.disabled = false;
        }
      }
    });
  };
  
  // Show reject dialog function
  const showRejectDialog = (proposal) => {
    const dialogContainer = document.createElement('div');
    dialogContainer.style.position = 'fixed';
    dialogContainer.style.top = '0';
    dialogContainer.style.left = '0';
    dialogContainer.style.right = '0';
    dialogContainer.style.bottom = '0';
    dialogContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogContainer.style.display = 'flex';
    dialogContainer.style.alignItems = 'center';
    dialogContainer.style.justifyContent = 'center';
    dialogContainer.style.zIndex = '1000';
    
    const dialogBox = document.createElement('div');
    dialogBox.style.backgroundColor = 'white';
    dialogBox.style.padding = '20px';
    dialogBox.style.borderRadius = '8px';
    dialogBox.style.maxWidth = '400px';
    dialogBox.style.width = '90%';
    
    const dialogTitle = document.createElement('h3');
    dialogTitle.textContent = 'Reject Proposal';
    dialogTitle.style.marginBottom = '15px';
    
    const dialogMessage = document.createElement('p');
    dialogMessage.textContent = 'Please provide a reason for rejection (optional):';
    dialogMessage.style.marginBottom = '10px';
    
    const textArea = document.createElement('textarea');
    textArea.style.width = '100%';
    textArea.style.minHeight = '100px';
    textArea.style.padding = '8px';
    textArea.style.borderRadius = '4px';
    textArea.style.border = '1px solid #d1d5db';
    textArea.style.marginBottom = '20px';
    textArea.placeholder = 'Optional: Provide feedback to the agent';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.borderRadius = '6px';
    cancelButton.style.border = '1px solid #d1d5db';
    cancelButton.style.cursor = 'pointer';
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Reject';
    confirmButton.style.backgroundColor = '#ef4444';
    confirmButton.style.color = 'white';
    confirmButton.style.padding = '8px 16px';
    confirmButton.style.borderRadius = '6px';
    confirmButton.style.border = 'none';
    confirmButton.style.cursor = 'pointer';
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    
    dialogBox.appendChild(dialogTitle);
    dialogBox.appendChild(dialogMessage);
    dialogBox.appendChild(textArea);
    dialogBox.appendChild(buttonContainer);
    
    dialogContainer.appendChild(dialogBox);
    document.body.appendChild(dialogContainer);
    
    // Handle dialog buttons
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(dialogContainer);
    });
    
    confirmButton.addEventListener('click', async () => {
      document.body.removeChild(dialogContainer);
      const reason = textArea.value.trim();
      
      try {
        // Update button states
        const acceptButton = document.querySelector('#proposal-action-buttons button:nth-child(2)');
        const rejectButton = document.querySelector('#proposal-action-buttons button:nth-child(1)');
        
        if (rejectButton) {
          rejectButton.textContent = 'Rejecting...';
          rejectButton.disabled = true;
        }
        
        if (acceptButton) {
          acceptButton.disabled = true;
        }
        
        // Update proposal status
        const proposalRef = doc(db, 'proposals', proposal.id);
        await updateDoc(proposalRef, {
          status: 'rejected',
          rejectedReason: reason || 'Declined by client',
          rejectedAt: serverTimestamp()
        });
        
        // Create notification for the agent
        try {
          await addDoc(collection(db, 'notifications'), {
            type: 'proposal_rejected',
            title: 'Proposal Rejected',
            message: `Your proposal has been rejected.`,
            userId: proposal.agentId,
            read: false,
            actionUrl: `/agent/proposals/${proposal.id}`,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error('Error creating notification:', err);
        }
        
        // Show success message and refresh
        const successMessage = document.createElement('div');
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = '#fee2e2';
        successMessage.style.color = '#991b1b';
        successMessage.style.padding = '15px 20px';
        successMessage.style.borderRadius = '6px';
        successMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        successMessage.style.zIndex = '2000';
        successMessage.textContent = 'Proposal rejected successfully.';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error('Error rejecting proposal:', err);
        alert('Error rejecting proposal. Please try again.');
        
        // Reset button states
        const acceptButton = document.querySelector('#proposal-action-buttons button:nth-child(2)');
        const rejectButton = document.querySelector('#proposal-action-buttons button:nth-child(1)');
        
        if (rejectButton) {
          rejectButton.textContent = 'Reject Proposal';
          rejectButton.disabled = false;
        }
        
        if (acceptButton) {
          acceptButton.disabled = false;
        }
      }
    });
  };
  
  // Start the process
  fetchProposalData();
}

export default injectProposalButtons;