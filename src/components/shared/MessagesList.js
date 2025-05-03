// src/components/shared/MessagesList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';

const MessagesList = () => {
  const { currentUser, userProfile } = useAuth();
  
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  
  useEffect(() => {
    const fetchChannels = async () => {
      if (!currentUser) {
        setLoading(false);
        setError('You need to log in to view messages');
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching message channels for user:", currentUser.uid);
        
        // Query channels where the current user is a participant
        const channelsQuery = query(
          collection(db, 'messagingChannels'),
          where('participants', 'array-contains', currentUser.uid),
          orderBy('lastMessageAt', 'desc')
        );
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(
          channelsQuery, 
          async (snapshot) => {
            const channelsList = [];
            snapshot.forEach((doc) => {
              channelsList.push({ id: doc.id, ...doc.data() });
            });
            
            console.log(`Retrieved ${channelsList.length} channels`);
            
            // For each channel, query unread messages
            const unreadCountsObj = {};
            
            await Promise.all(channelsList.map(async (channel) => {
              try {
                const messagesQuery = query(
                  collection(db, 'messages'),
                  where('channelId', '==', channel.id),
                  where('senderId', '!=', currentUser.uid),
                  where('isRead', '==', false)
                );
                
                const messagesSnap = await getDocs(messagesQuery);
                unreadCountsObj[channel.id] = messagesSnap.size;
              } catch (err) {
                console.error(`Error getting unread count for channel ${channel.id}:`, err);
                unreadCountsObj[channel.id] = 0;
              }
            }));
            
            setUnreadCounts(unreadCountsObj);
            setChannels(channelsList);
            setLoading(false);
          },
          (err) => {
            console.error('Error in channels listener:', err);
            setError('Error loading message channels');
            setLoading(false);
          }
        );
        
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching message channels:', err);
        setError('Error loading message channels');
        setLoading(false);
      }
    };
    
    fetchChannels();
  }, [currentUser]);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', 
        padding: '4rem 2rem' 
      }}>
        <Spinner size="large" />
        <p style={{ marginTop: '1rem' }}>Loading messages...</p>
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
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        My Messages
      </h1>
      
      {channels.length === 0 ? (
        <Card>
          <CardBody>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1rem',
              color: '#6b7280'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '3rem', marginBottom: '1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                No messages yet
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Accepted proposals will create message channels
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div>
          {channels.map((channel) => {
            const isAgent = currentUser.uid === channel.agentId;
            const otherPersonName = isAgent ? channel.clientName : channel.agentName;
            const hasUnread = unreadCounts[channel.id] > 0;
            
            return (
              <Link 
                key={channel.id} 
                to={`/${isAgent ? 'agent' : channel.listingType}/messages/${channel.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card style={{ 
                  marginBottom: '1rem', 
                  transition: 'all 0.2s ease',
                  boxShadow: hasUnread ? '0 0 0 2px #3b82f6' : 'none',
                  backgroundColor: hasUnread ? '#f0f9ff' : 'white'
                }}>
                  <CardBody style={{ 
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ 
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '9999px',
                      backgroundColor: '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#0369a1" style={{ width: '1.5rem', height: '1.5rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: hasUnread ? 'bold' : 'normal', 
                        marginBottom: '0.25rem'
                      }}>
                        {otherPersonName}
                      </div>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          backgroundColor: '#e0f2fe', 
                          color: '#0369a1', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          marginRight: '0.5rem'
                        }}>
                          {channel.listingType === 'buyer' ? 'Buyer' : 'Seller'} Listing
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {channel.lastMessageAt ? new Date(channel.lastMessageAt.seconds * 1000).toLocaleDateString() : ''}
                        </div>
                        
                        {/* Unread Count Badge */}
                        {unreadCounts[channel.id] > 0 && (
                          <div style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            borderRadius: '9999px',
                            minWidth: '1.5rem',
                            height: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            marginLeft: 'auto'
                          }}>
                            {unreadCounts[channel.id]}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6b7280" style={{ width: '1.25rem', height: '1.25rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesList;