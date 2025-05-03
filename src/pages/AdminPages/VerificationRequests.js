import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import VerificationStatusBadge from '../../components/user/VerificationStatusBadge';

const VerificationRequests = () => {
  const { currentUser, userProfile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  
  // You'll need to implement admin checking based on your authentication system
  // For example, you could store an "isAdmin" flag in the user's profile
  const isAdmin = userProfile?.isAdmin === true;
  
  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Get agent verifications
        const agentQuery = query(
          collection(db, 'agentVerifications'),
          where('status', '==', activeTab)
        );
        
        // Get buyer verifications
        const buyerQuery = query(
          collection(db, 'buyerVerifications'),
          where('status', '==', activeTab)
        );
        
        // Get seller verifications
        const sellerQuery = query(
          collection(db, 'sellerVerifications'),
          where('status', '==', activeTab)
        );
        
        const [agentSnapshot, buyerSnapshot, sellerSnapshot] = await Promise.all([
          getDocs(agentQuery),
          getDocs(buyerQuery),
          getDocs(sellerQuery)
        ]);
        
        // Combine all results
        const allRequests = [];
        
        agentSnapshot.forEach(doc => {
          allRequests.push({
            id: doc.id,
            type: 'agent',
            collection: 'agentVerifications',
            ...doc.data()
          });
        });
        
        buyerSnapshot.forEach(doc => {
          allRequests.push({
            id: doc.id,
            type: 'buyer',
            collection: 'buyerVerifications',
            ...doc.data()
          });
        });
        
        sellerSnapshot.forEach(doc => {
          allRequests.push({
            id: doc.id,
            type: 'seller',
            collection: 'sellerVerifications',
            ...doc.data()
          });
        });
        
        // Sort by submission date (newest first)
        allRequests.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        
        setRequests(allRequests);
      } catch (err) {
        console.error('Error fetching verification requests:', err);
        setError('Failed to load verification requests');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [currentUser, isAdmin, activeTab]);
  
  const handleApprove = async (request) => {
    try {
      // Update the verification document
      await updateDoc(doc(db, request.collection, request.id), {
        status: 'verified',
        reviewedAt: serverTimestamp(),
        reviewedBy: currentUser.uid
      });
      
      // Update the user's profile
      await updateDoc(doc(db, 'users', request.userId), {
        verificationStatus: 'verified',
        verificationApprovedAt: serverTimestamp()
      });
      
      // Remove from list
      setRequests(requests.filter(r => r.id !== request.id));
      setSuccess(`Verification for ${request.type} has been approved`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error approving verification:', err);
      setError('Failed to approve verification');
    }
  };
  
  const handleReject = async (request) => {
    const reason = prompt('Please enter a reason for rejection:');
    if (!reason) return; // User cancelled
    
    try {
      // Update the verification document
      await updateDoc(doc(db, request.collection, request.id), {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: serverTimestamp(),
        reviewedBy: currentUser.uid
      });
      
      // Update the user's profile
      await updateDoc(doc(db, 'users', request.userId), {
        verificationStatus: 'rejected'
      });
      
      // Remove from list
      setRequests(requests.filter(r => r.id !== request.id));
      setSuccess(`Verification for ${request.type} has been rejected`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error rejecting verification:', err);
      setError('Failed to reject verification');
    }
  };
  
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Access Denied
        </h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Verification Requests
      </h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          backgroundColor: '#dcfce7', 
          color: '#15803d', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {success}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        backgroundColor: '#f3f4f6',
        padding: '0.5rem',
        borderRadius: '0.5rem'
      }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: activeTab === 'pending' ? '#2563eb' : 'transparent',
            color: activeTab === 'pending' ? 'white' : '#4b5563',
            fontWeight: activeTab === 'pending' ? '600' : '400',
            cursor: 'pointer'
          }}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: activeTab === 'verified' ? '#2563eb' : 'transparent',
            color: activeTab === 'verified' ? 'white' : '#4b5563',
            fontWeight: activeTab === 'verified' ? '600' : '400',
            cursor: 'pointer'
          }}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: activeTab === 'rejected' ? '#2563eb' : 'transparent',
            color: activeTab === 'rejected' ? 'white' : '#4b5563',
            fontWeight: activeTab === 'rejected' ? '600' : '400',
            cursor: 'pointer'
          }}
        >
          Rejected
        </button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading verification requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem'
        }}>
          <p>No {activeTab} verification requests found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {requests.map(request => (
            <Card key={request.id}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    {request.type === 'agent' ? 'Agent' : 
                     request.type === 'buyer' ? 'Buyer' : 'Seller'} Verification
                  </h2>
                  
                  <VerificationStatusBadge status={request.status} />
                </div>
              </CardHeader>
              
              <CardBody>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <p style={{ margin: 0 }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Submitted by:</span>{' '}
                      <span style={{ fontWeight: '500' }}>{request.userId}</span>
                    </p>
                    
                    <p style={{ margin: 0 }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Date:</span>{' '}
                      <span>{request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}</span>
                    </p>
                  </div>
                  
                  {/* Render different fields based on verification type */}
                  {request.type === 'agent' && (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          License Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>License Number:</span>
                            <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{request.licenseNumber}</p>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>License State:</span>
                            <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{request.licenseState}</p>
                          </div>
                        </div>
                      </div>
                      
                      {request.zillowProfileUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Zillow Profile
                          </h3>
                          <a 
                            href={request.zillowProfileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'none' }}
                          >
                            {request.zillowProfileUrl}
                          </a>
                        </div>
                      )}
                      
                      {request.licenseDocumentUrl && (
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            License Document
                          </h3>
                          <a 
                            href={request.licenseDocumentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '0.375rem',
                              color: '#2563eb',
                              textDecoration: 'none',
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View License Document
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {request.type === 'buyer' && (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          Pre-Approval Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pre-Approval Amount:</span>
                            <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                              ${request.preApprovalAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Lender:</span>
                            <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{request.lenderName}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pre-Approval Date:</span>
                            <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                              {request.preApprovalDate?.seconds ? 
                                new Date(request.preApprovalDate.seconds * 1000).toLocaleDateString() : 
                                'N/A'}
                            </p>
                          </div>
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Expiry Date:</span>
                            <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                              {request.preApprovalExpiryDate?.seconds ? 
                                new Date(request.preApprovalExpiryDate.seconds * 1000).toLocaleDateString() : 
                                'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {request.preApprovalDocumentUrl && (
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Pre-Approval Document
                          </h3>
                          <a 
                            href={request.preApprovalDocumentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '0.375rem',
                              color: '#2563eb',
                              textDecoration: 'none',
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Pre-Approval Document
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {request.type === 'seller' && (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          Property Information
                        </h3>
                        <div>
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Property Address:</span>
                          <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                            {request.propertyAddress}
                          </p>
                        </div>
                      </div>
                      
                      {request.ownershipDocumentUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Proof of Ownership
                          </h3>
                          <a 
                            href={request.ownershipDocumentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '0.375rem',
                              color: '#2563eb',
                              textDecoration: 'none',
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Ownership Document
                          </a>
                        </div>
                      )}
                      
                      {request.propertyPhotos && request.propertyPhotos.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            Property Photos
                          </h3>
                          <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '0.5rem'
                          }}>
                            {request.propertyPhotos.map((photoUrl, index) => (
                              <a 
                                key={index}
                                href={photoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <img 
                                  src={photoUrl} 
                                  alt={`Property photo ${index + 1}`} 
                                  style={{ 
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '0.25rem'
                                  }}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {request.status === 'rejected' && request.rejectionReason && (
                    <div style={{ 
                      marginTop: '1.5rem',
                      padding: '1rem',
                      backgroundColor: '#fee2e2',
                      borderRadius: '0.375rem'
                    }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#b91c1c' }}>
                        Rejection Reason
                      </h3>
                      <p style={{ margin: 0, color: '#b91c1c' }}>{request.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </CardBody>
              
              {activeTab === 'pending' && (
                <CardFooter>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="danger" 
                      onClick={() => handleReject(request)}
                    >
                      Reject
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={() => handleApprove(request)}
                    >
                      Approve
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationRequests;