// src/components/scheduling/AgentAvailabilityCalendar.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { formatDate, isPastDate } from '../../utils/dateUtils';

const AgentAvailabilityCalendar = () => {
  const { currentUser } = useAuth();
  
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  
  // State for adding new availability
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [recurringUntilDate, setRecurringUntilDate] = useState('');
  const [viewingPastDates, setViewingPastDates] = useState(false);
  
  // Get min date (today) for date picker
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Set default recurring until date (3 months from now)
  useEffect(() => {
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    setRecurringUntilDate(threeMonthsLater.toISOString().split('T')[0]);
  }, []);
  
  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  // Set up default availability for agent (8am-6pm, 7 days a week)
  const setupDefaultAvailability = async () => {
    try {
      // Generate slots for the next 3 months
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      
      const dateArray = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Create batch to add all slots at once
      const batch = [];
      
      for (const date of dateArray) {
        const dateString = date.toISOString().split('T')[0];
        
        batch.push(
          addDoc(collection(db, 'agentAvailability'), {
            agentId: currentUser.uid,
            date: dateString,
            startTime: '08:00',
            endTime: '18:00',
            isRecurring: false,
            createdAt: serverTimestamp(),
            status: 'available', // available, booked, or blocked
          })
        );
      }
      
      // Execute all additions
      await Promise.all(batch);
      
      // Fetch the newly added availability slots
      const availabilityQuery = query(
        collection(db, 'agentAvailability'),
        where('agentId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(availabilityQuery);
      
      const slots = [];
      snapshot.forEach(doc => {
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
      setInitialSetupComplete(true);
      setSuccess('Default availability has been set up successfully.');
    } catch (err) {
      console.error('Error setting up default availability:', err);
      setError('Failed to set up default availability. Please try again.');
    }
  };
  
  // Fetch agent's availability slots
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        const availabilityQuery = query(
          collection(db, 'agentAvailability'),
          where('agentId', '==', currentUser.uid)
        );
        
        const snapshot = await getDocs(availabilityQuery);
        
        // If no availability slots exist, set up default ones
        if (snapshot.empty && !initialSetupComplete) {
          await setupDefaultAvailability();
        } else {
          const slots = [];
          snapshot.forEach(doc => {
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
          setInitialSetupComplete(true);
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError('Failed to load availability slots');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [currentUser, initialSetupComplete]);
  
  // Handle adding new availability
  const handleAddAvailability = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !startTime || !endTime) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }
    
    try {
      if (isRecurring) {
        // Check if at least one day is selected for recurring
        const hasSelectedDay = Object.values(recurringDays).some(day => day);
        if (!hasSelectedDay) {
          setError('Please select at least one day of the week for recurring availability');
          return;
        }
        
        // Generate recurring slots
        const startDate = new Date(selectedDate);
        const endDate = new Date(recurringUntilDate);
        
        // Generate array of dates between start and end
        const dates = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          
          if (recurringDays[dayNames[dayOfWeek]]) {
            dates.push(new Date(currentDate));
          }
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Create availability for each date
        for (const date of dates) {
          const dateString = date.toISOString().split('T')[0];
          
          // Check if there's an existing slot with the same date and overlapping time
          const existingSlot = availabilitySlots.find(
            slot => slot.date === dateString && 
              ((startTime >= slot.startTime && startTime < slot.endTime) ||
               (endTime > slot.startTime && endTime <= slot.endTime) ||
               (startTime <= slot.startTime && endTime >= slot.endTime))
          );
          
          if (existingSlot && existingSlot.status === 'available') {
            // If there's an existing slot with the same date and time, update it
            await updateDoc(doc(db, 'agentAvailability', existingSlot.id), {
              startTime: startTime < existingSlot.startTime ? startTime : existingSlot.startTime,
              endTime: endTime > existingSlot.endTime ? endTime : existingSlot.endTime,
              isRecurring: true,
              lastUpdated: serverTimestamp(),
            });
          } else if (!existingSlot || existingSlot.status !== 'booked') {
            // If there's no existing slot or it's not booked, create a new one
            await addDoc(collection(db, 'agentAvailability'), {
              agentId: currentUser.uid,
              date: dateString,
              startTime,
              endTime,
              isRecurring: true,
              createdAt: serverTimestamp(),
              status: 'available', // available, booked, or blocked
            });
          }
        }
        
        setSuccess(`Recurring availability added from ${new Date(selectedDate).toLocaleDateString()} to ${new Date(recurringUntilDate).toLocaleDateString()}`);
      } else {
        // Check if there's an existing slot with the same date and overlapping time
        const existingSlot = availabilitySlots.find(
          slot => slot.date === selectedDate && 
            ((startTime >= slot.startTime && startTime < slot.endTime) ||
             (endTime > slot.startTime && endTime <= slot.endTime) ||
             (startTime <= slot.startTime && endTime >= slot.endTime))
        );
        
        if (existingSlot && existingSlot.status === 'available') {
          // If there's an existing slot with the same date and time, update it
          await updateDoc(doc(db, 'agentAvailability', existingSlot.id), {
            startTime: startTime < existingSlot.startTime ? startTime : existingSlot.startTime,
            endTime: endTime > existingSlot.endTime ? endTime : existingSlot.endTime,
            lastUpdated: serverTimestamp(),
          });
          
          setSuccess(`Availability updated for ${new Date(selectedDate).toLocaleDateString()}`);
        } else if (!existingSlot || existingSlot.status !== 'booked') {
          // If there's no existing slot or it's not booked, create a new one
          await addDoc(collection(db, 'agentAvailability'), {
            agentId: currentUser.uid,
            date: selectedDate,
            startTime,
            endTime,
            isRecurring: false,
            createdAt: serverTimestamp(),
            status: 'available',
          });
          
          setSuccess(`Availability added for ${new Date(selectedDate).toLocaleDateString()}`);
        } else {
          setError('Cannot modify a booked slot. Please choose a different time or date.');
          return;
        }
      }
      
      // Reset form
      setSelectedDate('');
      setStartTime('08:00');
      setEndTime('18:00');
      setIsRecurring(false);
      setRecurringDays({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      });
      
      // Refresh availability slots
      const availabilityQuery = query(
        collection(db, 'agentAvailability'),
        where('agentId', '==', currentUser.uid)
      );
      
      const snapshot = await getDocs(availabilityQuery);
      
      const slots = [];
      snapshot.forEach(doc => {
        slots.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      slots.sort((a, b) => {
        if (a.date === b.date) {
          return a.startTime.localeCompare(b.startTime);
        }
        return a.date.localeCompare(b.date);
      });
      
      setAvailabilitySlots(slots);
      setError('');
      
    } catch (err) {
      console.error('Error adding availability:', err);
      setError('Failed to add availability slot');
    }
  };
  
  // Handle deleting availability
  const handleDeleteAvailability = async (slotId) => {
    try {
      await deleteDoc(doc(db, 'agentAvailability', slotId));
      
      // Update local state
      setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== slotId));
      setSuccess('Availability slot deleted successfully');
    } catch (err) {
      console.error('Error deleting availability:', err);
      setError('Failed to delete availability slot');
    }
  };
  
  // Handle blocking availability
  const handleBlockAvailability = async (slotId) => {
    try {
      await updateDoc(doc(db, 'agentAvailability', slotId), {
        status: 'blocked',
        lastUpdated: serverTimestamp(),
      });
      
      // Update local state
      setAvailabilitySlots(
        availabilitySlots.map(slot => 
          slot.id === slotId ? { ...slot, status: 'blocked' } : slot
        )
      );
      
      setSuccess('Availability slot blocked successfully');
    } catch (err) {
      console.error('Error blocking availability:', err);
      setError('Failed to block availability slot');
    }
  };
  
  // Handle unblocking availability
  const handleUnblockAvailability = async (slotId) => {
    try {
      await updateDoc(doc(db, 'agentAvailability', slotId), {
        status: 'available',
        lastUpdated: serverTimestamp(),
      });
      
      // Update local state
      setAvailabilitySlots(
        availabilitySlots.map(slot => 
          slot.id === slotId ? { ...slot, status: 'available' } : slot
        )
      );
      
      setSuccess('Availability slot unblocked successfully');
    } catch (err) {
      console.error('Error unblocking availability:', err);
      setError('Failed to unblock availability slot');
    }
  };
  
  // Get filtered slots based on date
  const getFilteredSlots = () => {
    if (viewingPastDates) {
      return availabilitySlots;
    }
    
    // Filter out past dates
    return availabilitySlots.filter(slot => {
      const slotDate = new Date(slot.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return slotDate >= today;
    });
  };
  
  // Group slots by date for display
  const filteredSlots = getFilteredSlots();
  const groupedSlots = filteredSlots.reduce((groups, slot) => {
    if (!groups[slot.date]) {
      groups[slot.date] = [];
    }
    groups[slot.date].push(slot);
    return groups;
  }, {});
  
  // Toggle for showing past dates
  const togglePastDates = () => {
    setViewingPastDates(!viewingPastDates);
  };
  
  // Select all weekdays
  const selectAllWeekdays = () => {
    setRecurringDays({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    });
  };
  
  // Select all weekend days
  const selectWeekends = () => {
    setRecurringDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: true,
      sunday: true,
    });
  };
  
  // Select all days
  const selectAllDays = () => {
    setRecurringDays({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    });
  };
  
  // Clear all selected days
  const clearSelectedDays = () => {
    setRecurringDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Manage Your Availability
      </h2>
      
      {error && (
        <Alert 
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}
      
      {success && (
        <Alert 
          type="success"
          message={success}
          onClose={() => setSuccess('')}
        />
      )}
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        borderLeft: '4px solid #2563eb'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Your Default Schedule
        </h3>
        <p style={{ margin: 0 }}>
          Your availability is set to 8:00 AM - 6:00 PM, 7 days a week by default. You can customize your availability below.
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Add Custom Availability
            </h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddAvailability}>
              <div style={{ marginBottom: '1rem' }}>
                <label 
                  htmlFor="date"
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label 
                    htmlFor="startTime"
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="endTime"
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    End Time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Make this a recurring availability
                </label>
              </div>
              
              {isRecurring && (
                <div style={{ marginBottom: '1rem' }}>
                  <label 
                    style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500' 
                    }}
                  >
                    Repeat on these days:
                  </label>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem'
                  }}>
                    <button
                      type="button"
                      onClick={selectAllWeekdays}
                      style={{ 
                        padding: '0.375rem 0.625rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Weekdays
                    </button>
                    
                    <button
                      type="button"
                      onClick={selectWeekends}
                      style={{ 
                        padding: '0.375rem 0.625rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Weekends
                    </button>
                    
                    <button
                      type="button"
                      onClick={selectAllDays}
                      style={{ 
                        padding: '0.375rem 0.625rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      All Days
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearSelectedDays}
                      style={{ 
                        padding: '0.375rem 0.625rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {Object.keys(recurringDays).map((day) => (
                      <label 
                        key={day}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          backgroundColor: recurringDays[day] ? '#dbeafe' : 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={recurringDays[day]}
                          onChange={(e) => {
                            setRecurringDays({
                              ...recurringDays,
                              [day]: e.target.checked
                            });
                          }}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    ))}
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="recurringUntil"
                      style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500' 
                      }}
                    >
                      Recurring until:
                    </label>
                    <input
                      id="recurringUntil"
                      type="date"
                      min={minDate}
                      value={recurringUntilDate}
                      onChange={(e) => setRecurringUntilDate(e.target.value)}
                      required
                      style={{ 
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #d1d5db'
                      }}
                    />
                  </div>
                </div>
              )}
              
              <Button type="submit" variant="primary">
                Add Availability
              </Button>
            </form>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Your Availability
              </h3>
              
              <button
                onClick={togglePastDates}
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {viewingPastDates ? 'Hide Past Dates' : 'Show Past Dates'}
              </button>
            </div>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spinner />
                <p style={{ marginTop: '1rem' }}>Loading availability...</p>
              </div>
            ) : Object.keys(groupedSlots).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                {viewingPastDates ? 
                  "You don't have any availability set up yet." : 
                  "You don't have any upcoming availability. Add some time slots to enable clients to schedule viewings."}
              </div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {Object.keys(groupedSlots).sort().map(date => (
                  <div key={date} style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      marginBottom: '0.75rem',
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
                    
                    <div style={{ marginLeft: '1rem' }}>
                      {groupedSlots[date].map(slot => (
                        <div 
                          key={slot.id} 
                          style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            borderRadius: '0.375rem',
                            backgroundColor: 
                              slot.status === 'booked' ? '#dcfce7' : 
                              slot.status === 'blocked' ? '#fee2e2' : '#f9fafb'
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: '500' }}>
                              {slot.startTime} - {slot.endTime}
                            </span>
                            {slot.isRecurring && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#6b7280',
                                marginLeft: '0.5rem'
                              }}>
                                (Recurring)
                              </span>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {slot.status === 'available' && (
                              <>
                                <button
                                  onClick={() => handleBlockAvailability(slot.id)}
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  aria-label="Block availability"
                                  title="Block this time slot"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteAvailability(slot.id)}
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  aria-label="Delete availability"
                                  title="Delete this time slot"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            {slot.status === 'booked' && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: '500',
                                color: '#15803d',
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#dcfce7',
                                borderRadius: '9999px'
                              }}>
                                Booked
                              </span>
                            )}
                            
                            {slot.status === 'blocked' && (
                              <>
                                <span style={{ 
                                  fontSize: '0.75rem', 
                                  fontWeight: '500',
                                  color: '#b91c1c',
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#fee2e2',
                                  borderRadius: '9999px'
                                }}>
                                  Blocked
                                </span>
                                
                                <button
                                  onClick={() => handleUnblockAvailability(slot.id)}
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  aria-label="Unblock availability"
                                  title="Unblock this time slot"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AgentAvailabilityCalendar;