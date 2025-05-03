// src/components/common/Alert.js
import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  // Define styles based on alert type
  const styles = {
    container: {
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    message: {
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  };

  // Apply styles based on type
  const typeStyles = {
    info: {
      container: {
        backgroundColor: '#eff6ff',
        borderLeft: '4px solid #3b82f6',
        color: '#1e40af',
      },
      closeButton: {
        color: '#3b82f6',
      }
    },
    success: {
      container: {
        backgroundColor: '#f0fdf4',
        borderLeft: '4px solid #22c55e',
        color: '#166534',
      },
      closeButton: {
        color: '#22c55e',
      }
    },
    warning: {
      container: {
        backgroundColor: '#fffbeb',
        borderLeft: '4px solid #f59e0b',
        color: '#92400e',
      },
      closeButton: {
        color: '#f59e0b',
      }
    },
    error: {
      container: {
        backgroundColor: '#fee2e2',
        borderLeft: '4px solid #ef4444',
        color: '#b91c1c',
      },
      closeButton: {
        color: '#ef4444',
      }
    },
  };

  const alertType = typeStyles[type] || typeStyles.info;

  return (
    <div 
      role="alert" 
      style={{ ...styles.container, ...alertType.container }}
    >
      <p style={styles.message}>{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          aria-label="Close alert"
          style={{ ...styles.closeButton, ...alertType.closeButton }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;