// src/components/user/ProfileVerificationSection.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Card, CardHeader, CardBody } from '../common/Card';
import VerificationStatusBadge from './VerificationStatusBadge';
import AgentVerificationForm from './AgentVerificationForm';
import BuyerVerificationForm from './BuyerVerificationForm';
import SellerVerificationForm from './SellerVerificationForm';

const ProfileVerificationSection = ({ currentUser, userProfile }) => {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const fetchVerificationData = async () => {
      if (!currentUser || !userProfile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        // If user has existing verification reference
        if (userProfile.verificationData && userProfile.verificationData.documentId) {
          const { documentId, type } = userProfile.verificationData;
          let collectionName;
          
          switch (type) {
            case 'agent':
              collectionName = 'agentVerifications';
              break;
            case 'buyer':
              collectionName = 'buyerVerifications';
              break;
            case 'seller':
              collectionName = 'sellerVerifications';
              break;
            default:
              throw new Error('Invalid verification type');
          }
          
          const verificationDoc = await getDoc(doc(db, collectionName, documentId));
          
          if (verificationDoc.exists()) {
            setVerificationData({
              id: verificationDoc.id,
              ...verificationDoc.data()
            });
          } else {
            // Document reference exists but document doesn't - might have been deleted
            setVerificationData(null);
          }
        } else {
          // Try to find verification by userId in case there's one without a reference
          let collectionName;
          
          switch (userProfile.userType) {
            case 'agent':
              collectionName = 'agentVerifications';
              break;
            case 'buyer':
              collectionName = 'buyerVerifications';
              break;
            case 'seller':
              collectionName = 'sellerVerifications';
              break;
            default:
              throw new Error('Invalid user type');
          }
          
          const q = query(
            collection(db, collectionName),
            where('userId', '==', currentUser.uid)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Use the most recent verification
            let mostRecent = null;
            
            querySnapshot.forEach(doc => {
              const data = { id: doc.id, ...doc.data() };
              
              if (!mostRecent || 
                  (data.updatedAt && mostRecent.updatedAt && 
                   data.updatedAt.seconds > mostRecent.updatedAt.seconds)) {
                mostRecent = data;
              }
            });
            
            setVerificationData(mostRecent);
          } else {
            setVerificationData(null);
          }
        }
      } catch (err) {
        console.error('Error fetching verification data:', err);
        setError('Failed to load verification data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVerificationData();
  }, [currentUser, userProfile, refreshKey]);
  
  const handleSubmitSuccess = () => {
    // Refresh the data
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const renderVerificationForm = () => {
    if (!userProfile) return null;
    
    switch (userProfile.userType) {
      case 'agent':
        return (
          <AgentVerificationForm 
            currentUser={currentUser} 
            existingData={verificationData} 
            onSubmitSuccess={handleSubmitSuccess}
          />
        );
      case 'buyer':
        return (
          <BuyerVerificationForm 
            currentUser={currentUser} 
            existingData={verificationData} 
            onSubmitSuccess={handleSubmitSuccess}
          />
        );
      case 'seller':
        return (
          <SellerVerificationForm 
            currentUser={currentUser} 
            existingData={verificationData} 
            onSubmitSuccess={handleSubmitSuccess}
          />
        );
      default:
        return <p>Verification is not available for your user type.</p>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            margin: 0 
          }}>
            Profile Verification
          </h2>
          
          <VerificationStatusBadge status={userProfile?.verificationStatus || 'unverified'} />
        </div>
      </CardHeader>
      
      <CardBody>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            Loading verification data...
          </div>
        ) : error ? (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '0.75rem', 
            borderRadius: '0.375rem' 
          }}>
            {error}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              {userProfile?.verificationStatus === 'pending' ? (
                <div style={{ 
                  backgroundColor: '#fef9c3', 
                  color: '#854d0e', 
                  padding: '0.75rem', 
                  borderRadius: '0.375rem' 
                }}>
                  Your verification has been submitted and is pending review. You can still update your information if needed.
                </div>
              ) : userProfile?.verificationStatus === 'rejected' ? (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  color: '#b91c1c', 
                  padding: '0.75rem', 
                  borderRadius: '0.375rem' 
                }}>
                  Your verification was not approved. Please review the information and try again.
                </div>
              ) : userProfile?.verificationStatus === 'verified' ? (
                <div style={{ 
                  backgroundColor: '#dcfce7', 
                  color: '#166534', 
                  padding: '0.75rem', 
                  borderRadius: '0.375rem' 
                }}>
                  Your profile is verified! This helps build trust with other users.
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  color: '#374151', 
                  padding: '0.75rem', 
                  borderRadius: '0.375rem' 
                }}>
                  Verified profiles receive higher visibility and trust. Complete your verification to stand out.
                </div>
              )}
            </div>
            
            {renderVerificationForm()}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ProfileVerificationSection;