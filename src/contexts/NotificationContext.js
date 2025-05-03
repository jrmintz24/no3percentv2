// src/contexts/NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const value = {
    showSuccess: (message) => showNotification(message, 'success'),
    showError: (message) => showNotification(message, 'error'),
    showInfo: (message) => showNotification(message, 'info'),
    showWarning: (message) => showNotification(message, 'warning'),
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

// Notification container component
const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '400px'
    }}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

// Individual notification component
const Notification = ({ notification, onRemove }) => {
  const { message, type } = notification;
  
  const typeStyles = {
    success: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    error: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    warning: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    info: {
      backgroundColor: '#3b82f6',
      color: 'white'
    }
  };

  return (
    <div style={{
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out',
      ...typeStyles[type]
    }}>
      <span>{message}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

// Add this CSS to your global styles or create a separate CSS file
const styles = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;

export default NotificationProvider;