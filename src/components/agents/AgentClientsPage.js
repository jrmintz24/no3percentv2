// src/components/agents/AgentClientsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const AgentClientsPage = () => {
  const { currentUser } = useAuth();
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        if (!currentUser) {
          console.log("No authenticated user");
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        console.log("Current user UID:", currentUser.uid);
        console.log("Attempting to fetch proposals for agent:", currentUser.uid);
        
        // Query accepted proposals where the current user is the agent
        // Using capitalized 'Accepted' status
        const proposalsQuery = query(
          collection(db, 'proposals'),
          where('agentId', '==', currentUser.uid),
          where('status', '==', 'Accepted')
        );
        
        console.log("Query created, fetching proposals...");
        const proposalsSnapshot = await getDocs(proposalsQuery);
        console.log(`Found ${proposalsSnapshot.size} accepted proposals`);
        
        // Fetch client and listing details for each accepted proposal
        const clientsData = [];
        const clientPromises = [];
        
        proposalsSnapshot.forEach((doc) => {
          const proposal = { id: doc.id, ...doc.data() };
          console.log("Processing proposal:", proposal.id, "with status:", proposal.status);
          
          // Create promise for fetching listing details
          const listingPromise = getDocs(
            query(
              collection(db, proposal.listingType === 'buyer' ? 'buyerListings' : 'sellerListings'),
              where('__name__', '==', proposal.listingId)
            )
          ).then(listingSnapshot => {
            if (!listingSnapshot.empty) {
              const listingDoc = listingSnapshot.docs[0];
              const listing = { id: listingDoc.id, ...listingDoc.data() };
              console.log("Found listing:", listing.id);
              
              // Fetch client details
              return getDocs(
                query(
                  collection(db, 'users'),
                  where('__name__', '==', listing.userId)
                )
              ).then(userSnapshot => {
                if (!userSnapshot.empty) {
                  const userDoc = userSnapshot.docs[0];
                  const client = { id: userDoc.id, ...userDoc.data() };
                  console.log("Found client:", client.id);
                  
                  // Try to find message channel
                  return getDocs(
                    query(
                      collection(db, 'messageChannels'),
                      where('proposalId', '==', proposal.id)
                    )
                  ).then(channelSnapshot => {
                    let channelId = null;
                    if (!channelSnapshot.empty) {
                      channelId = channelSnapshot.docs[0].id;
                      console.log("Found message channel:", channelId);
                    }
                    
                    clientsData.push({
                      proposalId: proposal.id,
                      client,
                      listing,
                      listingType: proposal.listingType,
                      channelId,
                      lastActivity: proposal.acceptedAt || proposal.createdAt
                    });
                  }).catch(err => {
                    console.error("Error finding message channel:", err);
                    // Still add client even if message channel query fails
                    clientsData.push({
                      proposalId: proposal.id,
                      client,
                      listing,
                      listingType: proposal.listingType,
                      channelId: null,
                      lastActivity: proposal.acceptedAt || proposal.createdAt
                    });
                  });
                } else {
                  console.log("No user found for listing:", listing.id);
                }
              }).catch(err => {
                console.error("Error fetching user:", err);
              });
            } else {
              console.log("No listing found for proposal:", proposal.id);
            }
          }).catch(err => {
            console.error("Error fetching listing:", err);
          });
          
          clientPromises.push(listingPromise);
        });
        
        // Wait for all promises to resolve
        await Promise.all(clientPromises.filter(Boolean));
        console.log(`Processed ${clientsData.length} clients`);
        
        // Sort clients by most recent activity
        clientsData.sort((a, b) => {
          if (!a.lastActivity || !b.lastActivity) return 0;
          return b.lastActivity - a.lastActivity;
        });
        
        setClients(clientsData);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(`Error loading clients: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
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
          My Clients
        </h1>
        
        <Button to="/agent/listings">
          Browse New Listings
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
        </div>
      )}
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '2rem' 
        }}>
          Loading clients...
        </div>
      ) : clients.length === 0 ? (
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '3rem', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            You don't have any clients yet
          </h2>
          <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
            Submit proposals to listings to connect with potential clients
          </p>
          <Button to="/agent/listings">
            Browse Listings
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {clients.map((clientData) => (
            <Card key={clientData.proposalId}>
              <CardBody>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {clientData.client?.displayName || 'Client'}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {clientData.listingType === 'buyer' ? 'Buyer' : 'Seller'} •{' '}
                      {clientData.lastActivity ? new Date(clientData.lastActivity.seconds * 1000).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#dcfce7', 
                    color: '#15803d', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    Active
                  </div>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {clientData.listingType === 'buyer' ? 'Looking For:' : 'Property:'}
                  </h3>
                  <p style={{ marginBottom: '0.5rem' }}>
                    {clientData.listingType === 'buyer' 
                      ? (clientData.listing.title || 'Property Search')
                      : (clientData.listing.propertyName || clientData.listing.propertyAddress || 'Property Listing')}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {clientData.listingType === 'buyer'
                      ? `${clientData.listing.location || 'Any location'} • Budget: ${clientData.listing.budget ? `$${clientData.listing.budget.toLocaleString()}` : 'Not specified'}`
                      : `${clientData.listing.address || 'No address'} • Price: ${clientData.listing.price ? `$${clientData.listing.price.toLocaleString()}` : 'Not specified'}`}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button 
                    to={clientData.listingType === 'buyer'
                      ? `/agent/buyer-listing/${clientData.listing.id}`
                      : `/agent/seller-listing/${clientData.listing.id}`
                    }
                    variant="secondary"
                    size="small"
                  >
                    View Listing
                  </Button>
                  <Button 
                    to={clientData.channelId
                      ? `/agent/messages/${clientData.channelId}`
                      : `/agent/proposals/${clientData.proposalId}`
                    }
                    size="small"
                  >
                    {clientData.channelId ? 'Message Client' : 'View Proposal'}
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

export default AgentClientsPage;