// src/components/seller/SellerListings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const SellerListings = () => {
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser) {
        setError('You must be logged in to view your listings');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Query listings where the current user is the owner
        const listingsQuery = query(
          collection(db, 'sellerListings'),
          where('userId', '==', currentUser.uid)
        );
        
        const listingsSnapshot = await getDocs(listingsQuery);
        const listingsData = [];
        
        listingsSnapshot.forEach((doc) => {
          listingsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort on client side to avoid index issues
        listingsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA; // newest first
        });
        
        setListings(listingsData);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(`Error loading listings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [currentUser]);
  
  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem 1rem' 
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? '1rem' : '0',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: isMobile ? '1.25rem' : '1.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          My Property Listings
        </h1>
        
        <Button 
          to="/seller/create-listing"
          style={isMobile ? { width: '100%' } : {}}
        >
          Create New Listing
        </Button>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '2rem',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          Loading listings...
        </div>
      ) : listings.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: isMobile ? '2rem 1rem' : '3rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: isMobile ? '1rem' : '1.25rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>
            You haven't created any listings yet
          </h2>
          <p style={{ 
            marginBottom: '2rem', 
            color: '#6b7280',
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Create a listing to start looking for real estate agents
          </p>
          <Button 
            to="/seller/create-listing"
            style={isMobile ? { width: '100%' } : {}}
          >
            Create a Listing
          </Button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem' 
        }}>
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardBody style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: isMobile ? 'flex-start' : 'flex-start',
                  gap: isMobile ? '1rem' : '0',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h2 style={{ 
                      fontSize: isMobile ? '1.125rem' : '1.25rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem' 
                    }}>
                      {listing.propertyType || 'Property Listing'}
                    </h2>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                      marginBottom: '0.5rem' 
                    }}>
                      {listing.propertyAddress || 'No address provided'}
                    </p>
                    <p style={{ 
                      fontSize: isMobile ? '1rem' : '1.125rem', 
                      fontWeight: '600', 
                      color: '#2563eb' 
                    }}>
                      ${listing.askingPrice?.toLocaleString() || '0'}
                    </p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: getStatusBadgeColor(listing.status).bg, 
                    color: getStatusBadgeColor(listing.status).text, 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    alignSelf: isMobile ? 'flex-start' : 'flex-start'
                  }}>
                    {listing.status || 'active'}
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    color: '#6b7280', 
                    fontSize: isMobile ? '0.8125rem' : '0.875rem',
                    flexWrap: 'wrap'
                  }}>
                    <div>{listing.bedrooms || 0} bd</div>
                    <div>{listing.bathrooms || 0} ba</div>
                    <div>{listing.squareFootage ? `${listing.squareFootage.toLocaleString()} sqft` : 'N/A'}</div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'flex-end', 
                  gap: isMobile ? '0.75rem' : '0.5rem' 
                }}>
                  <Button 
                    to={`/seller/proposals?listingId=${listing.id}`}
                    variant="secondary"
                    size={isMobile ? 'medium' : 'small'}
                    style={isMobile ? { width: '100%' } : {}}
                  >
                    View Proposals
                  </Button>
                  <Button 
                    to={`/seller/listing/${listing.id}`}
                    size={isMobile ? 'medium' : 'small'}
                    style={isMobile ? { width: '100%' } : {}}
                  >
                    View Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get status badge color
const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'pending':
      return { bg: '#e0f2fe', text: '#0369a1' };
    case 'undercontract':
      return { bg: '#fef9c3', text: '#854d0e' };
    case 'sold':
      return { bg: '#dcfce7', text: '#15803d' };
    case 'inactive':
      return { bg: '#f3f4f6', text: '#6b7280' };
    case 'accepted':
      return { bg: '#dbeafe', text: '#1e40af' };
    case 'active':
    default:
      return { bg: '#dbeafe', text: '#1e40af' };
  }
};

export default SellerListings;