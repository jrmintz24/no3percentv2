import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import VerificationStatusBadge from './VerificationStatusBadge';
import AgentVerificationForm from './AgentVerificationForm';
import BuyerVerificationForm from './BuyerVerificationForm';
import SellerVerificationForm from './SellerVerificationForm';

const UserProfile = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Form states
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Verification states
  const [verificationData, setVerificationData] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [verificationError, setVerificationError] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  
  // Profile form data
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    location: '',
    bio: ''
  });
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Load user data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || ''
      });
      
      // Fetch verification data if user has it
      fetchVerificationData();
    }
  }, [userProfile]);
  
  // Fetch user's verification data
  const fetchVerificationData = async () => {
    if (!currentUser || !userProfile) return;
    
    setVerificationLoading(true);
    setVerificationError('');
    
    try {
      // Check if user has existing verification reference
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
          setVerificationData(null);
        }
      } else {
        // Try to find verification by userId
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
      setVerificationError('Failed to load verification data');
    } finally {
      setVerificationLoading(false);
    }
  };
  
  // Handle profile form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Update user profile in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        updatedAt: new Date()
      });
      
      setSuccess('Profile updated successfully!');
      setIsEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, passwordData.newPassword);
      
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Error updating password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle verification submission success
  const handleVerificationSuccess = () => {
    setSuccess('Verification information submitted successfully!');
    setShowVerificationForm(false);
    // Refetch the verification data
    fetchVerificationData();
  };
  
  // Get user type display
  const getUserTypeDisplay = (type) => {
    switch (type) {
      case 'buyer': return 'Property Buyer';
      case 'seller': return 'Property Seller';
      case 'agent': return 'Real Estate Agent';
      default: return 'User';
    }
  };
  
  // Render verification form based on user type
  const renderVerificationForm = () => {
    if (!userProfile) return null;
    
    switch (userProfile.userType) {
      case 'agent':
        return (
          <AgentVerificationForm 
            currentUser={currentUser} 
            existingData={verificationData} 
            onSubmitSuccess={handleVerificationSuccess}
          />
        );
      case 'buyer':
        return (
          <BuyerVerificationForm 
            currentUser={currentUser} 
            existingData={verificationData} 
            onSubmitSuccess={handleVerificationSuccess}
          />
        );
      case 'seller':
        return (
          <SellerVerificationForm 
            currentUser={currentUser} 
            existingData={verificationData} 
            onSubmitSuccess={handleVerificationSuccess}
          />
        );
      default:
        return <p>Verification is not available for your user type.</p>;
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          {isEditMode ? 'Edit Profile' : 'My Profile'}
        </h1>
        
        {!isEditMode && !showPasswordForm && !showVerificationForm && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setIsEditMode(true)}>
              Edit Profile
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowPasswordForm(true)}
            >
              Change Password
            </Button>
          </div>
        )}
      </div>
      
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
      
      {showPasswordForm ? (
        <Card>
          <form onSubmit={handlePasswordUpdate}>
            <CardHeader>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Change Password
              </h2>
            </CardHeader>
            
            <CardBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="currentPassword" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
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
                  htmlFor="newPassword" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
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
                  htmlFor="confirmPassword" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>
            </CardBody>
            
            <CardFooter>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setError('');
                    setSuccess('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      ) : showVerificationForm ? (
        <Card>
          <CardHeader>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Profile Verification
              </h2>
              <VerificationStatusBadge status={userProfile?.verificationStatus || 'unverified'} />
            </div>
          </CardHeader>
          
          <CardBody>
            {renderVerificationForm()}
          </CardBody>
          
          <CardFooter>
            <Button 
              type="button"
              variant="secondary"
              onClick={() => {
                setShowVerificationForm(false);
                setError('');
                setSuccess('');
              }}
            >
              Back to Profile
            </Button>
          </CardFooter>
        </Card>
      ) : isEditMode ? (
        <Card>
          <form onSubmit={handleProfileUpdate}>
            <CardHeader>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Edit Profile Information
              </h2>
            </CardHeader>
            
            <CardBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="displayName" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Full Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
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
                  htmlFor="phone" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
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
                  htmlFor="location" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Seattle, WA"
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
                  htmlFor="bio" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell other users about yourself"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    resize: 'vertical'
                  }}
                />
              </div>
            </CardBody>
            
            <CardFooter>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditMode(false);
                    setError('');
                    setSuccess('');
                    
                    // Reset form data to current profile
                    if (userProfile) {
                      setFormData({
                        displayName: userProfile.displayName || '',
                        phone: userProfile.phone || '',
                        location: userProfile.location || '',
                        bio: userProfile.bio || ''
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Profile Information
              </h2>
            </CardHeader>
            
            <CardBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Email
                </h3>
                <p>{currentUser?.email || 'N/A'}</p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Full Name
                </h3>
                <p>{userProfile?.displayName || 'Not set'}</p>
              </div>
              
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    User Type
                  </h3>
                  <p>{getUserTypeDisplay(userProfile?.userType)}</p>
                </div>
                
                {userProfile?.verificationStatus && (
                  <VerificationStatusBadge status={userProfile.verificationStatus} />
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Phone Number
                </h3>
                <p>{userProfile?.phone || 'Not set'}</p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Location
                </h3>
                <p>{userProfile?.location || 'Not set'}</p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Bio
                </h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{userProfile?.bio || 'Not set'}</p>
              </div>
            </CardBody>
            
            <CardFooter>
              <Button 
                onClick={() => setShowVerificationForm(true)}
                fullWidth
              >
                {userProfile?.verificationStatus === 'verified' 
                  ? 'View Verification Details' 
                  : userProfile?.verificationStatus === 'pending'
                  ? 'Update Verification Information'
                  : 'Verify Your Profile'}
              </Button>
            </CardFooter>
          </Card>

          {/* Display verification information if user is verified */}
          {userProfile?.verificationStatus === 'verified' && !verificationLoading && verificationData && (
            <Card style={{ marginTop: '1.5rem' }}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                    Verification Status
                  </h2>
                  <VerificationStatusBadge status="verified" />
                </div>
              </CardHeader>
              
              <CardBody>
                {userProfile.userType === 'agent' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Licensed Agent in</span>
                      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>{verificationData.licenseState}</p>
                    </div>
                    
                    {verificationData.zillowProfileUrl && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Zillow Profile</span>
                        <p style={{ margin: '0.25rem 0 0 0' }}>
                          <a 
                            href={verificationData.zillowProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'none' }}
                          >
                            View on Zillow
                          </a>
                        </p>
                      </div>
                    )}
                    
                    {verificationData.professionalAssociations?.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Professional Associations</span>
                        <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                          {typeof verificationData.professionalAssociations === 'string' 
                            ? verificationData.professionalAssociations 
                            : verificationData.professionalAssociations.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {userProfile.userType === 'buyer' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginRight: '0.5rem' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Pre-approval Verified</span>
                    </div>
                    
                    {verificationData.privacySettings?.showPreApprovalAmount && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pre-approved Amount</span>
                        <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                          ${verificationData.preApprovalAmount?.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lender</span>
                      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                        {verificationData.lenderName}
                      </p>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expires</span>
                      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                        {verificationData.preApprovalExpiryDate?.seconds 
                          ? new Date(verificationData.preApprovalExpiryDate.seconds * 1000).toLocaleDateString() 
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
                
                {userProfile.userType === 'seller' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', marginRight: '0.5rem' }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Property Ownership Verified</span>
                    </div>
                    
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Property Address</span>
                      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                        {verificationData.propertyAddress}
                      </p>
                    </div>
                    
                    {verificationData.propertyPhotos?.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Property Photos</span>
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '0.5rem',
                          marginTop: '0.5rem' 
                        }}>
                          {verificationData.propertyPhotos.slice(0, 3).map((photo, index) => (
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
                )}
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;