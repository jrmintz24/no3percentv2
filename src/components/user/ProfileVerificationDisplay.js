// src/components/user/ProfileVerificationDisplay.js
import React from 'react';
import VerificationStatusBadge from './VerificationStatusBadge';

const ProfileVerificationDisplay = ({ userProfile, verificationType, verificationData }) => {
  if (!userProfile || !verificationData) return null;
  
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      padding: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      marginBottom: '1.5rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem' 
      }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', margin: 0 }}>Verification</h3>
        <VerificationStatusBadge status={userProfile.verificationStatus || 'unverified'} />
      </div>
      
      {userProfile.verificationStatus === 'verified' && (
        <>
          {verificationType === 'agent' && <AgentVerificationDisplay data={verificationData} />}
          {verificationType === 'buyer' && <BuyerVerificationDisplay data={verificationData} />}
          {verificationType === 'seller' && <SellerVerificationDisplay data={verificationData} />}
        </>
      )}
    </div>
  );
};

const AgentVerificationDisplay = ({ data }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div>
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Licensed Agent in</span>
      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{data.licenseState}</p>
    </div>
    
    {data.zillowProfileUrl && (
      <div>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Zillow Profile</span>
        <p style={{ margin: '0.25rem 0 0 0' }}>
          <a 
            href={data.zillowProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none' }}
          >
            View on Zillow
          </a>
        </p>
      </div>
    )}
    
    {data.professionalAssociations?.length > 0 && (
      <div>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Professional Associations</span>
        <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
          {typeof data.professionalAssociations === 'string' 
            ? data.professionalAssociations 
            : data.professionalAssociations.join(', ')}
        </p>
      </div>
    )}
  </div>
);

const BuyerVerificationDisplay = ({ data }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {data.privacySettings?.showPreApprovalToAgents && (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginRight: '0.5rem' }}>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Pre-approval Verified</span>
      </div>
    )}
    
    {data.privacySettings?.showPreApprovalAmount && (
      <div>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pre-approved Amount</span>
        <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
          ${data.preApprovalAmount?.toLocaleString()}
        </p>
      </div>
    )}
    
    <div>
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pre-approval Date</span>
      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
        {new Date(data.preApprovalDate?.seconds * 1000).toLocaleDateString()}
      </p>
    </div>
    
    <div>
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expires</span>
      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
        {new Date(data.preApprovalExpiryDate?.seconds * 1000).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const SellerVerificationDisplay = ({ data }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginRight: '0.5rem' }}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span>Property Ownership Verified</span>
    </div>
    
    {data.propertyPhotos?.length > 0 && (
      <div>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Property Photos</span>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginTop: '0.5rem' 
        }}>
          {data.propertyPhotos.slice(0, 3).map((photo, index) => (
            <img 
              key={index} 
              src={photo} 
              alt={`Property ${index + 1}`} 
              style={{ 
                width: '100%',
                height: '5rem',
                objectFit: 'cover',
                borderRadius: '0.25rem'
              }}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ProfileVerificationDisplay;