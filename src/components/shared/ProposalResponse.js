// src/components/shared/ProposalResponse.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const ProposalResponse = () => {
  const { proposalId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch the proposal document
        const proposalRef = doc(db, 'proposals', proposalId);
        const proposalSnap = await getDoc(proposalRef);
        
        if (!proposalSnap.exists()) {
          setError('Proposal not found');
          setLoading(false);
          return;
        }
        
        const proposalData = { id: proposalSnap.id, ...proposalSnap.data() };
        setProposal(proposalData);
        
        // Fetch the listing document
        const listingRef = doc(db, proposalData.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', proposalData.listingId);
        const listingSnap = await getDoc(listingRef);
        
        if (listingSnap.exists()) {
          setListing({ id: listingSnap.id, ...listingSnap.data() });
        } else {
          setError('Listing not found');
        }
        
        // Fetch agent information
        const agentRef = doc(db, 'users', proposalData.agentId);
        const agentSnap = await getDoc(agentRef);
        
        if (agentSnap.exists()) {
          setAgent({ id: agentSnap.id, ...agentSnap.data() });
        }
        
      } catch (err) {
        console.error('Error fetching proposal details:', err);
        setError('Error loading proposal details');
      } finally {
        setLoading(false);
      }
    };
    
    if (proposalId) {
      fetchProposalDetails();
    }
  }, [proposalId]);
  
  const handleAcceptProposal = async () => {
    try {
      setActionLoading(true);
      
      // 1. Update the proposal status to 'Accepted'
      const proposalRef = doc(db, 'proposals', proposalId);
      await updateDoc(proposalRef, {
        status: 'Accepted',
        acceptedAt: serverTimestamp(),
        responseMessage: responseMessage || null
      });
      
      // 2. Reject all other proposals for this listing
      const otherProposalsQuery = query(
        collection(db, 'proposals'),
        where('listingId', '==', proposal.listingId),
        where('listingType', '==', proposal.listingType)
      );
      
      const otherProposalsSnap = await getDocs(otherProposalsQuery);
      
      const batch = [];
      otherProposalsSnap.forEach(doc => {
        if (doc.id !== proposalId) {
          batch.push(updateDoc(doc.ref, {
            status: 'Rejected',
            rejectedAt: serverTimestamp(),
            rejectionReason: 'Another proposal was accepted'
          }));
        }
      });
      
      await Promise.all(batch);
      
      // 3. Create a messaging channel between client and agent
      const messagingChannelRef = await addDoc(collection(db, 'messagingChannels'), {
        proposalId,
        listingId: proposal.listingId,
        listingType: proposal.listingType,
        agentId: proposal.agentId,
        clientId: currentUser.uid,
        agentName: agent.displayName || 'Agent',
        clientName: userProfile.displayName || 'Client',
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        participants: [currentUser.uid, proposal.agentId]
      });
      
      // 4. Create the first system message
      await addDoc(collection(db, 'messages'), {
        channelId: messagingChannelRef.id,
        senderId: 'system',
        senderName: 'System',
        content: `Proposal accepted! ${userProfile.displayName || 'Client'} and ${agent.displayName || 'Agent'} are now connected.`,
        createdAt: serverTimestamp(),
        isSystemMessage: true,
        isRead: false
      });
      
      // 5. Redirect to the messaging channel
      alert('Proposal accepted! You can now communicate with the agent.');
      navigate(`/${userProfile.userType}/messages/${messagingChannelRef.id}`);
      
    } catch (err) {
      console.error('Error accepting proposal:', err);
      setError('Error accepting the proposal. Please try again.');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };
  
  const handleRejectProposal = async () => {
    try {
      setActionLoading(true);
      
      // Update the proposal status to 'Rejected'
      const proposalRef = doc(db, 'proposals', proposalId);
      await updateDoc(proposalRef, {
        status: 'Rejected',
        rejectedAt: serverTimestamp(),
        responseMessage: responseMessage || null
      });
      
      alert('Proposal rejected.');
      
      // Navigate back to proposals list
      navigate(`/${userProfile.userType}/proposals`);
      
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      setError('Error rejecting the proposal. Please try again.');
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '2rem' 
      }}>
        Loading proposal details...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
        <Button to={`/${userProfile?.userType}/proposals`}>Back to Proposals</Button>
      </div>
    );
  }
  
  if (!proposal || !listing) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          Proposal or listing not found
        </div>
        <Button to={`/${userProfile?.userType}/proposals`}>Back to Proposals</Button>
      </div>
    );
  }
  
  // Show confirmation dialog when user tries to accept or reject
  if (confirmAction) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Confirm {confirmAction === 'accept' ? 'Accept' : 'Reject'} Proposal
            </h2>
          </CardHeader>
          <CardBody>
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to {confirmAction === 'accept' ? 'accept' : 'reject'} this proposal from {agent?.displayName || 'the agent'}?
              {confirmAction === 'accept' && " This will reject all other proposals and create a connection with this agent."}
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="responseMessage" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Message to Agent (Optional):
              </label>
              <textarea
                id="responseMessage"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={4}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  resize: 'vertical'
                }}
                placeholder={confirmAction === 'accept' 
                  ? "I'm excited to work with you! Here's what I'd like to discuss first..." 
                  : "Thank you for your proposal. Unfortunately, I've decided to go with another agent because..."}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button 
                onClick={confirmAction === 'accept' ? handleAcceptProposal : handleRejectProposal}
                disabled={actionLoading}
                variant={confirmAction === 'accept' ? 'primary' : 'danger'}
              >
                {actionLoading ? 'Processing...' : confirmAction === 'accept' ? 'Confirm Accept' : 'Confirm Reject'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  // Main proposal view
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Button to={`/${userProfile?.userType}/proposals`} variant="secondary">Back to Proposals</Button>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {proposal.status === 'Pending' && (
            <>
              <Button 
                onClick={() => setConfirmAction('reject')}
                variant="danger"
              >
                Reject Proposal
              </Button>
              <Button 
                onClick={() => setConfirmAction('accept')}
              >
                Accept Proposal
              </Button>
            </>
          )}
          
          {proposal.status === 'Accepted' && (
            <div style={{ 
              backgroundColor: '#dcfce7', 
              color: '#15803d', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Proposal Accepted
            </div>
          )}
          
          {proposal.status === 'Rejected' && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#b91c1c', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Proposal Rejected
            </div>
          )}
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Agent Information
            </h2>
          </CardHeader>
          <CardBody>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                width: '5rem',
                height: '5rem',
                borderRadius: '9999px',
                backgroundColor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0369a1" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
                {agent?.displayName || 'Agent'}
              </h3>
              <p style={{ margin: '0', color: '#6b7280' }}>
                Real Estate Agent
              </p>
            </div>
            
            {agent?.bio && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  About:
                </h4>
                <p>{agent.bio}</p>
              </div>
            )}
            
            {agent?.experience && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Experience:
                </h4>
                <p>{agent.experience}</p>
              </div>
            )}
            
            {agent?.specialties && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Specialties:
                </h4>
                <p>{agent.specialties}</p>
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Proposal Details
            </h2>
          </CardHeader>
          <CardBody>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Pricing Structure:
              </h3>
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.375rem',
                marginBottom: '0.5rem'
              }}>
                {proposal.feeStructure === 'percentage' ? (
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    Commission Rate: <span style={{ color: '#2563eb' }}>{proposal.commissionRate}</span>
                  </p>
                ) : (
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    Flat Fee: <span style={{ color: '#2563eb' }}>{proposal.flatFee}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Services Included:
              </h3>
              {proposal.services && proposal.services.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                  {proposal.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific services listed</p>
              )}
              
              {proposal.additionalServices && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Additional Services:
                  </h4>
                  <p>{proposal.additionalServices}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Agent's Message:
              </h3>
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.375rem',
                whiteSpace: 'pre-line'
              }}>
                {proposal.message}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            Property Details
          </h2>
        </CardHeader>
        <CardBody>
          {proposal.listingType === 'buyer' ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Property Requirements:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Location:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.location || 'Not specified'}</p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Property Type:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.propertyType || 'Not specified'}</p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bedrooms:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.bedrooms || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bathrooms:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.bathrooms || 'Not specified'}</p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Budget:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>
                      {listing.budget ? `$${listing.budget.toLocaleString()}` : 'Not specified'}
                    </p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Timeline:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.timeline || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              {(listing.mustHaveFeatures && listing.mustHaveFeatures.length > 0) || 
               (listing.niceToHaveFeatures && listing.niceToHaveFeatures.length > 0) ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Features:
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {listing.mustHaveFeatures && listing.mustHaveFeatures.length > 0 && (
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Must-Have Features:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                          {listing.mustHaveFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {listing.niceToHaveFeatures && listing.niceToHaveFeatures.length > 0 && (
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Nice-to-Have Features:</p>
                        <ul style={{ paddingLeft: '1.5rem' }}>
                          {listing.niceToHaveFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
              
              {listing.additionalInfo && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Additional Information:
                  </h3>
                  <p>{listing.additionalInfo}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Property Information:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Address:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.address || 'Not specified'}</p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Property Type:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.propertyType || 'Not specified'}</p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bedrooms:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.bedrooms || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Bathrooms:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>{listing.bathrooms || 'Not specified'}</p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Asking Price:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>
                      {listing.price ? `$${listing.price.toLocaleString()}` : 'Not specified'}
                    </p>
                    
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Square Footage:</p>
                    <p style={{ margin: '0 0 1rem 0' }}>
                      {listing.squareFootage ? `${listing.squareFootage.toLocaleString()} sq ft` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
              
              {listing.description && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Property Description:
                  </h3>
                  <p>{listing.description}</p>
                </div>
              )}
              
              {listing.additionalInfo && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Additional Information:
                  </h3>
                  <p>{listing.additionalInfo}</p>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProposalResponse;