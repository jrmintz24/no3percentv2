// src/services/notifications/notificationService.js
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const notificationTypes = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_OVERDUE: 'task_overdue',
  SERVICE_STARTED: 'service_started',
  SERVICE_COMPLETED: 'service_completed',
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_NEEDS_SIGNATURE: 'document_needs_signature',
  DEADLINE_APPROACHING: 'deadline_approaching',
  MESSAGE_RECEIVED: 'message_received',
  PROPOSAL_ACCEPTED: 'proposal_accepted'
};

export const createNotification = async (type, data) => {
  try {
    const notification = {
      type,
      title: getNotificationTitle(type, data),
      message: getNotificationMessage(type, data),
      priority: getNotificationPriority(type),
      recipients: data.recipients || [],
      read: false,
      actionUrl: data.actionUrl || null,
      metadata: data.metadata || {},
      createdAt: serverTimestamp()
    };
    
    // Create notification for each recipient
    for (const recipientId of notification.recipients) {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        userId: recipientId
      });
    }
    
    // If email/SMS enabled, send those too
    if (data.sendEmail) {
      await sendEmailNotification(notification);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getNotificationTitle = (type, data) => {
  switch (type) {
    case notificationTypes.TASK_ASSIGNED:
      return `New Task: ${data.taskTitle}`;
    case notificationTypes.TASK_COMPLETED:
      return `Task Completed: ${data.taskTitle}`;
    case notificationTypes.TASK_OVERDUE:
      return `⚠️ Overdue Task: ${data.taskTitle}`;
    case notificationTypes.SERVICE_STARTED:
      return `Service Started: ${data.serviceName}`;
    case notificationTypes.SERVICE_COMPLETED:
      return `Service Completed: ${data.serviceName}`;
    case notificationTypes.DOCUMENT_UPLOADED:
      return `New Document: ${data.documentName}`;
    case notificationTypes.DEADLINE_APPROACHING:
      return `⏰ Deadline Approaching: ${data.deadlineTitle}`;
    default:
      return 'New Notification';
  }
};

const getNotificationMessage = (type, data) => {
  switch (type) {
    case notificationTypes.TASK_ASSIGNED:
      return `You have been assigned a new task: "${data.taskTitle}" in ${data.serviceName}. Due by ${data.deadline ? new Date(data.deadline).toLocaleDateString() : 'no deadline'}.`;
    case notificationTypes.TASK_OVERDUE:
      return `The task "${data.taskTitle}" was due on ${new Date(data.deadline).toLocaleDateString()}. Please complete it as soon as possible.`;
    case notificationTypes.DOCUMENT_UPLOADED:
      return `A new document "${data.documentName}" has been uploaded to ${data.serviceName || 'your transaction'}.`;
    case notificationTypes.DEADLINE_APPROACHING:
      return `The deadline for "${data.deadlineTitle}" is approaching in ${data.daysRemaining} days (${new Date(data.deadline).toLocaleDateString()}).`;
    default:
      return data.message || '';
  }
};

const getNotificationPriority = (type) => {
  switch (type) {
    case notificationTypes.TASK_OVERDUE:
    case notificationTypes.DEADLINE_APPROACHING:
      return 'high';
    case notificationTypes.TASK_ASSIGNED:
    case notificationTypes.DOCUMENT_NEEDS_SIGNATURE:
      return 'medium';
    default:
      return 'low';
  }
};

// Check for upcoming deadlines
export const checkUpcomingDeadlines = async (transactionId) => {
  const servicesRef = collection(db, 'transactionServices');
  const q = query(servicesRef, where('transactionId', '==', transactionId));
  const snapshot = await getDocs(q);
  
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
  
  snapshot.docs.forEach(doc => {
    const service = doc.data();
    
    service.tasks?.forEach(task => {
      if (task.deadline && task.status !== 'completed') {
        const deadline = new Date(task.deadline);
        
        // Check if overdue
        if (deadline < now) {
          createNotification(notificationTypes.TASK_OVERDUE, {
            taskTitle: task.title,
            serviceName: service.serviceName,
            deadline: task.deadline,
            recipients: [service.transactionId], // Would need to get actual user IDs
            actionUrl: `/transaction/${transactionId}/services/${service.id}`
          });
        }
        // Check if approaching (within 3 days)
        else if (deadline < threeDaysFromNow) {
          const daysRemaining = Math.ceil((deadline - now) / (24 * 60 * 60 * 1000));
          
          createNotification(notificationTypes.DEADLINE_APPROACHING, {
            deadlineTitle: task.title,
            serviceName: service.serviceName,
            deadline: task.deadline,
            daysRemaining,
            recipients: [service.transactionId], // Would need to get actual user IDs
            actionUrl: `/transaction/${transactionId}/services/${service.id}`
          });
        }
      }
    });
  });
};

// Notification listener component
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';

export const NotificationBell = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef, 
      where('userId', '==', currentUser.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setNotifications(notificationData.sort((a, b) => b.createdAt - a.createdAt));
      setUnreadCount(notificationData.length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (notificationId) => {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
      readAt: serverTimestamp()
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '9999px',
            padding: '0.125rem 0.375rem',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '0.5rem',
          width: '320px',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          zIndex: 50
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e5e7eb',
            fontWeight: '600'
          }}>
            Notifications
          </div>
          
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    backgroundColor: notification.read ? 'white' : '#f0f9ff'
                  }}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {notification.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    {notification.createdAt?.toDate().toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;