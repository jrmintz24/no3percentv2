// src/components/services/ServiceCompletion.js
import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

const ServiceCompletion = ({ service, userRole }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleConfirmCompletion = async () => {
    try {
      setLoading(true);
      
      const updateData = {};
      
      if (userRole === 'agent') {
        updateData.agentConfirmed = true;
        updateData.agentConfirmedAt = serverTimestamp();
      } else {
        updateData.clientConfirmed = true;
        updateData.clientConfirmedAt = serverTimestamp();
        if (rating > 0) {
          updateData.clientRating = rating;
        }
        if (feedback) {
          updateData.clientFeedback = feedback;
        }
      }
      
      // Check if both parties have confirmed
      const bothConfirmed = userRole === 'agent' 
        ? service.clientConfirmed && true 
        : service.agentConfirmed && true;
      
      if (bothConfirmed) {
        updateData.status = 'completed';
        updateData.completedAt = serverTimestamp();
      }
      
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(doc(db, 'transactionServices', service.id), updateData);
      
    } catch (error) {
      console.error('Error confirming completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const isConfirmed = userRole === 'agent' ? service.agentConfirmed : service.clientConfirmed;
  const otherPartyConfirmed = userRole === 'agent' ? service.clientConfirmed : service.agentConfirmed;

  if (service.status === 'completed') {
    return (
      <div style={{
        backgroundColor: '#dcfce7',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#166534' }}>
          Service Completed
        </h3>
        <p style={{ color: '#166534', marginTop: '0.5rem' }}>
          This service was completed on {service.completedAt?.toDate?.()?.toLocaleDateString() || 'recently'}
        </p>
        
        {service.clientRating && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star}
                  style={{ 
                    color: star <= service.clientRating ? '#fbbf24' : '#d1d5db',
                    fontSize: '1.5rem'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            {service.clientFeedback && (
              <p style={{ 
                marginTop: '0.5rem', 
                fontStyle: 'italic',
                color: '#374151'
              }}>
                "{service.clientFeedback}"
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
        Service Completion
      </h3>
      
      {/* Status Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: service.agentConfirmed ? '#dcfce7' : '#f3f4f6',
          border: '1px solid',
          borderColor: service.agentConfirmed ? '#86efac' : '#e5e7eb'
        }}>
          <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
            Agent Confirmation
          </h4>
          <p style={{ 
            color: service.agentConfirmed ? '#166534' : '#6b7280',
            fontSize: '0.875rem'
          }}>
            {service.agentConfirmed ? '✓ Confirmed' : 'Pending'}
          </p>
        </div>
        
        <div style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: service.clientConfirmed ? '#dcfce7' : '#f3f4f6',
          border: '1px solid',
          borderColor: service.clientConfirmed ? '#86efac' : '#e5e7eb'
        }}>
          <h4 style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
            Client Approval
          </h4>
          <p style={{ 
            color: service.clientConfirmed ? '#166534' : '#6b7280',
            fontSize: '0.875rem'
          }}>
            {service.clientConfirmed ? '✓ Approved' : 'Pending'}
          </p>
        </div>
      </div>

      {/* Completion Form */}
      {!isConfirmed && service.status === 'in-progress' && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          {userRole === 'client' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Rate this service:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '2rem',
                        color: star <= rating ? '#fbbf24' : '#d1d5db',
                        padding: '0'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Feedback (optional):
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem'
                  }}
                  placeholder="How was your experience with this service?"
                />
              </div>
            </>
          )}
          
          <Button 
            onClick={handleConfirmCompletion}
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : userRole === 'agent' 
                ? 'Confirm Service Completed' 
                : 'Approve & Complete Service'
            }
          </Button>
          
          {userRole === 'client' && (
            <p style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.875rem', 
              color: '#6b7280' 
            }}>
              By approving, you confirm this service has been completed to your satisfaction.
            </p>
          )}
        </div>
      )}
      
      {isConfirmed && !otherPartyConfirmed && (
        <div style={{
          backgroundColor: '#fef9c3',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: '#854d0e'
        }}>
          <p>
            Waiting for {userRole === 'agent' ? 'client' : 'agent'} to confirm completion.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceCompletion;