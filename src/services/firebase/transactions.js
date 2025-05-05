// src/services/firebase/transactions.js

import { doc, collection, addDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './config';

// Create a new transaction when a proposal is accepted
export const createTransaction = async (proposal, clientId, agentId) => {
  try {
    console.log("Creating transaction for proposal:", proposal.id);
    
    // Get listing details if available
    let listingData = {};
    try {
      const listingCollection = proposal.listingType === 'buyer' ? 'buyerListings' : 'sellerListings';
      const listingDoc = await getDoc(doc(db, listingCollection, proposal.listingId));
      if (listingDoc.exists()) {
        listingData = listingDoc.data();
      }
    } catch (err) {
      console.error("Error fetching listing details:", err);
    }
    
    // Create the transaction document
    const transactionRef = doc(collection(db, 'transactions'));
    
    await setDoc(transactionRef, {
      proposalId: proposal.id,
      listingId: proposal.listingId,
      listingType: proposal.listingType,
      clientId: clientId,
      agentId: agentId,
      status: "active",
      feeStructure: proposal.feeStructure,
      commissionRate: proposal.feeStructure === 'percentage' ? proposal.commissionRate : null,
      flatFee: proposal.feeStructure === 'flat' ? proposal.flatFee : null,
      timeline: {
        proposalAccepted: serverTimestamp(),
        expectedClosing: null // Set based on business logic or user input
      },
      propertyDetails: {
        address: listingData.address || listingData.location || "Property Address",
        price: listingData.price || listingData.budget || listingData.priceRange?.max || 0,
        propertyType: listingData.propertyType || "Not specified",
        bedrooms: listingData.bedrooms || "Not specified",
        bathrooms: listingData.bathrooms || "Not specified"
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("Transaction created with ID:", transactionRef.id);
    
    // Create initial transaction services based on proposal services
    if (proposal.services && proposal.services.length > 0) {
      for (const serviceName of proposal.services) {
        await addDoc(collection(db, 'transactionServices'), {
          transactionId: transactionRef.id,
          serviceName: serviceName,
          status: 'pending',
          startedAt: null,
          completedAt: null,
          tasks: getDefaultTasksForService(serviceName), // Add default tasks based on service type
          createdAt: serverTimestamp()
        });
      }
      console.log(`Created ${proposal.services.length} service entries for transaction`);
    }
    
    // Update the proposal with the transaction ID
    await setDoc(doc(db, 'proposals', proposal.id), {
      transactionId: transactionRef.id,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return transactionRef.id;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Get a default set of tasks for a service type
export const getDefaultTasksForService = (serviceName) => {
  const defaultTasks = {
    'property_showings': [
      { id: 'task1', title: 'Schedule initial property tour', description: 'Set up first viewing of properties', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Collect feedback after showings', description: 'Document client feedback on each property', status: 'pending', assignee: 'agent' }
    ],
    'market_analysis': [
      { id: 'task1', title: 'Research comparable properties', description: 'Find similar properties in the area', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Prepare market analysis report', description: 'Document findings and recommendations', status: 'pending', assignee: 'agent' },
      { id: 'task3', title: 'Review market analysis', description: 'Schedule time to review the analysis with agent', status: 'pending', assignee: 'client' }
    ],
    'offer_negotiation': [
      { id: 'task1', title: 'Prepare offer', description: 'Draft initial offer based on client requirements', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Review offer terms', description: 'Review and provide feedback on offer terms', status: 'pending', assignee: 'client' },
      { id: 'task3', title: 'Submit offer', description: 'Submit offer to seller/seller\'s agent', status: 'pending', assignee: 'agent' },
      { id: 'task4', title: 'Negotiate counteroffer', description: 'Handle negotiations for best terms', status: 'pending', assignee: 'agent' }
    ],
    'closing_coordination': [
      { id: 'task1', title: 'Schedule property inspection', description: 'Arrange for professional home inspection', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Review inspection results', description: 'Review and address any inspection concerns', status: 'pending', assignee: 'both' },
      { id: 'task3', title: 'Coordinate with lender', description: 'Ensure lender has required documents', status: 'pending', assignee: 'agent' },
      { id: 'task4', title: 'Review closing documents', description: 'Review all closing documents before signing', status: 'pending', assignee: 'client' },
      { id: 'task5', title: 'Schedule closing date', description: 'Coordinate closing date with all parties', status: 'pending', assignee: 'agent' }
    ],
    'contract_review': [
      { id: 'task1', title: 'Draft contract', description: 'Prepare contract documents', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Review contract', description: 'Review contract details and provisions', status: 'pending', assignee: 'client' },
      { id: 'task3', title: 'Address concerns', description: 'Address any contract questions or concerns', status: 'pending', assignee: 'agent' },
      { id: 'task4', title: 'Finalize contract', description: 'Complete all signatures and finalize contract', status: 'pending', assignee: 'both' }
    ],
    'pricing_strategy': [
      { id: 'task1', title: 'Research local market', description: 'Analyze current market conditions', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Determine price range', description: 'Recommend optimal price range', status: 'pending', assignee: 'agent' },
      { id: 'task3', title: 'Review pricing strategy', description: 'Discuss and finalize pricing strategy', status: 'pending', assignee: 'both' }
    ],
    'home_staging': [
      { id: 'task1', title: 'Initial home assessment', description: 'Evaluate current home presentation', status: 'pending', assignee: 'agent' },
      { id: 'task2', title: 'Provide staging recommendations', description: 'Share specific staging suggestions', status: 'pending', assignee: 'agent' },
      { id: 'task3', title: 'Implement staging changes', description: 'Make recommended staging changes', status: 'pending', assignee: 'client' },
      { id: 'task4', title: 'Final staging review', description: 'Review and finalize staging before photos', status: 'pending', assignee: 'agent' }
    ]
  };
  
  return defaultTasks[serviceName] || [];
};

// Add a method to update transaction status
export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    await setDoc(transactionRef, {
      status: status,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

// Update transaction timeline
export const updateTransactionTimeline = async (transactionId, timelineUpdates) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transDoc = await getDoc(transactionRef);
    
    if (!transDoc.exists()) {
      throw new Error('Transaction not found');
    }
    
    const currentTimeline = transDoc.data().timeline || {};
    const updatedTimeline = {
      ...currentTimeline,
      ...timelineUpdates,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(transactionRef, {
      timeline: updatedTimeline,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error updating transaction timeline:', error);
    throw error;
  }
};

// Update service status
export const updateServiceStatus = async (serviceId, status, tasks = null) => {
  try {
    const serviceRef = doc(db, 'transactionServices', serviceId);
    const updateData = {
      status: status,
      updatedAt: serverTimestamp()
    };
    
    if (status === 'in-progress' && !updateData.startedAt) {
      updateData.startedAt = serverTimestamp();
    }
    
    if (status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = serverTimestamp();
    }
    
    if (tasks) {
      updateData.tasks = tasks;
    }
    
    await setDoc(serviceRef, updateData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};