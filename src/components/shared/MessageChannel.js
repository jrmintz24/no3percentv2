// src/components/shared/MessageChannel.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  doc, 
  getDoc, 
  updateDoc,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import { Card, CardBody } from '../common/Card';

// Icon components
const ArrowLeft = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Send = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const AlertCircle = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircle = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExternalLink = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const Calendar = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Phone = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Mail = () => (
  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MessageChannel = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [messageChannel, setMessageChannel] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!currentUser || !channelId) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        // First, fetch the current user's profile to get userType
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() };
          setCurrentUserProfile(userData);
          console.log('Current user profile:', userData);
        } else {
          console.error('User profile not found');
          setError('User profile not found');
          setLoading(false);
          return;
        }
        
        // Get channel data
        const channelRef = doc(db, 'messageChannels', channelId);
        const channelDoc = await getDoc(channelRef);
        
        if (!channelDoc.exists()) {
          setError('Message channel not found');
          setLoading(false);
          return;
        }

        const channelData = { id: channelDoc.id, ...channelDoc.data() };
        console.log('Channel data:', channelData);
        
        // Verify user is a participant
        if (!channelData.participants || !channelData.participants.includes(currentUser.uid)) {
          setError('You are not authorized to view this conversation');
          setLoading(false);
          return;
        }

        setMessageChannel(channelData);

        // Get other participant info
        const otherParticipantId = channelData.participants.find(id => id !== currentUser.uid);
        if (otherParticipantId) {
          const participantInfo = channelData.participantInfo?.[otherParticipantId];
          if (participantInfo) {
            setOtherParticipant({ 
              id: otherParticipantId, 
              displayName: participantInfo.name,
              userType: participantInfo.role,
              ...participantInfo 
            });
          } else {
            try {
              const otherParticipantRef = doc(db, 'users', otherParticipantId);
              const otherParticipantDoc = await getDoc(otherParticipantRef);
              
              if (otherParticipantDoc.exists()) {
                setOtherParticipant({ id: otherParticipantDoc.id, ...otherParticipantDoc.data() });
              }
            } catch (error) {
              console.warn('Could not fetch other participant info:', error);
            }
          }
        }

        // Fetch proposal and listing data
        if (channelData.proposalId) {
          const proposalRef = doc(db, 'proposals', channelData.proposalId);
          const proposalDoc = await getDoc(proposalRef);
          if (proposalDoc.exists()) {
            const proposalData = { id: proposalDoc.id, ...proposalDoc.data() };
            setProposal(proposalData);
            console.log('Proposal data:', proposalData);

            // Fetch listing data
            if (proposalData.listingId && proposalData.listingType) {
              const listingRef = doc(db, 
                proposalData.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', 
                proposalData.listingId
              );
              const listingDoc = await getDoc(listingRef);
              if (listingDoc.exists()) {
                const listingData = { id: listingDoc.id, ...listingDoc.data() };
                setListing(listingData);
                console.log('Listing data:', listingData);
              }
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching channel data:', err);
        setError('Failed to load conversation: ' + err.message);
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [currentUser, channelId]);

  useEffect(() => {
    if (!channelId || !currentUser || !messageChannel) return;

    const messagesRef = collection(db, 'messageChannels', channelId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messageList = [];
        snapshot.forEach((doc) => {
          messageList.push({ id: doc.id, ...doc.data() });
        });
        
        setMessages(messageList);
        scrollToBottom();
      },
      (error) => {
        console.error('Error listening to messages:', error);
        setError('Failed to load messages: ' + error.message);
      }
    );

    return () => unsubscribe();
  }, [channelId, currentUser, messageChannel]);

  const handleAcceptProposal = async () => {
    if (!currentUser || !proposal || !listing) return;

    setAccepting(true);
    console.log('Accepting proposal:', proposal.id);
    
    try {
      // Update proposal status
      const proposalRef = doc(db, 'proposals', proposal.id);
      await updateDoc(proposalRef, {
        status: 'accepted',
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
      
      // Refresh proposal data
      const updatedProposalDoc = await getDoc(doc(db, 'proposals', proposal.id));
      if (updatedProposalDoc.exists()) {
        setProposal({ id: updatedProposalDoc.id, ...updatedProposalDoc.data() });
      }
      
      alert('Proposal accepted successfully!');
    } catch (err) {
      console.error('Error accepting proposal:', err);
      setError('Failed to accept proposal');
      alert('Failed to accept proposal: ' + err.message);
    } finally {
      setAccepting(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !channelId || sending || messageChannel?.status === 'archived') return;

    setSending(true);
    try {
      const messagesRef = collection(db, 'messageChannels', channelId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
        read: false,
        type: 'text'
      });

      const channelRef = doc(db, 'messageChannels', channelId);
      await updateDoc(channelRef, {
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
        lastMessageSender: currentUser.uid
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  // Debug logging
  console.log('Current user profile:', currentUserProfile);
  console.log('Proposal:', proposal);
  console.log('Listing:', listing);
  console.log('Is buyer or seller:', currentUserProfile?.userType === 'buyer' || currentUserProfile?.userType === 'seller');
  console.log('Proposal status:', proposal?.status);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1rem' }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.5rem' 
        }}>
          {error}
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ 
                backgroundColor: '#fecaca', 
                color: '#b91c1c', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAcceptedProposal = proposal?.status === 'accepted';
  const isBuyerOrSeller = currentUserProfile?.userType === 'buyer' || currentUserProfile?.userType === 'seller';
  const canAcceptProposal = 
    proposal?.status === 'active' && 
    currentUserProfile?.userType !== 'agent' && 
    listing?.userId === currentUser.uid;

  return (
    <div style={{ 
      maxWidth: '64rem', 
      margin: '0 auto', 
      height: 'calc(100vh - 120px)', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '1rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center',
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ 
            marginRight: '1rem', 
            padding: '0.5rem', 
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {otherParticipant?.avatar || otherParticipant?.profilePhotoURL ? (
            <img 
              src={otherParticipant.avatar || otherParticipant.profilePhotoURL} 
              alt={otherParticipant.displayName || otherParticipant.name}
              style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '9999px', 
                marginRight: '1rem',
                objectFit: 'cover',
                border: '2px solid #e5e7eb'
              }}
            />
          ) : (
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              borderRadius: '9999px', 
              backgroundColor: '#e5e7eb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginRight: '1rem' 
            }}>
              <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                {(otherParticipant?.displayName || otherParticipant?.name || '?').charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h2 style={{ fontWeight: '600', margin: 0, fontSize: '1.125rem' }}>
              {otherParticipant?.displayName || otherParticipant?.name || 'Unknown'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              {otherParticipant?.role || otherParticipant?.userType || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Info Card */}
      {proposal && (
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
          <Card style={{ 
            backgroundColor: '#f9fafb', 
            boxShadow: 'none',
            marginBottom: 0 
          }}>
            <CardBody style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  margin: '0 0 0.5rem 0' 
                }}>
                  Proposal Details
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Commission: </span>
                    <span style={{ fontWeight: '600', color: '#2563eb' }}>{proposal.commissionRate}%</span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>Status: </span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: proposal.status === 'accepted' ? '#dcfce7' : 
                                     proposal.status === 'rejected' ? '#fee2e2' : '#dbeafe',
                      color: proposal.status === 'accepted' ? '#166534' : 
                             proposal.status === 'rejected' ? '#991b1b' : '#1e40af'
                    }}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                {currentUserProfile?.userType && (
                  <Button
                    to={`/${currentUserProfile.userType}/proposals/${proposal.id}`}
                    variant="secondary"
                    size="small"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ExternalLink />
                    View Full Proposal
                  </Button>
                )}
                
                {canAcceptProposal && (
                  <Button
                    onClick={handleAcceptProposal}
                    disabled={accepting}
                    variant="primary"
                    size="small"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      backgroundColor: '#10b981',
                      color: 'white'
                    }}
                  >
                    {accepting ? 'Accepting...' : (
                      <>
                        <CheckCircle />
                        Accept Proposal
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Show contact info and schedule button after acceptance */}
              {isAcceptedProposal && (
                <div style={{ 
                  borderTop: '1px solid #e5e7eb', 
                  paddingTop: '1rem',
                  marginTop: '1rem'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                      Contact Information
                    </h4>
                    {isBuyerOrSeller && (
                      <Button
                        onClick={() => navigate(`/appointments/${otherParticipant.id}`)}
                        variant="primary"
                        size="small"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Calendar />
                        Schedule Appointment
                      </Button>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {otherParticipant?.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail />
                        <span style={{ fontSize: '0.875rem' }}>{otherParticipant.email}</span>
                      </div>
                    )}
                    {otherParticipant?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone />
                        <span style={{ fontSize: '0.875rem' }}>{otherParticipant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Show archived status if applicable */}
      {messageChannel?.status === 'archived' && (
        <div style={{ 
          backgroundColor: '#fef9c3', 
          borderLeft: '4px solid #f59e0b', 
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #fde68a' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <div style={{ marginLeft: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#854d0e', margin: 0 }}>
                This conversation has been archived. {messageChannel.archivedReason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        backgroundColor: 'white'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{ 
              display: 'flex', 
              justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start' 
            }}
          >
            <div
              style={{ 
                maxWidth: '70%', 
                borderRadius: '1rem', 
                padding: '0.75rem 1rem',
                backgroundColor: message.senderId === currentUser.uid ? '#2563eb' : '#f3f4f6',
                color: message.senderId === currentUser.uid ? 'white' : '#111827',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
            >
              <p style={{ margin: 0, lineHeight: '1.5' }}>{message.text}</p>
              <p style={{ 
                fontSize: '0.75rem', 
                marginTop: '0.25rem',
                color: message.senderId === currentUser.uid ? '#dbeafe' : '#6b7280',
                margin: '0.25rem 0 0 0'
              }}>
                {message.createdAt?.toDate?.().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) || 'Just now'}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {messageChannel?.status !== 'archived' && (
        <form onSubmit={sendMessage} style={{ 
          backgroundColor: 'white', 
          borderTop: '1px solid #e5e7eb', 
          padding: '1rem 1.5rem',
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ 
                flex: 1, 
                border: '1px solid #d1d5db', 
                borderRadius: '0.5rem', 
                padding: '0.75rem 1rem', 
                outline: 'none',
                fontSize: '0.875rem'
              }}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: 'none',
                cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                opacity: sending || !newMessage.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '3rem'
              }}
            >
              <Send />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MessageChannel;