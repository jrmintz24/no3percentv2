// src/components/user/BuyerVerificationForm.js
import React, { useState } from 'react';
import { doc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { Button } from '../common/Button';

const BuyerVerificationForm = ({ currentUser, existingData, onSubmitSuccess }) => {
  const [preApprovalAmount, setPreApprovalAmount] = useState(existingData?.preApprovalAmount || '');
  const [lenderName, setLenderName] = useState(existingData?.lenderName || '');
  const [preApprovalDate, setPreApprovalDate] = useState(
    existingData?.preApprovalDate 
      ? new Date(existingData.preApprovalDate.seconds * 1000).toISOString().split('T')[0] 
      : ''
  );
  const [expiryDate, setExpiryDate] = useState(
    existingData?.preApprovalExpiryDate 
      ? new Date(existingData.preApprovalExpiryDate.seconds * 1000).toISOString().split('T')[0] 
      : ''
  );
  const [preApprovalDocument, setPreApprovalDocument] = useState(null);
  const [privacySettings, setPrivacySettings] = useState(existingData?.privacySettings || {
    showPreApprovalAmount: false,
    showPreApprovalToAgents: true,
    showPreApprovalToSellers: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Upload pre-approval document if provided
      let documentUrl = existingData?.preApprovalDocumentUrl;
      if (preApprovalDocument) {
        const storageRef = ref(storage, `verification_documents/${currentUser.uid}/pre_approval`);
        await uploadBytes(storageRef, preApprovalDocument);
        documentUrl = await getDownloadURL(storageRef);
      }
      
      const verificationData = {
        userId: currentUser.uid,
        preApprovalAmount: Number(preApprovalAmount),
        lenderName,
        preApprovalDate: new Date(preApprovalDate),
        preApprovalExpiryDate: new Date(expiryDate),
        preApprovalDocumentUrl: documentUrl,
        privacySettings,
        status: 'pending',
        updatedAt: serverTimestamp()
      };
      
      if (existingData?.id) {
        // Update existing verification
        await updateDoc(doc(db, 'buyerVerifications', existingData.id), verificationData);
      } else {
        // Create new verification
        const docRef = await addDoc(collection(db, 'buyerVerifications'), {
          ...verificationData,
          createdAt: serverTimestamp()
        });
        
        // Update user profile with verification reference
        await updateDoc(doc(db, 'users', currentUser.uid), {
          verificationStatus: 'pending',
          verificationSubmittedAt: serverTimestamp(),
          'verificationData': {
            documentId: docRef.id,
            type: 'buyer'
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
  
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Buyer Verification
      </h3>
      
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        Verify your pre-approval status to make your offers stand out to sellers and agents.
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
            htmlFor="preApprovalAmount"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Pre-Approval Amount*
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }}>
              $
            </span>
            <input
              id="preApprovalAmount"
              type="number"
              value={preApprovalAmount}
              onChange={(e) => setPreApprovalAmount(e.target.value)}
              min="0"
              step="1000"
              required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                paddingLeft: '1.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
              placeholder="500000"
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="lenderName"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Lender Name*
          </label>
          <input
            id="lenderName"
            type="text"
            value={lenderName}
            onChange={(e) => setLenderName(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            placeholder="Bank of America"
          />
        </div>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label 
              htmlFor="preApprovalDate"
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}
            >
              Pre-Approval Date*
            </label>
            <input
              id="preApprovalDate"
              type="date"
              value={preApprovalDate}
              onChange={(e) => setPreApprovalDate(e.target.value)}
              required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            />
          </div>
          
          <div>
            <label 
              htmlFor="expiryDate"
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}
            >
              Expiry Date*
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              style={{ 
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db'
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="preApprovalDocument"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Pre-Approval Document*
          </label>
          <input
            id="preApprovalDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setPreApprovalDocument(e.target.files[0])}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            required={!existingData?.preApprovalDocumentUrl}
          />
          {existingData?.preApprovalDocumentUrl && (
            <p style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '0.5rem' }}>
              <a href={existingData.preApprovalDocumentUrl} target="_blank" rel="noopener noreferrer">
                View existing document
              </a>
              <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                (Upload a new file to replace it)
              </span>
            </p>
          )}
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Please upload a copy of your pre-approval letter from your lender
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontWeight: '500', marginBottom: '0.75rem' }}>Privacy Settings</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacySettings.showPreApprovalToAgents}
                onChange={(e) => setPrivacySettings({
                  ...privacySettings,
                  showPreApprovalToAgents: e.target.checked
                })}
                style={{ marginRight: '0.5rem' }}
              />
              Show pre-approval status to agents
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacySettings.showPreApprovalAmount}
                onChange={(e) => setPrivacySettings({
                  ...privacySettings,
                  showPreApprovalAmount: e.target.checked
                })}
                style={{ marginRight: '0.5rem' }}
              />
              Show pre-approval amount
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacySettings.showPreApprovalToSellers}
                onChange={(e) => setPrivacySettings({
                  ...privacySettings,
                  showPreApprovalToSellers: e.target.checked
                })}
                style={{ marginRight: '0.5rem' }}
              />
              Show pre-approval status to sellers
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Submitting...' : existingData?.id ? 'Update Pre-Approval' : 'Submit Pre-Approval'}
        </Button>
      </form>
    </div>
  );
};

export default BuyerVerificationForm;