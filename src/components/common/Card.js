import React from 'react';

const Card = ({ children, style, ...props }) => {
  return (
    <div 
      style={{ 
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        marginBottom: '1rem',
        ...style
      }} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, style, ...props }) => {
  return (
    <div 
      style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        ...style
      }} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardBody = ({ children, style, ...props }) => {
  return (
    <div 
      style={{ 
        padding: '1.5rem',
        ...style
      }} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, style, ...props }) => {
  return (
    <div 
      style={{ 
        padding: '1.5rem',
        borderTop: '1px solid #e5e7eb',
        ...style
      }} 
      {...props}
    >
      {children}
    </div>
  );
};

// Export as both named and default
export { Card, CardHeader, CardBody, CardFooter };
export default Card;