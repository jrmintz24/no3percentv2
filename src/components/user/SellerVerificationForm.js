// src/components/user/SellerVerificationForm.js
import React, { useState } from 'react';
import { doc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { Button } from '../common/Button';

const SellerVerificationForm = ({ currentUser, existingData, onSubmitSuccess }) => {
  const [propertyAddress, setPropertyAddress] = useState(existingData?.propertyAddress || '');
  const [ownershipDocument, setOwnershipDocument] = useState(null);
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState(existingData?.propertyPhotos || []);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Upload ownership document if provided
      let documentUrl = existingData?.ownershipDocumentUrl;
      if (ownershipDocument) {
        const storageRef = ref(storage, `verification_documents/${currentUser.uid}/ownership_proof`);
        await uploadBytes(storageRef, ownershipDocument);
        documentUrl = await getDownloadURL(storageRef);
      }
      
      // Upload property photos if provided
      let allPhotos = [...existingPhotos];
      
      if (propertyPhotos.length > 0) {
        setPhotoUploading(true);
        
        const photoUploadPromises = Array.from(propertyPhotos).map(async (photo, index) => {
          const photoRef = ref(storage, `property_photos/${currentUser.uid}/${Date.now()}_${index}`);
          await uploadBytes(photoRef, photo);
          return getDownloadURL(photoRef);
        });
        
        const newPhotos = await Promise.all(photoUploadPromises);
        allPhotos = [...allPhotos, ...newPhotos];
        
        setPhotoUploading(false);
      }
      
      const verificationData = {
        userId: currentUser.uid,
        propertyAddress,
        ownershipDocumentUrl: documentUrl,
        propertyPhotos: allPhotos,
        status: 'pending',
        updatedAt: serverTimestamp()
      };
      
      if (existingData?.id) {
        // Update existing verification
        await updateDoc(doc(db, 'sellerVerifications', existingData.id), verificationData);
      } else {
        // Create new verification
        const docRef = await addDoc(collection(db, 'sellerVerifications'), {
          ...verificationData,
          createdAt: serverTimestamp()
        });
        
        // Update user profile with verification reference
        await updateDoc(doc(db, 'users', currentUser.uid), {
          verificationStatus: 'pending',
          verificationSubmittedAt: serverTimestamp(),
          'verificationData': {
            documentId: docRef.id,
            type: 'seller'
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
  
  const handlePhotoDelete = (photoUrl) => {
    setExistingPhotos(existingPhotos.filter(url => url !== photoUrl));
  };
  
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Seller Verification
      </h3>
      
      <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
        Verify your property ownership to build trust with potential buyers.
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
            htmlFor="propertyAddress"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Property Address*
          </label>
          <input
            id="propertyAddress"
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="ownershipDocument"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Proof of Ownership*
          </label>
          <input
            id="ownershipDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setOwnershipDocument(e.target.files[0])}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
            required={!existingData?.ownershipDocumentUrl}
          />
          {existingData?.ownershipDocumentUrl && (
            <p style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '0.5rem' }}>
              <a href={existingData.ownershipDocumentUrl} target="_blank" rel="noopener noreferrer">
                View existing document
              </a>
              <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                (Upload a new file to replace it)
              </span>
            </p>
          )}
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Please upload a document proving ownership (deed, tax statement, etc.)
          </p>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            htmlFor="propertyPhotos"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500' 
            }}
          >
            Property Photos (Optional)
          </label>
          <input
            id="propertyPhotos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPropertyPhotos(e.target.files)}
            style={{ 
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Add photos of your property to help verify your listing
          </p>
          
          {existingPhotos.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h5 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                Existing Photos
              </h5>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem'
              }}>
                {existingPhotos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={photo} 
                      alt={`Property ${index + 1}`} 
                      style={{ 
                        width: '100%',
                        height: '8rem',
                        objectFit: 'cover',
                        borderRadius: '0.25rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(photo)}
                      style={{ 
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      aria-label="Delete photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || photoUploading}
          fullWidth
        >
          {isSubmitting ? 'Submitting...' : existingData?.id ? 'Update Verification' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  );
};

export default SellerVerificationForm;