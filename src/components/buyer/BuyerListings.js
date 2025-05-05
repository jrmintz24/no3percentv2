// src/components/buyer/BuyerListings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const BuyerListings = () => {
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
        
        // Create a query to get listings for this buyer
        const listingsQuery = query(
          collection(db, 'buyerListings'),
          where('userId', '==', currentUser.uid)
        );
        
        const listingsSnapshot = await getDocs(listingsQuery);
        const listingsData = [];
        
        listingsSnapshot.forEach((doc) => {
          listingsData.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort on client side to avoid index issues
        listingsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA; // newest first
        });
        
        setListings(listingsData);
        setError('');
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Error loading listings: ' + err.message);
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
          My Listings
        </h1>
        <Button 
          to="/buyer/create-listing"
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
      ) : (
        <>
          {listings.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
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
                          {listing.propertyType || 'Property Search Requirements'}
                        </h2>
                        <p style={{ 
                          color: '#6b7280', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                          marginBottom: '0.5rem' 
                        }}>
                          Created: {listing.createdAt?.toDate ? listing.createdAt.toDate().toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: getStatusColor(listing.status).bg, 
                        color: getStatusColor(listing.status).text, 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        alignSelf: isMobile ? 'flex-start' : 'flex-start'
                      }}>
                        {listing.status || 'active'}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '1rem', 
                      marginBottom: '1rem' 
                    }}>
                      <div>
                        <p style={{ 
                          margin: '0 0 0.25rem 0', 
                          fontWeight: '500', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          Location:
                        </p>
                        <p style={{ 
                          margin: '0', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          {listing.desiredLocation || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p style={{ 
                          margin: '0 0 0.25rem 0', 
                          fontWeight: '500', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          Budget:
                        </p>
                        <p style={{ 
                          margin: '0', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          ${listing.minPrice?.toLocaleString() || '0'} - ${listing.maxPrice?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p style={{ 
                          margin: '0 0 0.25rem 0', 
                          fontWeight: '500', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          Timeline:
                        </p>
                        <p style={{ 
                          margin: '0', 
                          fontSize: isMobile ? '0.8125rem' : '0.875rem' 
                        }}>
                          {listing.timeline || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end' 
                    }}>
                      <Button 
                        to={`/buyer/listing/${listing.id}`}
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
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? '2rem 1rem' : '3rem 1rem', 
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              color: '#6b7280'
            }}>
              <p style={{ 
                fontSize: isMobile ? '1rem' : '1.125rem', 
                marginBottom: '0.5rem' 
              }}>
                You haven't created any listings yet
              </p>
              <p style={{ 
                fontSize: isMobile ? '0.8125rem' : '0.875rem', 
                marginBottom: '1.5rem' 
              }}>
                Create a listing to start looking for the perfect real estate agent
              </p>
              <Button 
                to="/buyer/create-listing"
                style={isMobile ? { width: '100%' } : {}}
              >
                Create New Listing
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to get status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
      return { bg: '#dcfce7', text: '#15803d' };
    case 'paused':
      return { bg: '#fef3c7', text: '#b45309' };
    case 'active':
    default:
      return { bg: '#e0f2fe', text: '#0369a1' };
  }
};

export default BuyerListings;