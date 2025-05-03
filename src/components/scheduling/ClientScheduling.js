// src/components/scheduling/ClientScheduling.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const ClientScheduling = () => {
  const { channelId } = useParams();
  const { currentUser } = useAuth();
  
  const [channel, setChannel] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [listing, setListing] = useState(null);
  const [agent, setAgent] = useState(null);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for scheduling
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [schedulingMessage, setSchedulingMessage] = useState('');
  
  useEffect(() => {
    const fetchChannelAndAvailability = async () => {
      try {
        setLoading(true);
        
        // Fetch channel details first
        const channelRef = doc(db, 'messagingChannels', channelId);
        const channelSnap = await getDoc(channelRef);
        
        if (!channelSnap.exists()) {
          setError('Channel not found');
          setLoading(false);
          return;
        }
        
        const channelData = { id: channelSnap.id, ...channelSnap.data() };
        setChannel(channelData);
        
        // Verify the current user is a participant
        if (!channelData.participants.includes(currentUser.uid)) {
          setError('You do not have access to this channel');
          setLoading(false);
          return;
        }
        
        // Fetch proposal details
        const proposalRef = doc(db, 'proposals', channelData.proposalId);
        const proposalSnap = await getDoc(proposalRef);
        
        if (proposalSnap.exists()) {
          const proposalData = { id: proposalSnap.id, ...proposalSnap.data() };
          setProposal(proposalData);
          
          // Fetch agent details
          const agentRef = doc(db, 'users', proposalData.agentId);
          const agentSnap = await getDoc(agentRef);
          
          if (agentSnap.exists()) {
            setAgent({ id: agentSnap.id, ...agentSnap.data() });
            
            // Now fetch agent's availability
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const availabilityQuery = query(
              collection(db, 'agentAvailability'),
              where('agentId', '==', proposalData.agentId),
              where('status', '==', 'available'),
              where('date', '>=', today.toISOString().split('T')[0])
            );
            
            const availabilitySnap = await getDocs(availabilityQuery);
            
            const slots = [];
            availabilitySnap.forEach(doc => {
              slots.push({
                id: doc.id,
                ...doc.data()
              });
            });
            
            // Sort by date and time
            slots.sort((a, b) => {
              if (a.date === b.date) {
                return a.startTime.localeCompare(b.startTime);
              }
              return a.date.localeCompare(b.date);
            });
            
            setAvailabilitySlots(slots);
          }
          
          // Fetch listing details
          const listingRef = doc(
            db, 
            proposalData.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', 
            proposalData.listingId
          );
          
          const listingSnap = await getDoc(listingRef);
          
          if (listingSnap.exists()) {
            setListing({ id: listingSnap.id, ...listingSnap.data() });
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading scheduling data');
      } finally {
        setLoading(false);
      }
    };
    
    if (channelId && currentUser) {
      fetchChannelAndAvailability();
    }
  }, [channelId, currentUser]);
  
  // Handle requesting an appointment
  const handleRequestAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setError('Please select an available time slot');
      return;
    }
    
    try {
      // Create the appointment request
      await addDoc(collection(db, 'appointments'), {
        channelId,
        proposalId: proposal.id,
        agentId: agent.id,
        clientId: currentUser.uid,
        listingId: listing.id,
        listingType: proposal.listingType,
        availabilitySlotId: selectedSlot.id,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        details: appointmentDetails,
        status: 'pending', // pending, confirmed, cancelled, completed
        createdAt: serverTimestamp()
      });
      
      // Add a system message to the chat
      await addDoc(collection(db, 'messages'), {
        channelId,
        senderId: 'system',
        senderName: 'System',
        content: `Appointment requested for ${new Date(selectedSlot.date).toLocaleDateString()} at ${selectedSlot.startTime}. Waiting for agent confirmation.`,
        createdAt: serverTimestamp(),
        isSystemMessage: true,
        isRead: false
      });
      
      // Optional: Add client message if provided
      if (schedulingMessage.trim()) {
        await addDoc(collection(db, 'messages'), {
          channelId,
          senderId: currentUser.uid,
          senderName: currentUser.displayName || 'Client',
          content: schedulingMessage,
          createdAt: serverTimestamp(),
          isSystemMessage: false,
          isRead: false
        });
      }
      
      // Reset form
      setSelectedSlot(null);
      setAppointmentDetails('');
      setSchedulingMessage('');
      
      // Update availability slots (remove the one just booked)
      setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== selectedSlot.id));
      
      // Show success message
      alert('Appointment request sent! The agent will confirm your request soon.');
      
    } catch (err) {
      console.error('Error requesting appointment:', err);
      setError('Failed to request appointment');
    }
  };
  
  // Group slots by date for display
  const groupedSlots = availabilitySlots.reduce((groups, slot) => {
    if (!groups[slot.date]) {
      groups[slot.date] = [];
    }
    groups[slot.date].push(slot);
    return groups;
  }, {});
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading scheduling information...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#fee2e2', 
        color: '#b91c1c', 
        padding: '1rem', 
        borderRadius: '0.375rem', 
        margin: '1rem' 
      }}>
        {error}
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          Schedule a Viewing
        </h3>
      </CardHeader>
      <CardBody>
        {availabilitySlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
            <p>The agent hasn't set any available time slots yet.</p>
            <p style={{ marginTop: '0.5rem' }}>Please check back later or message them directly to arrange a time.</p>
          </div>
        ) : (
          <form onSubmit={handleRequestAppointment}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Select an available time:
              </label>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                {Object.keys(groupedSlots).sort().map(date => (
                  <div key={date} style={{ marginBottom: '1rem' }}>
                    <h4 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.375rem'
                    }}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                    
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '0.5rem',
                      marginLeft: '1rem'
                    }}>
                      {groupedSlots[date].map(slot => (
                        <label 
                          key={slot.id}
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            backgroundColor: selectedSlot?.id === slot.id ? '#dbeafe' : 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="radio"
                            name="timeSlot"
                            checked={selectedSlot?.id === slot.id}
                            onChange={() => setSelectedSlot(slot)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {slot.startTime} - {slot.endTime}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="appointmentDetails"
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Appointment Details:
              </label>
              <textarea
                id="appointmentDetails"
                value={appointmentDetails}
                onChange={(e) => setAppointmentDetails(e.target.value)}
                placeholder="Provide any specific details or requests for this appointment..."
                rows={3}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="schedulingMessage"
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}
              >
                Add a message (optional):
              </label>
              <textarea
                id="schedulingMessage"
                value={schedulingMessage}
                onChange={(e) => setSchedulingMessage(e.target.value)}
                placeholder="Add a message to the agent about this appointment request..."
                rows={2}
                style={{ 
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <Button type="submit" disabled={!selectedSlot}>
              Request Appointment
            </Button>
          </form>
        )}
      </CardBody>
    </Card>
  );
};

export default ClientScheduling;