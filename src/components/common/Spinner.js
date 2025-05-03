// src/components/common/Spinner.js
import React from 'react';

const Spinner = ({ size = 'medium', color = '#2563eb' }) => {
  // Define sizes
  const sizes = {
    small: {
      width: '1rem',
      height: '1rem',
      borderWidth: '2px',
    },
    medium: {
      width: '2rem',
      height: '2rem',
      borderWidth: '3px',
    },
    large: {
      width: '3rem',
      height: '3rem',
      borderWidth: '4px',
    },
  };

  const selectedSize = sizes[size] || sizes.medium;
  
  const spinnerStyle = {
    display: 'inline-block',
    borderRadius: '50%',
    border: `${selectedSize.borderWidth} solid #f3f4f6`,
    borderTopColor: color,
    animation: 'spin 1s linear infinite',
    ...selectedSize,
  };

  // Add keyframes animation to document if it doesn't exist
  React.useEffect(() => {
    if (!document.getElementById('spinner-keyframes')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'spinner-keyframes';
      styleElement.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        const element = document.getElementById('spinner-keyframes');
        if (element) element.remove();
      };
    }
  }, []);

  return (
    <div 
      style={spinnerStyle}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;