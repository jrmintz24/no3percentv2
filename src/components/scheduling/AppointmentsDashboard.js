// src/components/scheduling/AppointmentsDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const AppointmentsDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const isAgent = userProfile?.userType === 'agent';
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        if (!currentUser) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        // Query appointments based on user type
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where(isAgent ? 'agentId' : 'clientId', '==', currentUser.uid)
        );
        
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        const appointmentsData = [];
        const detailsPromises = [];
        
        appointmentsSnapshot.forEach(doc => {
          const appointment = { id: doc.id, ...doc.data() };
          appointmentsData.push(appointment);
          
          // Get other party's details
          const userRef = isAgent 
            ? getDoc(doc(db, 'users', appointment.clientId))
            : getDoc(doc(db, 'users', appointment.agentId));
          
          detailsPromises.push(userRef.then(userSnap => {
            if (userSnap.exists()) {
              appointment.otherParty = {
                id: userSnap.id,
                ...userSnap.data()
              };
            }
            
            // Get listing details
            return getDoc(doc(
              db, 
              appointment.listingType === 'buyer' ? 'buyerListings' : 'sellerListings', 
              appointment.listingId
            )).then(listingSnap => {
              if (listingSnap.exists()) {
                appointment.listing = {
                  id: listingSnap.id,
                  ...listingSnap.data()
                };
              }
            });
          }));
        });
        
        // Wait for all promises to resolve
        await Promise.all(detailsPromises);
        
        // Sort by date and time
        appointmentsData.sort((a, b) => {
          if (a.date === b.date) {
            return a.startTime.localeCompare(b.startTime);
          }
          return a.date.localeCompare(b.date);
        });
        
        setAppointments(appointmentsData);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Error loading appointments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentUser, isAgent]);
  
  // Handle appointment actions (confirm, cancel, reschedule)
  const handleAppointmentAction = async (appointmentId, action, message = '') => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      
      if (action === 'confirm') {
        await updateDoc(appointmentRef, {
          status: 'confirmed',
          confirmedAt: serverTimestamp()
        });
        
        // Add system message to the chat
        if (appointments.find(a => a.id === appointmentId)?.channelId) {
          await addDoc(collection(db, 'messages'), {
            channelId: appointments.find(a => a.id === appointmentId).channelId,
            senderId: 'system',
            senderName: 'System',
            content: `Appointment confirmed for ${new Date(appointments.find(a => a.id === appointmentId).date).toLocaleDateString()} at ${appointments.find(a => a.id === appointmentId).startTime}.`,
            createdAt: serverTimestamp(),
            isSystemMessage: true,
            isRead: false
          });
          
          // Add custom message if provided
          if (message.trim()) {
            await addDoc(collection(db, 'messages'), {
              channelId: appointments.find(a => a.id === appointmentId).channelId,
              senderId: currentUser.uid,
              senderName: userProfile?.displayName || 'User',
              content: message,
              createdAt: serverTimestamp(),
              isSystemMessage: false,
              isRead: false
            });
          }
        }
        
        // Update local state
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'confirmed' } 
            : appointment
        ));
        
        alert('Appointment confirmed!');
      } else if (action === 'cancel') {
        await updateDoc(appointmentRef, {
          status: 'cancelled',
          cancelledAt: serverTimestamp(),
          cancellationReason: message || 'No reason provided'
        });
        
        // Add system message to the chat
        if (appointments.find(a => a.id === appointmentId)?.channelId) {
          await addDoc(collection(db, 'messages'), {
            channelId: appointments.find(a => a.id === appointmentId).channelId,
            senderId: 'system',
            senderName: 'System',
            content: `Appointment for ${new Date(appointments.find(a => a.id === appointmentId).date).toLocaleDateString()} at ${appointments.find(a => a.id === appointmentId).startTime} has been cancelled.`,
            createdAt: serverTimestamp(),
            isSystemMessage: true,
            isRead: false
          });
          
          // Add custom message if provided
          if (message.trim()) {
            await addDoc(collection(db, 'messages'), {
              channelId: appointments.find(a => a.id === appointmentId).channelId,
              senderId: currentUser.uid,
              senderName: userProfile?.displayName || 'User',
              content: `Cancellation reason: ${message}`,
              createdAt: serverTimestamp(),
              isSystemMessage: false,
              isRead: false
            });
          }
        }
        
        // Update local state
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        ));
        
        alert('Appointment cancelled.');
      } else if (action === 'complete') {
        await updateDoc(appointmentRef, {
          status: 'completed',
          completedAt: serverTimestamp()
        });
        
        // Add system message to the chat
        if (appointments.find(a => a.id === appointmentId)?.channelId) {
          await addDoc(collection(db, 'messages'), {
            channelId: appointments.find(a => a.id === appointmentId).channelId,
            senderId: 'system',
            senderName: 'System',
            content: `Appointment for ${new Date(appointments.find(a => a.id === appointmentId).date).toLocaleDateString()} at ${appointments.find(a => a.id === appointmentId).startTime} has been marked as completed.`,
            createdAt: serverTimestamp(),
            isSystemMessage: true,
            isRead: false
          });
          
          // Add notes if provided
          if (message.trim()) {
            await addDoc(collection(db, 'messages'), {
              channelId: appointments.find(a => a.id === appointmentId).channelId,
              senderId: currentUser.uid,
              senderName: userProfile?.displayName || 'User',
              content: `Appointment notes: ${message}`,
              createdAt: serverTimestamp(),
              isSystemMessage: false,
              isRead: false
            });
          }
        }
        
        // Update local state
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'completed' } 
            : appointment
        ));
        
        alert('Appointment marked as completed!');
      }
    } catch (err) {
      console.error(`Error ${action}ing appointment:`, err);
      setError(`Failed to ${action} appointment`);
    }
  };
  
  // Group appointments by date (upcoming and past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= today && appointment.status !== 'cancelled';
  });
  
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate < today || appointment.status === 'cancelled';
  });
  
  // Get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'pending':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#b91c1c' };
      case 'completed':
        return { bg: '#f3f4f6', text: '#4b5563' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Appointments
        </h1>
        
        {isAgent && (
          <Button to="/agent/availability">
            Manage Availability
          </Button>
        )}
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '3rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            You don't have any appointments yet
          </h2>
          <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
            {isAgent 
              ? 'When clients request appointments, they will appear here.' 
              : 'Request an appointment with your agent to schedule a viewing.'}
          </p>
          {!isAgent && (
            <Button to={`/${userProfile?.userType}/messages`}>
              Message Your Agent
            </Button>
          )}
        </div>
      ) : (
        <div>
          {upcomingAppointments.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Upcoming Appointments
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                {upcomingAppointments.map(appointment => (
                  <Card key={appointment.id} style={{ marginBottom: '1rem' }}>
                    <CardBody>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {new Date(appointment.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            <span style={{ marginLeft: '0.5rem', fontWeight: 'normal' }}>
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                          </h3>
                          <p style={{ marginBottom: '0.5rem' }}>
                            With {appointment.otherParty?.displayName || 'Unknown'} 
                            {isAgent 
                              ? ` (${appointment.listingType === 'buyer' ? 'Buyer' : 'Seller'})` 
                              : ' (Agent)'}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {appointment.listingType === 'buyer'
                              ? (appointment.listing?.title || 'Property Search')
                              : (appointment.listing?.propertyName || 'Property Listing')}
                            {appointment.listing && (
                              <span> • {appointment.listingType === 'buyer'
                                ? (appointment.listing.location || 'Location not specified')
                                : (appointment.listing.address || 'Address not specified')}
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: getStatusStyle(appointment.status).bg,
                          color: getStatusStyle(appointment.status).text
                        }}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                      
                      {appointment.details && (
                        <div style={{ 
                          padding: '0.75rem', 
                          backgroundColor: '#f9fafb', 
                          borderRadius: '0.375rem',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.875rem' }}>
                            <span style={{ fontWeight: '500' }}>Appointment details:</span> {appointment.details}
                          </p>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {appointment.status === 'pending' && isAgent && (
                          <>
                            <Button 
                              onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                              size="small"
                            >
                              Confirm
                            </Button>
                            <Button 
                              onClick={() => {
                                const reason = prompt('Please provide a reason for cancellation:');
                                if (reason !== null) {
                                  handleAppointmentAction(appointment.id, 'cancel', reason);
                                }
                              }}
                              variant="danger"
                              size="small"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <>
                            {isAgent && (
                              <Button 
                                onClick={() => {
                                  const notes = prompt('Add notes about this completed appointment (optional):');
                                  handleAppointmentAction(appointment.id, 'complete', notes || '');
                                }}
                                size="small"
                              >
                                Mark Complete
                              </Button>
                            )}
                            <Button 
                              onClick={() => {
                                const reason = prompt('Please provide a reason for cancellation:');
                                if (reason !== null) {
                                  handleAppointmentAction(appointment.id, 'cancel', reason);
                                }
                              }}
                              variant="danger"
                              size="small"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        
                        <Button
                          to={`/${userProfile?.userType}/messages/${appointment.channelId}`}
                          variant="secondary"
                          size="small"
                        >
                          Message
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {pastAppointments.length > 0 && (
            <>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                marginTop: '2rem'
              }}>
                Past Appointments
              </h2>
              
              <div>
                {pastAppointments.map(appointment => (
                  <Card key={appointment.id} style={{ marginBottom: '1rem' }}>
                    <CardBody>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {new Date(appointment.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            <span style={{ marginLeft: '0.5rem', fontWeight: 'normal' }}>
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                          </h3>
                          <p style={{ marginBottom: '0.5rem' }}>
                            With {appointment.otherParty?.displayName || 'Unknown'} 
                            {isAgent 
                              ? ` (${appointment.listingType === 'buyer' ? 'Buyer' : 'Seller'})` 
                              : ' (Agent)'}
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {appointment.listingType === 'buyer'
                              ? (appointment.listing?.title || 'Property Search')
                              : (appointment.listing?.propertyName || 'Property Listing')}
                            {appointment.listing && (
                              <span> • {appointment.listingType === 'buyer'
                                ? (appointment.listing.location || 'Location not specified')
                                : (appointment.listing.address || 'Address not specified')}
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: getStatusStyle(appointment.status).bg,
                          color: getStatusStyle(appointment.status).text
                        }}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          to={`/${userProfile?.userType}/messages/${appointment.channelId}`}
                          variant="secondary"
                          size="small"
                        >
                          View Conversation
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsDashboard;