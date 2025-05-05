// src/components/agents/ListingBrowser.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedListingCard from './EnhancedListingCard'; // Import from the same directory
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ListingBrowser = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [buyerListings, setBuyerListings] = useState([]);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'buyer', 'seller'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'budgetHigh', 'budgetLow'
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log("Attempting to fetch listings from buyerListings");
        const buyerQuery = query(
          collection(db, 'buyerListings'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const buyerDocs = await getDocs(buyerQuery);
        const buyerData = buyerDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'buyer'
        }));
        
        setBuyerListings(buyerData);
        console.log(`Found ${buyerData.length} buyer listings`);
        
        console.log("Attempting to fetch listings from sellerListings");
        const sellerQuery = query(
          collection(db, 'sellerListings'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const sellerDocs = await getDocs(sellerQuery);
        const sellerData = sellerDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'seller'
        }));
        
        setSellerListings(sellerData);
        console.log(`Found ${sellerData.length} seller listings`);
        
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(`Error loading listings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
  const handleSelectListing = (listing) => {
    if (listing.type === 'buyer') {
      navigate(`/agent/buyer-listing/${listing.id}`);
    } else {
      navigate(`/agent/seller-listing/${listing.id}`);
    }
  };
  
  // Filtered and sorted listings
  const getFilteredListings = () => {
    let filteredListings = [];
    
    // Filter by listing type
    if (activeTab === 'all') {
      filteredListings = [...buyerListings, ...sellerListings];
    } else if (activeTab === 'buyer') {
      filteredListings = [...buyerListings];
    } else {
      filteredListings = [...sellerListings];
    }
    
    // Filter by verification status
    if (verifiedOnly) {
      filteredListings = filteredListings.filter(listing => 
        listing.verificationStatus === 'verified'
      );
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filteredListings = filteredListings.filter(listing => {
        // Search in title/property name
        if ((listing.title && listing.title.toLowerCase().includes(term)) || 
            (listing.propertyName && listing.propertyName.toLowerCase().includes(term))) {
          return true;
        }
        
        // Search in location/address
        if ((listing.location && listing.location.toLowerCase().includes(term)) || 
            (listing.address && listing.address.toLowerCase().includes(term))) {
          return true;
        }
        
        // Search in description/additional info
        if ((listing.description && listing.description.toLowerCase().includes(term)) || 
            (listing.additionalInfo && listing.additionalInfo.toLowerCase().includes(term))) {
          return true;
        }
        
        // Search in property type
        if (listing.propertyType && listing.propertyType.toLowerCase().includes(term)) {
          return true;
        }
        
        return false;
      });
    }
    
    // Sort listings
    return filteredListings.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case 'oldest':
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case 'budgetHigh':
          const bValue = b.budget || b.price || (b.priceRange?.max || 0);
          const aValue = a.budget || a.price || (a.priceRange?.max || 0);
          return bValue - aValue;
        case 'budgetLow':
          const aValue2 = a.budget || a.price || (a.priceRange?.max || 0);
          const bValue2 = b.budget || b.price || (b.priceRange?.max || 0);
          return aValue2 - bValue2;
        default:
          return 0;
      }
    });
  };
  
  const filteredListings = getFilteredListings();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <LoadingSpinner />
        <p style={{ marginLeft: '1rem' }}>Loading listings...</p>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Card>
        <CardHeader>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              Browse Listings
            </h1>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button to="/agent/search" variant="secondary">
                Advanced Search
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardBody>
          {/* Search and Filter Bar */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Quick search */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  flex: 1
                }}
              />
            </div>
            
            {/* Filters */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '1rem'
            }}>
              {/* Type filter tabs */}
              <div style={{ 
                display: 'flex',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => setActiveTab('all')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: activeTab === 'all' ? '#dbeafe' : 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: activeTab === 'all' ? '600' : '400',
                    color: activeTab === 'all' ? '#2563eb' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  All Listings
                </button>
                <button
                  onClick={() => setActiveTab('buyer')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: activeTab === 'buyer' ? '#dbeafe' : 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: activeTab === 'buyer' ? '600' : '400',
                    color: activeTab === 'buyer' ? '#2563eb' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  Buyers
                </button>
                <button
                  onClick={() => setActiveTab('seller')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: activeTab === 'seller' ? '#dbeafe' : 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: activeTab === 'seller' ? '600' : '400',
                    color: activeTab === 'seller' ? '#2563eb' : '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  Sellers
                </button>
              </div>
              
              {/* Sort and verification filters */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="verifiedOnly"
                    checked={verifiedOnly}
                    onChange={() => setVerifiedOnly(!verifiedOnly)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="verifiedOnly" style={{ fontSize: '0.875rem' }}>
                    Verified only
                  </label>
                </div>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="budgetHigh">Budget: High to Low</option>
                  <option value="budgetLow">Budget: Low to High</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Listing count */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem' 
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Showing {filteredListings.length} listings
            </div>
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem'
                }}
              >
                Clear search
              </button>
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
          
          {/* Listings */}
          {filteredListings.length > 0 ? (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {filteredListings.map(listing => (
                <EnhancedListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={handleSelectListing}
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                No listings found with the current filters.
              </p>
              <Button onClick={() => {
                setActiveTab('all');
                setVerifiedOnly(false);
                setSearchTerm('');
              }}>
                Reset Filters
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Footer with link to advanced search */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <p style={{ marginRight: '1rem', color: '#6b7280' }}>
          Need more specific search options?
        </p>
        <Button to="/agent/search" variant="secondary" size="small">
          Advanced Search
        </Button>
      </div>
    </div>
  );
};

export default ListingBrowser;