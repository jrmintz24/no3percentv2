// src/pages/TransactionsListPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TransactionsListPage = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const loadTransactions = async () => {
      try {
        console.log('Loading transactions for user:', currentUser.uid);
        setLoading(true);
        
        // Use getDocs instead of onSnapshot to reduce complexity
        // Also, temporarily remove the orderBy clause while indexes are being created
        const asAgentQuery = query(
          collection(db, 'transactions'),
          where('agentId', '==', currentUser.uid)
          // Add this back once the index is created:
          // orderBy('createdAt', 'desc')
        );

        const asClientQuery = query(
          collection(db, 'transactions'),
          where('clientId', '==', currentUser.uid)
          // Add this back once the index is created:
          // orderBy('createdAt', 'desc')
        );
        
        // Execute queries
        const [agentSnapshot, clientSnapshot] = await Promise.all([
          getDocs(asAgentQuery),
          getDocs(asClientQuery)
        ]);
        
        // Process agent transactions
        const agentTransactions = agentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          role: 'agent'
        }));
        console.log('Agent transactions loaded:', agentTransactions.length);
        
        // Process client transactions
        const clientTransactions = clientSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          role: 'client'
        }));
        console.log('Client transactions loaded:', clientTransactions.length);
        
        // Combine and sort manually since we're not using orderBy in the query
        const allTransactions = [...agentTransactions, ...clientTransactions];
        allTransactions.sort((a, b) => {
          // Handle missing createdAt values
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          
          // Convert Firestore timestamps
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          
          // Sort descending (newest first)
          return timeB - timeA;
        });
        
        setTransactions(allTransactions);
        setError(null);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError(`Error loading transactions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [currentUser]);

  // Format price with proper commas
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Not set';
    return price.toLocaleString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column'
      }}>
        {/* Fix the JSX attribute warning by removing it */}
        <LoadingSpinner />
        <p style={{ marginTop: '1rem' }}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem' }}>
        Your Transactions
      </h1>

      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem',
          marginBottom: '1.5rem'
        }}>
          {error}
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Note: If this error mentions "requires an index", please follow the link to create the necessary Firestore indexes.
          </p>
        </div>
      )}

      {transactions.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '2rem', 
          textAlign: 'center',
          borderRadius: '0.5rem'
        }}>
          {error ? (
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              Couldn't load transactions due to an error.
            </p>
          ) : (
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              You don't have any active transactions yet.
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {transactions.map(transaction => {
            const statusStyle = getStatusColor(transaction.status);
            
            return (
              <Card key={transaction.id}>
                <CardHeader>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <h2 style={{ 
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      margin: 0
                    }}>
                      {transaction.propertyDetails?.address || 'Transaction'} 
                      <span style={{ 
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        fontWeight: 'normal',
                        marginLeft: '0.5rem'
                      }}>
                        ({transaction.listingType === 'buyer' ? 'Buyer Transaction' : 'Seller Transaction'})
                      </span>
                    </h2>

                    <div>
                      <span style={{ 
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {transaction.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    {transaction.propertyDetails?.price && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Price</span>
                        <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                          ${formatPrice(transaction.propertyDetails.price)}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Created</span>
                      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    
                    {transaction.timeline?.expectedClosing && (
                      <div>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Closing</span>
                        <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0' }}>
                          {formatDate(transaction.timeline.expectedClosing)}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Your Role</span>
                      <p style={{ fontWeight: '500', margin: '0.25rem 0 0 0', textTransform: 'capitalize' }}>
                        {transaction.role}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link 
                      to={`/transaction/${transaction.id}`}
                      style={{ 
                        backgroundColor: '#2563eb', 
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      View Transaction
                    </Link>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionsListPage;