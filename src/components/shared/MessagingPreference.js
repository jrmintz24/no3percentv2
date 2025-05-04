// src/components/shared/MessagingPreference.js

import React from 'react';

const MessagingPreference = ({ messagingEnabled, onChange, userType }) => {
  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '1rem' 
      }}>
        Messaging Preferences
      </h3>
      
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <input
          type="checkbox"
          checked={messagingEnabled}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginTop: '0.25rem' }}
        />
        <div>
          <p style={{ margin: 0, fontWeight: '500' }}>
            Allow agents to message me before selection
          </p>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            fontSize: '0.875rem', 
            color: '#6b7280' 
          }}>
            If enabled, agents can message you to discuss their proposal. 
            Your contact information (email and phone) will only be shared 
            with the agent you choose to work with.
          </p>
        </div>
      </label>
    </div>
  );
};

export default MessagingPreference;