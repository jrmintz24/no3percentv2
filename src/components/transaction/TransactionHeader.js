// src/components/transaction/TransactionHeader.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

const TransactionHeader = ({ transaction, isAgent, isClient }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'completed':
        return { bg: '#dcfce7', text: '#166534' };
      case 'pending':
        return { bg: '#fef9c3', text: '#854d0e' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const statusStyle = getStatusColor(transaction.status);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem' 
          }}>
            Transaction Dashboard
          </h1>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {transaction.status}
            </span>
            <span style={{ 
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              {transaction.listingType === 'buyer' ? 'Buyer Transaction' : 'Seller Transaction'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>

      {/* Property Details */}
      {transaction.propertyDetails && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            marginBottom: '0.75rem' 
          }}>
            Property Details
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {transaction.propertyDetails.address && (
              <div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Address</span>
                <p style={{ fontWeight: '500' }}>{transaction.propertyDetails.address}</p>
              </div>
            )}
            {transaction.propertyDetails.price && (
              <div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Price</span>
                <p style={{ fontWeight: '500' }}>
                  ${transaction.propertyDetails.price.toLocaleString()}
                </p>
              </div>
            )}
            {transaction.propertyDetails.propertyType && (
              <div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Property Type</span>
                <p style={{ fontWeight: '500' }}>{transaction.propertyDetails.propertyType}</p>
              </div>
            )}
            {transaction.propertyDetails.bedrooms && (
              <div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bedrooms</span>
                <p style={{ fontWeight: '500' }}>{transaction.propertyDetails.bedrooms}</p>
              </div>
            )}
            {transaction.propertyDetails.bathrooms && (
              <div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bathrooms</span>
                <p style={{ fontWeight: '500' }}>{transaction.propertyDetails.bathrooms}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commission Details */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '1rem',
        borderRadius: '0.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '0.75rem' 
        }}>
          Commission Details
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Fee Structure</span>
            <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>
              {transaction.feeStructure}
            </p>
          </div>
          {transaction.feeStructure === 'percentage' && transaction.commissionRate && (
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Commission Rate</span>
              <p style={{ fontWeight: '500' }}>{transaction.commissionRate}%</p>
            </div>
          )}
          {transaction.feeStructure === 'flat' && transaction.flatFee && (
            <div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Flat Fee</span>
              <p style={{ fontWeight: '500' }}>${transaction.flatFee.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;