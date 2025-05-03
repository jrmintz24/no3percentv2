import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const ListingBrowser = () => {
  const { currentUser } = useAuth();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('buyer');
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Determine which collection to query based on the active tab
        const collectionName = activeTab === 'buyer' ? 'buyerListings' : 'sellerListings';
        
        console.log(`Attempting to fetch listings from ${collectionName}`);
        
        // Create a simple query to get active listings
        // Note: We're removing the status filter to see if any listings exist
        const listingsQuery = query(
          collection(db, collectionName),
          limit(10)
        );
        
        const listingsSnapshot = await getDocs(listingsQuery);
        console.log(`Found ${listingsSnapshot.size} listings`);
        
        const listingsData = [];
        
        listingsSnapshot.forEach((doc) => {
          listingsData.push({ id: doc.id, ...doc.data() });
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
  }, [activeTab]);
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Available Listings
        </h1>
      </div>
      
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('buyer')}
          style={{ 
            padding: '1rem 1.5rem',
            fontWeight: activeTab === 'buyer' ? 'bold' : 'normal',
            color: activeTab === 'buyer' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'buyer' ? '2px solid #2563eb' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Buyer Listings
        </button>
        <button
          onClick={() => setActiveTab('seller')}
          style={{ 
            padding: '1rem 1.5rem',
            fontWeight: activeTab === 'seller' ? 'bold' : 'normal',
            color: activeTab === 'seller' ? '#2563eb' : '#6b7280',
            borderBottom: activeTab === 'seller' ? '2px solid #2563eb' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Seller Listings
        </button>
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
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '2rem' 
        }}>
          Loading listings...
        </div>
      ) : (
        <>
          {listings.length > 0 ? (
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
                          {activeTab === 'buyer' 
                            ? (listing.title || 'Property Search Requirements') 
                            : (listing.propertyName || 'Property Listing')}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          Listed on: {listing.createdAt ? new Date(listing.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: '#e0f2fe', 
                        color: '#0369a1', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {activeTab === 'buyer' ? 'Buyer' : 'Seller'}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      {activeTab === 'buyer' ? (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Location:</p>
                              <p style={{ margin: '0', fontSize: '0.875rem' }}>{listing.location || 'Not specified'}</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Budget:</p>
                              <p style={{ margin: '0', fontSize: '0.875rem' }}>
                                {listing.budget ? `$${listing.budget.toLocaleString()}` : 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Bedrooms:</p>
                              <p style={{ margin: '0', fontSize: '0.875rem' }}>{listing.bedrooms || 'Not specified'}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Address:</p>
                              <p style={{ margin: '0', fontSize: '0.875rem' }}>{listing.address || 'Not specified'}</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Price:</p>
                              <p style={{ margin: '0', fontSize: '0.875rem' }}>
                                {listing.price ? `$${listing.price.toLocaleString()}` : 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.875rem' }}>Property Type:</p>
                              <p style={{ margin: '0', fontSize: '0.875rem' }}>{listing.propertyType || 'Not specified'}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        to={`/agent/${activeTab === 'buyer' ? 'buyer' : 'seller'}-listing/${listing.id}`}
                        size="small"
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
              padding: '3rem 1rem', 
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                No {activeTab} listings available at this time
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Check back later for new listings
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListingBrowser;