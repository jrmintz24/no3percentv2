import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  to = null,
  style = {},
  ...props 
}) => {
  // Define base styles
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: '0.375rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    textDecoration: 'none',
  };
  
  // Size variations
  const sizeStyles = {
    small: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
    },
    medium: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
    large: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
    },
  };
  
  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#2563eb',
      border: '1px solid #2563eb',
    },
    danger: {
      backgroundColor: '#b91c1c',
      color: 'white',
      border: 'none',
    },
    success: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
    },
  };
  
  // Combine styles
  const combinedStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };
  
  // If we're rendering as a Link component
  if (to) {
    return (
      <Link 
        to={to} 
        style={combinedStyle}
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  // Default to a regular button
  return (
    <button 
      style={combinedStyle}
      disabled={disabled}
      type={props.type || "button"}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;