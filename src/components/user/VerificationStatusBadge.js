// src/components/user/VerificationStatusBadge.js
import React from 'react';

const VerificationStatusBadge = ({ status }) => {
  let styles = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
    }
  };
  
  // Set styles based on verification status
  switch (status) {
    case 'verified':
      styles.container = {
        ...styles.container,
        backgroundColor: '#dcfce7',
        color: '#166534',
      };
      break;
    case 'pending':
      styles.container = {
        ...styles.container,
        backgroundColor: '#fef9c3',
        color: '#854d0e',
      };
      break;
    case 'rejected':
      styles.container = {
        ...styles.container,
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
      };
      break;
    default: // unverified
      styles.container = {
        ...styles.container,
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
      };
  }
  
  // Get badge text based on status
  const getBadgeText = () => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      case 'rejected':
        return 'Verification Rejected';
      default:
        return 'Not Verified';
    }
  };
  
  // Get icon based on status
  const getIcon = () => {
    switch (status) {
      case 'verified':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }}>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div style={styles.container}>
      {getIcon()}
      {getBadgeText()}
    </div>
  );
};

export default VerificationStatusBadge;