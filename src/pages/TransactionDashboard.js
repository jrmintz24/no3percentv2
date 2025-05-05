// src/pages/TransactionDashboard.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useAuth } from '../contexts/AuthContext';
import TransactionHeader from '../components/transaction/TransactionHeader';
import TransactionOverview from '../components/transaction/TransactionOverview';
import ServicesList from '../components/services/ServicesList';
import DocumentManager from '../components/documents/DocumentManager';
import TransactionTimeline from '../components/transaction/TransactionTimeline';
import TransactionMessages from '../components/transaction/TransactionMessages';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TransactionDashboard = () => {
  const { transactionId } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("TransactionDashboard mounted with params:", { 
      transactionId, 
      currentUser: currentUser?.uid 
    });
    
    // Handle missing parameters
    if (!transactionId) {
      console.log("Missing transactionId, redirecting to transactions list");
      navigate('/transactions');
      return;
    }
    
    if (!currentUser) {
      console.log("No authenticated user");
      return;
    }

    // Handle resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Subscribe to transaction updates
    console.log("Attempting to fetch transaction:", transactionId);
    const unsubscribeTransaction = onSnapshot(
      doc(db, 'transactions', transactionId),
      (doc) => {
        console.log("Transaction doc snapshot received", { exists: doc.exists() });
        if (doc.exists()) {
          const data = { id: doc.id, ...doc.data() };
          console.log("Transaction data:", data);
          setTransaction(data);
          
          // Verify user has access
          if (data.clientId !== currentUser.uid && data.agentId !== currentUser.uid) {
            console.log("Access denied - user not associated with transaction", { 
              currentUserId: currentUser.uid, 
              clientId: data.clientId, 
              agentId: data.agentId 
            });
            setError('You do not have access to this transaction');
          }
        } else {
          console.log("Transaction document not found");
          setError('Transaction not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching transaction:', error);
        setError('Error loading transaction details: ' + error.message);
        setLoading(false);
      }
    );

    // Subscribe to transaction services
    console.log("Attempting to fetch transaction services for:", transactionId);
    const servicesQuery = query(
      collection(db, 'transactionServices'),
      where('transactionId', '==', transactionId)
    );

    const unsubscribeServices = onSnapshot(servicesQuery, 
      (snapshot) => {
        console.log("Transaction services snapshot received", { count: snapshot.docs.length });
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesData);
      },
      (error) => {
        console.error('Error fetching transaction services:', error);
        // Don't set error state here to avoid blocking the UI if services aren't loaded
        // but the main transaction is
      }
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribeTransaction();
      unsubscribeServices();
      console.log("TransactionDashboard unmounted, subscriptions cleaned up");
    };
  }, [transactionId, currentUser, navigate]);

  if (process.env.NODE_ENV === 'development') {
    console.log("Transaction Dashboard Render State:", {
      loading,
      error,
      transactionExists: !!transaction,
      transactionId,
      currentUserId: currentUser?.uid,
      serviceCount: services.length
    });
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
        <button 
          onClick={() => navigate('/transactions')}
          style={{
            backgroundColor: '#4b5563',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        textAlign: 'center' 
      }}>
        <p>No transaction data available. The transaction may have been deleted or you don't have access.</p>
        <button 
          onClick={() => navigate('/transactions')}
          style={{
            backgroundColor: '#4b5563',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const isAgent = currentUser.uid === transaction.agentId;
  const isClient = currentUser.uid === transaction.clientId;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'services', label: 'Services', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'messages', label: 'Messages', icon: '💬' },
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: isMobile ? '1rem' : '2rem' 
    }}>
      <TransactionHeader 
        transaction={transaction} 
        isAgent={isAgent} 
        isClient={isClient}
      />

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb', 
        marginBottom: '2rem',
        gap: isMobile ? '0.5rem' : '2rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: '-ms-autohiding-scrollbar',
        '::-webkit-scrollbar': {
          display: 'none'
        }
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: isMobile ? '0.5rem' : '0.75rem 0',
              fontWeight: activeTab === tab.id ? '600' : '400',
              color: activeTab === tab.id ? '#2563eb' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #2563eb' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <TransactionOverview 
            transaction={transaction} 
            services={services}
            isAgent={isAgent}
          />
        )}
        
        {activeTab === 'services' && (
          <ServicesList 
            services={services} 
            transactionId={transactionId}
            userRole={isAgent ? 'agent' : 'client'}
          />
        )}
        
        {activeTab === 'documents' && (
          <DocumentManager 
            transactionId={transactionId}
            services={services}
            userRole={isAgent ? 'agent' : 'client'}
          />
        )}
        
        {activeTab === 'timeline' && (
          <TransactionTimeline 
            transaction={transaction}
            services={services}
          />
        )}
        
        {activeTab === 'messages' && (
          <TransactionMessages 
            transactionId={transactionId}
            participants={[transaction.clientId, transaction.agentId]}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionDashboard;