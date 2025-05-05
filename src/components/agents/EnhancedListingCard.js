// src/components/agents/EnhancedListingCard.js

import React from 'react';

const EnhancedListingCard = ({ listing, onSelect }) => {
  // Determine if this is a buyer or seller listing
  const isBuyerListing = listing.type === 'buyer' || listing.location !== undefined;
  
  // Format price/budget for display
  const formatPrice = (value) => {
    if (!value && value !== 0) return 'Not specified';
    return `$${value.toLocaleString()}`;
  };
  
  // Get budget display text
  const getBudgetDisplay = () => {
    if (isBuyerListing) {
      if (listing.budget) {
        return formatPrice(listing.budget);
      } else if (listing.priceRange?.min && listing.priceRange?.max) {
        return `${formatPrice(listing.priceRange.min)} - ${formatPrice(listing.priceRange.max)}`;
      }
      return 'Budget not specified';
    } else {
      return formatPrice(listing.price);
    }
  };
  
  // Generate a descriptive title if none exists
  const getDisplayTitle = () => {
    if (listing.title && listing.title !== 'Property Search Requirements') {
      return listing.title;
    }
    
    // For buyer listings
    if (isBuyerListing) {
      const location = listing.location || 'Any location';
      const bedrooms = listing.bedrooms ? `${listing.bedrooms} bed` : '';
      const bathrooms = listing.bathrooms ? `${listing.bathrooms} bath` : '';
      const roomInfo = bedrooms || bathrooms ? `${bedrooms}${bedrooms && bathrooms ? '/' : ''}${bathrooms}` : '';
      
      return `${location}${roomInfo ? ` - ${roomInfo}` : ''} - ${getBudgetDisplay()}`;
    } 
    // For seller listings
    else {
      const address = listing.address || 'Property for sale';
      const bedrooms = listing.bedrooms ? `${listing.bedrooms} bed` : '';
      const bathrooms = listing.bathrooms ? `${listing.bathrooms} bath` : '';
      const roomInfo = bedrooms || bathrooms ? `${bedrooms}${bedrooms && bathrooms ? '/' : ''}${bathrooms}` : '';
      
      return `${address}${roomInfo ? ` - ${roomInfo}` : ''} - ${getBudgetDisplay()}`;
    }
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    try {
      // Check if it's a Firestore timestamp
      if (timestamp.toDate) {
        const date = timestamp.toDate();
        return date.toLocaleDateString();
      }
      // Check if it's a seconds-based timestamp
      if (timestamp.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
      }
      // Fallback for other formats
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };
  
  return (
    <div 
      onClick={() => onSelect(listing)}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
    >
      {/* Header with listing type and status badges */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: isBuyerListing ? '#dbeafe' : '#fef3c7',
          color: isBuyerListing ? '#1e40af' : '#92400e',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {isBuyerListing ? 'Buyer' : 'Seller'}
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* Verification Badge */}
          {listing.verificationStatus === 'verified' && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
          
          {/* Timeline badge */}
          {isBuyerListing && listing.timeline && (
            <div style={{
              backgroundColor: '#f0fdf4',
              color: '#166534',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {listing.timeline}
            </div>
          )}
        </div>
      </div>
      
      {/* Title */}
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600',
        marginTop: '0.25rem',
        marginBottom: '0.75rem',
        color: '#111827'
      }}>
        {getDisplayTitle()}
      </h3>
      
      {/* Key Details Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1rem' 
      }}>
        {/* Budget/Price */}
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            {isBuyerListing ? 'Budget' : 'Asking Price'}
          </div>
          <div style={{ fontWeight: '600', color: '#047857' }}>
            {getBudgetDisplay()}
          </div>
        </div>
        
        {/* Location */}
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Location
          </div>
          <div style={{ fontWeight: '500' }}>
            {isBuyerListing ? (listing.location || 'Not specified') : (listing.address || 'Not specified')}
          </div>
        </div>
        
        {/* Timeline - For buyers */}
        {isBuyerListing && listing.timeline && (
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Timeline
            </div>
            <div style={{ fontWeight: '500' }}>
              {listing.timeline}
            </div>
          </div>
        )}
        
        {/* Property Type */}
        {listing.propertyType && (
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Property Type
            </div>
            <div style={{ fontWeight: '500' }}>
              {listing.propertyType}
            </div>
          </div>
        )}
      </div>
      
      {/* Features/Requirements */}
      {isBuyerListing && listing.mustHaveFeatures && listing.mustHaveFeatures.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Must-Have Features
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {listing.mustHaveFeatures.slice(0, 3).map((feature, index) => (
              <span key={index} style={{
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}>
                {feature}
              </span>
            ))}
            {listing.mustHaveFeatures.length > 3 && (
              <span style={{
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem'
              }}>
                +{listing.mustHaveFeatures.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Listing date and view button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '0.75rem'
      }}>
        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
          Listed: {formatDate(listing.createdAt)}
        </div>
        
        <button style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default EnhancedListingCard;