// src/components/user/UserProfile.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { subscriptionTiers } from '../../config/subscriptions';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import VerificationStatusBadge from './VerificationStatusBadge';
import AgentVerificationForm from './AgentVerificationForm';
import BuyerVerificationForm from './BuyerVerificationForm';
import SellerVerificationForm from './SellerVerificationForm';

const UserProfile = () => {
  const { currentUser, userProfile, updateUserProfile, getUserSubscriptionTier } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProposals: 0,
    acceptedProposals: 0,
    totalTokensUsed: 0,
    successRate: 0
  });
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    location: '',
    bio: '',
    specialties: '',
    experience: '',
    licenseNumber: '',
    brokerageName: '',
    serviceAreas: '',
    languages: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const currentTier = getUserSubscriptionTier(userProfile);
  const isAgent = userProfile?.userType === 'agent';

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || '',
        specialties: userProfile.specialties || '',
        experience: userProfile.experience || '',
        licenseNumber: userProfile.licenseNumber || '',
        brokerageName: userProfile.brokerageName || '',
        serviceAreas: userProfile.serviceAreas || '',
        languages: userProfile.languages || ''
      });
      fetchVerificationData();
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchAgentStats = async () => {
      if (!currentUser || !isAgent) return;

      try {
        setLoading(true);
        
        const proposalsQuery = query(
          collection(db, 'proposals'),
          where('agentId', '==', currentUser.uid)
        );
        const proposalsSnapshot = await getDocs(proposalsQuery);
        
        const totalProposals = proposalsSnapshot.size;
        const acceptedProposals = proposalsSnapshot.docs.filter(
          doc => doc.data().status === 'Accepted'
        ).length;
        
        const successRate = totalProposals > 0 
          ? Math.round((acceptedProposals / totalProposals) * 100) 
          : 0;
        
        setStats({
          totalProposals,
          acceptedProposals,
          totalTokensUsed: userProfile.tokensUsed || 0,
          successRate
        });
      } catch (error) {
        console.error('Error fetching agent stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAgent) {
      fetchAgentStats();
    }
  }, [currentUser, userProfile, isAgent]);

  const fetchVerificationData = async () => {
    if (!currentUser || !userProfile) return;
    
    setVerificationLoading(true);
    
    try {
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
          return;
      }
      
      const q = query(
        collection(db, collectionName),
        where('userId', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        let mostRecent = null;
        querySnapshot.forEach(doc => {
          const data = { id: doc.id, ...doc.data() };
          if (!mostRecent || (data.updatedAt && mostRecent.updatedAt && 
              data.updatedAt.seconds > mostRecent.updatedAt.seconds)) {
            mostRecent = data;
          }
        });
        setVerificationData(mostRecent);
      }
    } catch (error) {
      console.error('Error fetching verification data:', error);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateUserProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);
      
      setSuccessMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      setErrorMessage('Failed to update password. Please check your current password.');
      console.error('Error updating password:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationSuccess = () => {
    setSuccessMessage('Verification information submitted successfully!');
    setShowVerificationForm(false);
    fetchVerificationData();
  };

  // Subscription Badge Component
  const SubscriptionBadge = ({ tier }) => {
    const colors = {
      starter: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
      professional: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
      premium: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
      enterprise: { bg: '#ede9fe', text: '#5b21b6', border: '#a78bfa' }
    };

    const color = colors[tier?.id] || colors.starter;

    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        color: color.text,
        fontWeight: '600',
        fontSize: '0.875rem'
      }}>
        {tier?.id === 'professional' && '⭐ '}
        {tier?.id === 'premium' && '🌟 '}
        {tier?.id === 'enterprise' && '👑 '}
        {tier?.name} Member
      </div>
    );
  };

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          My Profile
        </h1>
        {!editing && !showPasswordForm && !showVerificationForm && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setEditing(true)}>
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

      {/* Messages */}
      {successMessage && (
        <div style={{ 
          backgroundColor: '#dcfce7', 
          color: '#166534', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          {errorMessage}
        </div>
      )}

      {/* Password Form */}
      {showPasswordForm ? (
        <Card>
          <form onSubmit={handlePasswordUpdate}>
            <CardHeader>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                Change Password
              </h2>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      ) : showVerificationForm ? (
        <Card>
          <CardHeader>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
              Profile Verification
            </h2>
          </CardHeader>
          <CardBody>
            {renderVerificationForm()}
          </CardBody>
          <CardFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowVerificationForm(false)}
            >
              Back to Profile
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          {/* Main Profile Card */}
          <div style={{ gridColumn: 'span 8' }}>
            <Card>
              <CardBody>
                {/* Profile Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.5rem',
                  marginBottom: '2rem',
                  paddingBottom: '2rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    {formData.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700',
                      marginBottom: '0.5rem' 
                    }}>
                      {formData.displayName}
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      {userProfile?.email}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {isAgent && <SubscriptionBadge tier={currentTier} />}
                      <VerificationStatusBadge status={userProfile?.verificationStatus || 'unverified'} />
                    </div>
                  </div>
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Display Name
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem'
                          }}
                        />
                      </div>

                      {isAgent && (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                License Number
                              </label>
                              <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                Brokerage Name
                              </label>
                              <input
                                type="text"
                                name="brokerageName"
                                value={formData.brokerageName}
                                onChange={handleChange}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '0.375rem'
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                              Years of Experience
                            </label>
                            <input
                              type="text"
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              placeholder="e.g., 5 years"
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                              Specialties (comma-separated)
                            </label>
                            <input
                              type="text"
                              name="specialties"
                              value={formData.specialties}
                              onChange={handleChange}
                              placeholder="e.g., Luxury Homes, First-time Buyers, Investment Properties"
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                              Service Areas (comma-separated)
                            </label>
                            <input
                              type="text"
                              name="serviceAreas"
                              value={formData.serviceAreas}
                              onChange={handleChange}
                              placeholder="e.g., Downtown, Westside, Suburbs"
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                              Languages (comma-separated)
                            </label>
                            <input
                              type="text"
                              name="languages"
                              value={formData.languages}
                              onChange={handleChange}
                              placeholder="e.g., English, Spanish, Mandarin"
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                              }}
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                        Contact Information
                      </h3>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div>
                          <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Email:</span>
                          <span style={{ color: '#6b7280' }}>{userProfile?.email}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Phone:</span>
                          <span style={{ color: '#6b7280' }}>{formData.phone || 'Not provided'}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Location:</span>
                          <span style={{ color: '#6b7280' }}>{formData.location || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    {isAgent && (
                      <>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                            Professional Information
                          </h3>
                          <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div>
                              <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>License:</span>
                              <span style={{ color: '#6b7280' }}>{formData.licenseNumber || 'Not provided'}</span>
                            </div>
                            <div>
                              <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Brokerage:</span>
                              <span style={{ color: '#6b7280' }}>{formData.brokerageName || 'Not provided'}</span>
                            </div>
                            <div>
                              <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Experience:</span>
                              <span style={{ color: '#6b7280' }}>{formData.experience || 'Not provided'}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                            Expertise
                          </h3>
                          <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div>
                              <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Specialties:</span>
                              <div style={{ marginTop: '0.5rem' }}>
                                {formData.specialties ? (
                                  formData.specialties.split(',').map((specialty, index) => (
                                    <span key={index} style={{
                                      display: 'inline-block',
                                      backgroundColor: '#f3f4f6',
                                      padding: '0.25rem 0.75rem',
                                      borderRadius: '9999px',
                                      marginRight: '0.5rem',
                                      marginBottom: '0.5rem',
                                      fontSize: '0.875rem'
                                    }}>
                                      {specialty.trim()}
                                    </span>
                                  ))
                                ) : (
                                  <span style={{ color: '#6b7280' }}>Not provided</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Service Areas:</span>
                              <div style={{ marginTop: '0.5rem' }}>
                                {formData.serviceAreas ? (
                                  formData.serviceAreas.split(',').map((area, index) => (
                                    <span key={index} style={{
                                      display: 'inline-block',
                                      backgroundColor: '#f3f4f6',
                                      padding: '0.25rem 0.75rem',
                                      borderRadius: '9999px',
                                      marginRight: '0.5rem',
                                      marginBottom: '0.5rem',
                                      fontSize: '0.875rem'
                                    }}>
                                      {area.trim()}
                                    </span>
                                  ))
                                ) : (
                                  <span style={{ color: '#6b7280' }}>Not provided</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <span style={{ fontWeight: '500', marginRight: '0.5rem' }}>Languages:</span>
                              <div style={{ marginTop: '0.5rem' }}>
                                {formData.languages ? (
                                  formData.languages.split(',').map((language, index) => (
                                    <span key={index} style={{
                                      display: 'inline-block',
                                      backgroundColor: '#f3f4f6',
                                      padding: '0.25rem 0.75rem',
                                      borderRadius: '9999px',
                                      marginRight: '0.5rem',
                                      marginBottom: '0.5rem',
                                      fontSize: '0.875rem'
                                    }}>
                                      {language.trim()}
                                    </span>
                                  ))
                                ) : (
                                  <span style={{ color: '#6b7280' }}>Not provided</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                        About
                      </h3>
                      <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                        {formData.bio || 'No bio provided'}
                      </p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div style={{ gridColumn: 'span 4' }}>
            {isAgent && (
              <>
                {/* Subscription Card */}
                <Card style={{ marginBottom: '1.5rem' }}>
                  <CardHeader>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                      Subscription Status
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <SubscriptionBadge tier={currentTier} />
                    </div>
                    <div style={{ 
                      backgroundColor: '#f9fafb', 
                      padding: '1rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500' }}>Monthly Tokens:</span>
                        <span>{currentTier?.monthlyTokens || 0}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '500' }}>Token Discount:</span>
                        <span>{(currentTier?.tokenDiscount * 100) || 0}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '500' }}>Price:</span>
                        <span>${currentTier?.price || 0}/month</span>
                      </div>
                    </div>
                    <Button
                      to="/agent/subscription"
                      variant={currentTier?.id === 'enterprise' ? 'secondary' : 'primary'}
                      fullWidth
                    >
                      {currentTier?.id === 'enterprise' ? 'View Plans' : 'Upgrade Plan'}
                    </Button>
                  </CardBody>
                </Card>

                {/* Performance Stats */}
                <Card>
                  <CardHeader>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                      Performance Stats
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div style={{ 
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>
                          {loading ? '...' : stats.successRate}%
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Success Rate
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem'
                      }}>
                        <div style={{ 
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.5rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                            {loading ? '...' : stats.totalProposals}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Total Proposals
                          </div>
                        </div>
                        
                        <div style={{ 
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.5rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                            {loading ? '...' : stats.acceptedProposals}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Accepted
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                          {loading ? '...' : stats.totalTokensUsed}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Tokens Used
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {/* Account Information and Verification */}
            <Card style={{ marginTop: '1.5rem' }}>
              <CardHeader>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>
                  Account Information
                </h3>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <span style={{ fontWeight: '500' }}>Account Type:</span>
                    <div style={{ 
                      marginTop: '0.25rem',
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.375rem',
                      textTransform: 'capitalize',
                      marginLeft: '0.5rem'
                    }}>
                      {userProfile?.userType}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>Member Since:</span>
                    <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                      {userProfile?.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowVerificationForm(true)}
                    fullWidth
                    variant={userProfile?.verificationStatus === 'verified' ? 'secondary' : 'primary'}
                  >
                    {userProfile?.verificationStatus === 'verified' 
                      ? 'View Verification' 
                      : userProfile?.verificationStatus === 'pending'
                      ? 'Update Verification'
                      : 'Verify Profile'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;