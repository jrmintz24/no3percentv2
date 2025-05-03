// src/components/user/AgentVerificationForm.js
import React, { useState } from 'react';
import { doc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { Button } from '../common/Button';

const AgentVerificationForm = ({ currentUser, existingData, onSubmitSuccess }) => {
  const [licenseNumber, setLicenseNumber] = useState(existingData?.licenseNumber || '');
  const [licenseState, setLicenseState] = useState(existingData?.licenseState || '');
  const [zillowProfileUrl, setZillowProfileUrl] = useState(existingData?.zillowProfileUrl || '');
  const [professionalAssociations, setProfessionalAssociations] = useState(existingData?.professionalAssociations || '');
  const [licenseDocument, setLicenseDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Upload license document if provided
      let licenseDocumentUrl = existingData?.licenseDocumentUrl;
      if (licenseDocument) {
        const storageRef = ref(storage, `verification_documents/${currentUser.uid}/license_document`);
        await uploadBytes(storageRef, licenseDocument);
        licenseDocumentUrl = await getDownloadURL(storageRef);
      }
      
      // Convert professional associations string to array
      const associationsArray = professionalAssociations
        ? professionalAssociations.split(',').map(item => item.trim())
        : [];
      
      const verificationData = {
        userId: currentUser.uid,
        licenseNumber,
        licenseState,
        zillowProfileUrl,
        professionalAssociations: associationsArray,
        licenseDocumentUrl,
        status: 'pending',
        updatedAt: serverTimestamp()
      };
      
      if (existingData?.id) {
        // Update existing verification
        await updateDoc(doc(db, 'agentVerifications', existingData.id), verificationData);
      } else {
        // Create new verification
        const docRef = await addDoc(collection(db, 'agentVerifications'), {
          ...verificationData,
          createdAt: serverTimestamp()
        });
        
        // Update user profile with verification reference
        await updateDoc(doc(db, 'users', currentUser.uid), {
          verificationStatus: 'pending',
          verificationSubmittedAt: serverTimestamp(),
          'verificationData': {
            documentId: docRef.id,
            type: 'agent'
          }
        });
      }
      
      if (onSubmitSuccess) onSubmitSuccess();
      
    } catch (err) {
      console.error('Error submitting verification:', err);
      setError('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // List of US states for dropdown
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "DC"
  ];
  
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Agent Verification
      </h3>
      
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        Verify your real estate license to build trust with potential clients.
      </p>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '0.75rem', 
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="licenseNumber"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Real Estate License Number*
          </label>
          <input
            id="licenseNumber"
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="licenseState"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            License State*
          </label>
          <select 
            id="licenseState"
            value={licenseState}
            onChange={(e) => setLicenseState(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="zillowProfileUrl"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Zillow Profile URL (Optional)
          </label>
          <input
            id="zillowProfileUrl"
            type="url"
            value={zillowProfileUrl}
            onChange={(e) => setZillowProfileUrl(e.target.value)}
            placeholder="https://www.zillow.com/profile/yourusername"
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Linking your Zillow profile helps establish credibility with clients
          </p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="professionalAssociations"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Professional Associations (Optional)
          </label>
          <input
            id="professionalAssociations"
            type="text"
            value={professionalAssociations}
            onChange={(e) => setProfessionalAssociations(e.target.value)}
            placeholder="NAR, Local Board of Realtors, etc. (comma separated)"
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="licenseDocument"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            License Document*
          </label>
          <input
            id="licenseDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setLicenseDocument(e.target.files[0])}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            required={!existingData?.licenseDocumentUrl}
          />
          {existingData?.licenseDocumentUrl && (
            <p style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '0.5rem' }}>
              <a href={existingData.licenseDocumentUrl} target="_blank" rel="noopener noreferrer">
                View existing document
              </a>
              <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                (Upload a new file to replace it)
              </span>
            </p>
          )}
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Please upload a scan or photo of your real estate license
          </p>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Submitting...' : existingData?.id ? 'Update Verification' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  );
};

export default AgentVerificationForm;