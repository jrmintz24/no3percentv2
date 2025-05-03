// src/components/seller/SellerListings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const SellerListings = () => {
  const { currentUser } = useAuth();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        setDebug('Starting to fetch listings');
        
        if (!currentUser) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        setDebug(`User authenticated with ID: ${currentUser.uid}`);
        
        // Query listings where the current user is the owner
        const listingsQuery = query(
          collection(db, 'sellerListings'),
          where('userId', '==', currentUser.uid)
        );
        
        setDebug('Query created, attempting to fetch listings');
        
        const listingsSnapshot = await getDocs(listingsQuery);
        
        setDebug(`Query executed. Found ${listingsSnapshot.size} listings`);
        
        const listingsData = [];
        
        listingsSnapshot.forEach((doc) => {
          listingsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setDebug('Processed listings data');
        setListings(listingsData);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(`Error loading listings: ${err.message}`);
        setDebug(`Error details: ${JSON.stringify(err)}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [currentUser]);
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          My Property Listings
        </h1>
        
        <Button to="/seller/create-listing">
          Create New Listing
        </Button>
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
          {debug && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Debug info: {debug}
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '2rem' 
        }}>
          Loading listings...
        </div>
      ) : listings.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '3rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            You haven't created any listings yet
          </h2>
          <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
            Create a listing to start looking for real estate agents
          </p>
          <Button to="/seller/create-listing">
            Create a Listing
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardBody>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {listing.propertyName || 'Property Listing'}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {listing.address || 'No address provided'}
                    </p>
                    <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2563eb' }}>
                      {listing.price ? `$${listing.price.toLocaleString()}` : 'Price not specified'}
                    </p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: getStatusBadgeColor(listing.status).bg, 
                    color: getStatusBadgeColor(listing.status).text, 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {listing.status || 'Active'}
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <div>{listing.bedrooms || 0} bd</div>
                    <div>{listing.bathrooms || 0} ba</div>
                    <div>{listing.squareFootage ? `${listing.squareFootage.toLocaleString()} sqft` : 'N/A'}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button 
                    to={`/seller/proposals/${listing.id}`}
                    variant="secondary"
                    size="small"
                  >
                    View Proposals
                  </Button>
                  <Button 
                    to={`/seller/listing/${listing.id}`}
                    size="small"
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
    case 'Pending':
      return { bg: '#e0f2fe', text: '#0369a1' };
    case 'Under Contract':
      return { bg: '#fef9c3', text: '#854d0e' };
    case 'Sold':
      return { bg: '#dcfce7', text: '#15803d' };
    case 'Inactive':
      return { bg: '#f3f4f6', text: '#6b7280' };
    case 'Active':
    default:
      return { bg: '#dbeafe', text: '#1e40af' };
  }
};

export default SellerListings;