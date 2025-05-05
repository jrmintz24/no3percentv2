// src/components/transaction/TransactionMessages.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Card, CardBody } from '../common/Card';

const TransactionMessages = ({ transactionId, participants }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transactionId) return;

    const messagesQuery = query(
      collection(db, 'transactionMessages'),
      where('transactionId', '==', transactionId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
    });

    return () => unsubscribe();
  }, [transactionId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    try {
      setLoading(true);
      
      await addDoc(collection(db, 'transactionMessages'), {
        transactionId,
        content: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        createdAt: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        Transaction Messages
      </h2>

      <Card>
        <CardBody>
          {/* Messages container */}
          <div style={{
            height: '400px',
            overflowY: 'auto',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem'
          }}>
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div style={{
                  textAlign: 'center',
                  margin: '1rem 0'
                }}>
                  <span style={{
                    backgroundColor: '#e5e7eb',
                    color: '#6b7280',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem'
                  }}>
                    {date}
                  </span>
                </div>
                
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.senderId === currentUser.uid ? 'flex-end' : 'flex-start',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      backgroundColor: message.senderId === currentUser.uid ? '#2563eb' : '#ffffff',
                      color: message.senderId === currentUser.uid ? '#ffffff' : '#111827',
                      border: message.senderId === currentUser.uid ? 'none' : '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        fontSize: '0.75rem',
                        marginBottom: '0.25rem',
                        color: message.senderId === currentUser.uid ? '#dbeafe' : '#6b7280'
                      }}>
                        {message.senderName} · {formatMessageTime(message.createdAt)}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                padding: '2rem'
              }}>
                No messages yet. Start the conversation!
              </div>
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !newMessage.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default TransactionMessages;