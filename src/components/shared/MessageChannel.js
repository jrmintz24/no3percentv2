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
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import ClientScheduling from '../scheduling/ClientScheduling';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';

const MessageChannel = () => {
  const { channelId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [fetchingStatus, setFetchingStatus] = useState({
    channel: 'idle',
    proposal: 'idle',
    listing: 'idle',
    messages: 'idle'
  });
  
  // New states for enhanced features
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserId, setOtherUserId] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const fetchChannelDetails = async () => {
      if (!channelId || !currentUser) {
        console.error("Missing channel ID or user is not authenticated");
        setError('Invalid message channel or you need to log in');
        setLoading(false);
        return;
      }
      
      try {
        // Set fetching status
        setFetchingStatus(prev => ({ ...prev, channel: 'loading' }));
        console.log("Fetching channel details for ID:", channelId);
        
        // Fetch channel information
        const channelRef = doc(db, 'messagingChannels', channelId);
        const channelSnap = await getDoc(channelRef);
        
        if (!channelSnap.exists()) {
          console.error("Channel doesn't exist:", channelId);
          setError('Message channel not found');
          setLoading(false);
          setFetchingStatus(prev => ({ ...prev, channel: 'error' }));
          return;
        }
        
        const channelData = { id: channelSnap.id, ...channelSnap.data() };
        console.log("Channel data retrieved:", channelData);
        setChannel(channelData);
        setFetchingStatus(prev => ({ ...prev, channel: 'success' }));
        
        // Verify the current user is a participant
        if (!channelData.participants || !channelData.participants.includes(currentUser.uid)) {
          console.error("User not in channel participants:", currentUser.uid, channelData.participants);
          setError('You do not have access to this message channel');
          setLoading(false);
          return;
        }
        
        // Set the other user's ID for typing indicators
        const otherUser = channelData.participants.find(uid => uid !== currentUser.uid);
        setOtherUserId(otherUser);
        
        // Set fetching status for proposal
        setFetchingStatus(prev => ({ ...prev, proposal: 'loading' }));
        
        // Fetch the proposal
        if (channelData.proposalId) {
          const proposalRef = doc(db, 'proposals', channelData.proposalId);
          const proposalSnap = await getDoc(proposalRef);
          
          if (proposalSnap.exists()) {
            const proposalData = { id: proposalSnap.id, ...proposalSnap.data() };
            console.log("Proposal data retrieved:", proposalData);
            setProposal(proposalData);
            setFetchingStatus(prev => ({ ...prev, proposal: 'success' }));
            
            // Set fetching status for listing
            setFetchingStatus(prev => ({ ...prev, listing: 'loading' }));
            
            // Fetch the listing
            if (proposalData.listingId) {
              const collectionName = proposalData.listingType === 'buyer' ? 'buyerListings' : 'sellerListings';
              const listingRef = doc(db, collectionName, proposalData.listingId);
              const listingSnap = await getDoc(listingRef);
              
              if (listingSnap.exists()) {
                const listingData = { id: listingSnap.id, ...listingSnap.data() };
                console.log("Listing data retrieved:", listingData);
                setListing(listingData);
                setFetchingStatus(prev => ({ ...prev, listing: 'success' }));
              } else {
                console.warn("Listing not found:", proposalData.listingId);
                setFetchingStatus(prev => ({ ...prev, listing: 'error' }));
              }
            } else {
              console.warn("No listing ID in proposal");
              setFetchingStatus(prev => ({ ...prev, listing: 'error' }));
            }
          } else {
            console.warn("Proposal not found:", channelData.proposalId);
            setFetchingStatus(prev => ({ ...prev, proposal: 'error' }));
          }
        } else {
          console.warn("No proposal ID in channel");
          setFetchingStatus(prev => ({ ...prev, proposal: 'error' }));
        }
        
        // Set fetching status for messages
        setFetchingStatus(prev => ({ ...prev, messages: 'loading' }));
        
        // Set up real-time listener for messages
        const messagesQuery = query(
          collection(db, 'messages'),
          where('channelId', '==', channelId),
          orderBy('createdAt', 'asc')
        );
        
        console.log("Setting up messages listener");
        const unsubscribe = onSnapshot(
          messagesQuery, 
          (snapshot) => {
            const messagesList = [];
            snapshot.forEach((doc) => {
              messagesList.push({ id: doc.id, ...doc.data() });
            });
            console.log(`Retrieved ${messagesList.length} messages`);
            setMessages(messagesList);
            setFetchingStatus(prev => ({ ...prev, messages: 'success' }));
            setLoading(false);
          },
          (err) => {
            console.error("Error in messages listener:", err);
            if (err.message && err.message.includes("requires an index")) {
              setError(
                "The messaging system is being set up. This may take a few minutes. " +
                "Please click the link in the console to create the required index, then refresh this page."
              );
            } else {
              setError(`Error loading messages: ${err.message}`);
            }
            setFetchingStatus(prev => ({ ...prev, messages: 'error' }));
            setLoading(false);
          }
        );
        
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching channel details:', err);
        setError(`Error loading message channel: ${err.message}`);
        setLoading(false);
      }
    };
    
    if (channelId && currentUser) {
      fetchChannelDetails();
    } else {
      setLoading(false);
      setError('Invalid channel or you need to log in');
    }
  }, [channelId, currentUser]);
  
  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!channelId || !currentUser || messages.length === 0) return;
      
      try {
        const unreadMessages = messages.filter(
          msg => msg.senderId !== currentUser.uid && !msg.isRead
        );
        
        // Update each unread message
        const updatePromises = unreadMessages.map(msg => 
          updateDoc(doc(db, 'messages', msg.id), { isRead: true })
        );
        
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
          console.log(`Marked ${updatePromises.length} messages as read`);
        }
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    };
    
    // Call the function when messages change or component mounts
    markMessagesAsRead();
  }, [messages, channelId, currentUser]);
  
  // Set up listener for typing status
  useEffect(() => {
    if (!channelId || !otherUserId) return;
    
    // Set up listener for typing status
    const typingRef = doc(db, 'typingStatus', channelId);
    const unsubscribe = onSnapshot(typingRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Check if the other user is typing
        if (data[otherUserId] && data[otherUserId].isTyping) {
          setOtherUserTyping(true);
          
          // Auto-clear typing status after 5 seconds of inactivity
          const lastTyped = data[otherUserId].lastTyped;
          if (lastTyped) {
            const now = new Date().getTime();
            const timeSinceLastTyped = now - lastTyped.toMillis();
            if (timeSinceLastTyped > 5000) {
              setOtherUserTyping(false);
            }
          }
        } else {
          setOtherUserTyping(false);
        }
      }
    });
    
    return () => unsubscribe();
  }, [channelId, otherUserId]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Clear typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  const handleMessageChange = (e) => {
    const message = e.target.value;
    setNewMessage(message);
    
    // Update typing status
    if (message.length > 0 && !isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    } else if (message.length === 0 && isTyping) {
      setIsTyping(false);
      updateTypingStatus(false);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a timeout to clear typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        updateTypingStatus(false);
      }
    }, 2000);
  };
  
  const updateTypingStatus = async (isTyping) => {
    try {
      const typingRef = doc(db, 'typingStatus', channelId);
      
      // Get the document first
      const typingDoc = await getDoc(typingRef);
      
      if (typingDoc.exists()) {
        // Update existing document
        await updateDoc(typingRef, {
          [currentUser.uid]: {
            isTyping,
            lastTyped: serverTimestamp()
          }
        });
      } else {
        // Create new document
        await setDoc(typingRef, {
          [currentUser.uid]: {
            isTyping,
            lastTyped: serverTimestamp()
          }
        });
      }
    } catch (err) {
      console.error('Error updating typing status:', err);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      console.log("Sending message to channel:", channelId);
      
      // Add message to Firestore
      await addDoc(collection(db, 'messages'), {
        channelId,
        senderId: currentUser.uid,
        senderName: userProfile?.displayName || 'User',
        content: newMessage,
        createdAt: serverTimestamp(),
        isSystemMessage: false,
        isRead: false
      });
      
      // Update channel's lastMessageAt
      const channelRef = doc(db, 'messagingChannels', channelId);
      await updateDoc(channelRef, {
        lastMessageAt: serverTimestamp()
      });
      
      console.log("Message sent successfully");
      
      // Clear input and typing status
      setNewMessage('');
      setIsTyping(false);
      updateTypingStatus(false);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Error sending message. Please try again.');
    }
  };
  
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      setFileUpload(file);
    }
  };
  
  const handleFileUpload = async () => {
    if (!fileUpload) return;
    
    try {
      setIsUploading(true);
      
      // Create storage reference
      const fileRef = ref(storage, `message_attachments/${channelId}/${Date.now()}_${fileUpload.name}`);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(fileRef, fileUpload);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
          setIsUploading(false);
        },
        async () => {
          // Upload completed
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Send message with file attachment
          await addDoc(collection(db, 'messages'), {
            channelId,
            senderId: currentUser.uid,
            senderName: userProfile?.displayName || 'User',
            content: newMessage || 'Sent an attachment',
            fileURL: downloadURL,
            fileName: fileUpload.name,
            fileType: fileUpload.type,
            createdAt: serverTimestamp(),
            isSystemMessage: false,
            isRead: false
          });
          
          // Update channel's lastMessageAt
          const channelRef = doc(db, 'messagingChannels', channelId);
          await updateDoc(channelRef, {
            lastMessageAt: serverTimestamp()
          });
          
          // Clear states
          setFileUpload(null);
          setUploadProgress(0);
          setIsUploading(false);
          setNewMessage('');
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      );
    } catch (err) {
      console.error('Error handling file upload:', err);
      alert('Error uploading file. Please try again.');
      setIsUploading(false);
    }
  };
  
  // Custom loading component with more debug info
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        padding: '4rem 2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <Spinner size="large" />
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>Loading messages...</p>
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.8rem', 
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <p>Channel ID: {channelId || 'Not available'}</p>
          <p>Status: 
            {fetchingStatus.channel === 'loading' && ' Loading channel...'}
            {fetchingStatus.channel === 'success' && ' Channel loaded'}
            {fetchingStatus.proposal === 'loading' && ' Loading proposal...'}
            {fetchingStatus.proposal === 'success' && ' Proposal loaded'}
            {fetchingStatus.listing === 'loading' && ' Loading listing...'}
            {fetchingStatus.listing === 'success' && ' Listing loaded'}
            {fetchingStatus.messages === 'loading' && ' Loading messages...'}
            {fetchingStatus.messages === 'success' && ' Messages loaded'}
          </p>
        </div>
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
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
        <div style={{ marginTop: '1rem' }}>
          <Button to={`/${userProfile?.userType || 'buyer'}/messages`}>
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }
  
  const isAgent = userProfile?.userType === 'agent';
  const otherUserName = isAgent ? channel?.clientName : channel?.agentName;
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Button to={`/${userProfile?.userType || 'buyer'}/messages`} variant="secondary">
          Back to Messages
        </Button>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Conversation with {otherUserName || 'User'}
        </h1>
        
        <Button 
          to={`/${userProfile?.userType || 'buyer'}/appointments`}
          variant="secondary"
        >
          View Appointments
        </Button>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '2rem'
      }}>
        <div>
          <Card>
            <CardHeader>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Messages
              </h2>
            </CardHeader>
            <CardBody style={{ padding: 0 }}>
              <div style={{ 
                height: '500px',
                overflowY: 'auto',
                padding: '1rem'
              }}>
                {messages.length === 0 ? (
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#6b7280'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', marginBottom: '1rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p>No messages yet</p>
                    <p style={{ fontSize: '0.875rem' }}>Send the first message to start the conversation</p>
                  </div>
                ) : (
                  <div>
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        style={{ 
                          marginBottom: '1rem',
                          display: 'flex',
                          flexDirection: message.senderId === currentUser.uid ? 'row-reverse' : 'row'
                        }}
                      >
                        {message.isSystemMessage ? (
                          <div style={{ 
                            width: '100%',
                            backgroundColor: '#f3f4f6',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            color: '#6b7280'
                          }}>
                            {message.content}
                          </div>
                        ) : (
                          <div style={{ 
                            maxWidth: '70%',
                            backgroundColor: message.senderId === currentUser.uid ? '#dbeafe' : '#f3f4f6',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            position: 'relative'
                          }}>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: '500', 
                              marginBottom: '0.25rem',
                              color: message.senderId === currentUser.uid ? '#1e40af' : '#4b5563'
                            }}>
                              {message.senderId === currentUser.uid ? 'You' : message.senderName}
                            </div>
                            <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
                            
                            {/* File Attachment Display */}
                            {message.fileURL && (
                              <div style={{ marginTop: '0.5rem' }}>
                                {message.fileType && message.fileType.startsWith('image/') ? (
                                  <img 
                                    src={message.fileURL} 
                                    alt={message.fileName || 'Image'} 
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '300px', 
                                      borderRadius: '0.25rem',
                                      cursor: 'pointer' 
                                    }}
                                    onClick={() => window.open(message.fileURL, '_blank')}
                                  />
                                ) : (
                                  <a 
                                    href={message.fileURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '0.5rem',
                                      backgroundColor: '#f9fafb',
                                      borderRadius: '0.25rem',
                                      textDecoration: 'none',
                                      color: '#2563eb'
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    {message.fileName || 'Download File'}
                                  </a>
                                )}
                              </div>
                            )}
                            
                            {/* Message Timestamp and Read Status */}
                            <div style={{ 
                              fontSize: '0.675rem', 
                              color: '#6b7280', 
                              marginTop: '0.25rem',
                              textAlign: 'right',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end'
                            }}>
                              <span style={{ marginRight: '0.25rem' }}>
                                {message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                              
                              {/* Read Receipt */}
                              {message.senderId === currentUser.uid && (
                                message.isRead ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4b5563" style={{ width: '0.875rem', height: '0.875rem', marginLeft: '0.125rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4b5563" style={{ width: '0.875rem', height: '0.875rem', marginLeft: '0.125rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Typing Indicator */}
              {otherUserTyping && (
                <div style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  {otherUserName} is typing...
                </div>
              )}
              
              {/* Message Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (fileUpload) {
                    handleFileUpload();
                  } else if (newMessage.trim()) {
                    handleSendMessage(e);
                  }
                }}
                style={{ 
                  padding: '1rem',
                  borderTop: otherUserTyping ? 'none' : '1px solid #e5e7eb'
                }}
              >
                {/* File Upload Preview */}
                {fileUpload && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{fileUpload.name}</div>
                      {isUploading && (
                        <div style={{ 
                          width: '100%', 
                          height: '0.25rem', 
                          backgroundColor: '#e5e7eb',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          marginTop: '0.25rem'
                        }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              backgroundColor: '#2563eb',
                              width: `${uploadProgress}%`,
                              transition: 'width 0.3s ease'
                            }} 
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileUpload(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6b7280',
                        cursor: 'pointer'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  {/* File Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                      accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    />
                  </button>
                  
                  {/* Message Input */}
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder="Type your message here..."
                    style={{ 
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                    disabled={isUploading}
                  />
                  
                  {/* Send Button */}
                  <Button 
                    type="submit"
                    disabled={isUploading || (!newMessage.trim() && !fileUpload)}
                  >
                    {isUploading ? 'Uploading...' : 'Send'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
        
        <div>
          <Card style={{ marginBottom: '1rem' }}>
            <CardHeader>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                {isAgent ? 'Client Info' : 'Agent Info'}
              </h2>
            </CardHeader>
            <CardBody>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '9999px',
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0369a1" style={{ width: '2rem', height: '2rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 016 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div style={{ fontWeight: 'bold' }}>{otherUserName || 'User'}</div>
              </div>
              
              {proposal && (
                <div style={{ 
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1rem'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                    Proposal Status:
                  </p>
                  <div style={{ 
                    backgroundColor: '#dcfce7', 
                    color: '#15803d', 
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    fontWeight: '500',
                    marginBottom: '1rem'
                  }}>
                    {proposal.status || 'Accepted'}
                  </div>
                  
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                    Property:
                  </p>
                  <p style={{ margin: '0 0 1rem 0' }}>
                    {listing?.propertyName || listing?.title || 
                      (listing?.address ? listing.address : 
                        (listing?.location ? `Property in ${listing.location}` : 'Property Listing'))}
                  </p>
                  
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                    {proposal?.feeStructure === 'percentage' ? 'Commission Rate:' : 'Flat Fee:'}
                  </p>
                  <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: '#2563eb' }}>
                    {proposal?.feeStructure === 'percentage' ? proposal?.commissionRate : proposal?.flatFee}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
          
          {proposal && (
            <Card>
              <CardHeader>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                  Services Included
                </h2>
              </CardHeader>
              <CardBody>
                {proposal?.services && proposal.services.length > 0 ? (
                  <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1rem 0' }}>
                    {proposal.services.map((service, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific services listed</p>
                )}
                
                {proposal?.additionalServices && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Additional Services:
                    </h3>
                    <p>{proposal.additionalServices}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
          
          {/* Only show scheduling for clients, not agents */}
          {!isAgent && proposal?.status === 'Accepted' && (
            <div style={{ marginTop: '1rem' }}>
              <ClientScheduling />
            </div>
          )}
          
          {/* For agents, show a link to manage availability */}
          {isAgent && (
            <div style={{ marginTop: '1rem' }}>
              <Button to="/agent/availability" fullWidth>
                Manage Availability
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageChannel;