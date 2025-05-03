import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, startAfter, limit, endBefore, limitToLast } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const ListingSearch = () => {
  // State for search/filter parameters
  const [searchParams, setSearchParams] = useState({
    type: 'buyer', // 'buyer' or 'seller'
    keyword: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
    sortBy: 'createdAt_desc' // Format: 'field_direction'
  });
  
  // State for listings
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;
  
  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };
  
  // Function to build the query based on search parameters
  const buildQuery = (collectionName, isNext = true) => {
    // Split the sortBy value to get field and direction
    const [sortField, sortDirection] = searchParams.sortBy.split('_');
    
    let baseQuery = collection(db, collectionName);
    const queryConstraints = [];
    
    // Add filters
    if (searchParams.location) {
      // Use array-contains for location (assuming location is stored as an array or has a search index)
      queryConstraints.push(where('location', '>=', searchParams.location));
      queryConstraints.push(where('location', '<=', searchParams.location + '\uf8ff'));
    }
    
    if (searchParams.propertyType) {
      queryConstraints.push(where('propertyType', '==', searchParams.propertyType));
    }
    
    if (searchParams.bedrooms) {
      queryConstraints.push(where('bedrooms', '==', searchParams.bedrooms));
    }
    
    // Add price range for seller listings
    if (searchParams.type === 'seller') {
      if (searchParams.minPrice) {
        queryConstraints.push(where('price', '>=', parseFloat(searchParams.minPrice)));
      }
      
      if (searchParams.maxPrice) {
        queryConstraints.push(where('price', '<=', parseFloat(searchParams.maxPrice)));
      }
    }
    
    // Add budget range for buyer listings
    if (searchParams.type === 'buyer') {
      if (searchParams.minPrice) {
        queryConstraints.push(where('budget', '>=', parseFloat(searchParams.minPrice)));
      }
      
      if (searchParams.maxPrice) {
        queryConstraints.push(where('budget', '<=', parseFloat(searchParams.maxPrice)));
      }
    }
    
    // Add sort
    queryConstraints.push(orderBy(sortField, sortDirection === 'asc' ? 'asc' : 'desc'));
    
    // Add pagination
    if (isNext && lastVisible) {
      queryConstraints.push(startAfter(lastVisible));
      queryConstraints.push(limit(ITEMS_PER_PAGE));
    } else if (!isNext && firstVisible) {
      queryConstraints.push(endBefore(firstVisible));
      queryConstraints.push(limitToLast(ITEMS_PER_PAGE));
    } else {
      queryConstraints.push(limit(ITEMS_PER_PAGE));
    }
    
    return query(baseQuery, ...queryConstraints);
  };
  
  // Function to handle form submission
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setPage(1);
      setLastVisible(null);
      setFirstVisible(null);
      
      const collectionName = searchParams.type === 'buyer' ? 'buyerListings' : 'sellerListings';
      const searchQuery = buildQuery(collectionName);
      
      const snapshot = await getDocs(searchQuery);
      
      if (!snapshot.empty) {
        const listingsData = [];
        
        snapshot.forEach((doc) => {
          // If keyword is specified, filter client-side
          const data = { id: doc.id, ...doc.data() };
          
          if (searchParams.keyword) {
            const keyword = searchParams.keyword.toLowerCase();
            const matchesKeyword = (
              (data.title && data.title.toLowerCase().includes(keyword)) ||
              (data.propertyName && data.propertyName.toLowerCase().includes(keyword)) ||
              (data.description && data.description.toLowerCase().includes(keyword)) ||
              (data.additionalInfo && data.additionalInfo.toLowerCase().includes(keyword)) ||
              (data.address && data.address.toLowerCase().includes(keyword))
            );
            
            if (matchesKeyword) {
              listingsData.push(data);
            }
          } else {
            listingsData.push(data);
          }
        });
        
        setListings(listingsData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setFirstVisible(snapshot.docs[0]);
        setHasMore(snapshot.docs.length === ITEMS_PER_PAGE);
      } else {
        setListings([]);
        setLastVisible(null);
        setFirstVisible(null);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error searching listings:', err);
      setError('Error searching listings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle pagination
  const handlePagination = async (direction) => {
    try {
      setLoading(true);
      setError('');
      
      const isNext = direction === 'next';
      const collectionName = searchParams.type === 'buyer' ? 'buyerListings' : 'sellerListings';
      const paginationQuery = buildQuery(collectionName, isNext);
      
      const snapshot = await getDocs(paginationQuery);
      
      if (!snapshot.empty) {
        const listingsData = [];
        
        snapshot.forEach((doc) => {
          // If keyword is specified, filter client-side
          const data = { id: doc.id, ...doc.data() };
          
          if (searchParams.keyword) {
            const keyword = searchParams.keyword.toLowerCase();
            const matchesKeyword = (
              (data.title && data.title.toLowerCase().includes(keyword)) ||
              (data.propertyName && data.propertyName.toLowerCase().includes(keyword)) ||
              (data.description && data.description.toLowerCase().includes(keyword)) ||
              (data.additionalInfo && data.additionalInfo.toLowerCase().includes(keyword)) ||
              (data.address && data.address.toLowerCase().includes(keyword))
            );
            
            if (matchesKeyword) {
              listingsData.push(data);
            }
          } else {
            listingsData.push(data);
          }
        });
        
        setListings(listingsData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setFirstVisible(snapshot.docs[0]);
        setPage(prevPage => isNext ? prevPage + 1 : prevPage - 1);
        setHasMore(snapshot.docs.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error navigating listings:', err);
      setError('Error navigating listings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Run initial search on component mount
  useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Helper function to format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      return timestamp.toDate().toLocaleDateString();
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
          Search Listings
        </h1>
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
      
      <Card style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSearch}>
          <CardBody>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label 
                  htmlFor="type" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Listing Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={searchParams.type}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <option value="buyer">Buyer Requirements</option>
                  <option value="seller">Properties for Sale</option>
                </select>
              </div>
              
              <div>
                <label 
                  htmlFor="keyword" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Keyword Search
                </label>
                <input
                  id="keyword"
                  name="keyword"
                  type="text"
                  value={searchParams.keyword}
                  onChange={handleInputChange}
                  placeholder="Search by keyword"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
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
                  value={searchParams.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Seattle"
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
                  htmlFor="propertyType" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Property Type
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={searchParams.propertyType}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <option value="">Any</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Multi-Family">Multi-Family</option>
                  <option value="Land">Land</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label 
                  htmlFor="bedrooms" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={searchParams.bedrooms}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <option value="">Any</option>
                  <option value="Studio">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label 
                  htmlFor="minPrice" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Min {searchParams.type === 'buyer' ? 'Budget' : 'Price'} (USD)
                </label>
                <input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  value={searchParams.minPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 200000"
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
                  htmlFor="maxPrice" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Max {searchParams.type === 'buyer' ? 'Budget' : 'Price'} (USD)
                </label>
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  value={searchParams.maxPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., 500000"
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
                  htmlFor="sortBy" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500' 
                  }}
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={searchParams.sortBy}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  {searchParams.type === 'seller' && (
                    <>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </>
                  )}
                  {searchParams.type === 'buyer' && (
                    <>
                      <option value="budget_asc">Budget: Low to High</option>
                      <option value="budget_desc">Budget: High to Low</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Listings'}
              </Button>
            </div>
          </CardBody>
        </form>
      </Card>
      
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Search Results ({listings.length})
        </h2>
        
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '2rem' 
          }}>
            Searching listings...
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
                            {searchParams.type === 'buyer' 
                              ? (listing.title || 'Property Search Requirements') 
                              : (listing.propertyName || 'Property Listing')}
                          </h2>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            Created: {formatDate(listing.createdAt)}
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
                          {searchParams.type === 'buyer' ? 'Buyer' : 'Seller'}
                        </div>
                      </div>
                      
                      {searchParams.type === 'buyer' ? (
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
                      ) : (
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
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          to={`/agent/${searchParams.type === 'buyer' ? 'buyer' : 'seller'}-listing/${listing.id}`}
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
                  No listings found matching your criteria
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Try adjusting your search filters
                </p>
              </div>
            )}
            
            {/* Pagination Controls */}
            {listings.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '2rem' 
              }}>
                <Button 
                  onClick={() => handlePagination('prev')}
                  disabled={page === 1 || loading}
                  variant="secondary"
                  size="small"
                >
                  Previous Page
                </Button>
                
                <div style={{ padding: '0.5rem 0' }}>
                  Page {page}
                </div>
                
                <Button 
                  onClick={() => handlePagination('next')}
                  disabled={!hasMore || loading}
                  variant="secondary"
                  size="small"
                >
                  Next Page
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListingSearch;