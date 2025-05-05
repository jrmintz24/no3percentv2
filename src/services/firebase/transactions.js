// src/services/firebase/transactions.js

import { collection, addDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './config';
import { serviceTasks } from '../../config/serviceTasks';
import { buyerServices, sellerServices } from '../../config/services';

export const createTransaction = async (proposalId) => {
  try {
    // Get proposal details
    const proposalDoc = await getDoc(doc(db, 'proposals', proposalId));
    if (!proposalDoc.exists()) throw new Error('Proposal not found');
    
    const proposal = proposalDoc.data();
    
    // Check if proposal is accepted (with case-insensitive comparison)
    const isAccepted = proposal.status && 
      (proposal.status.toLowerCase() === 'accepted' || 
       proposal.status === 'Accepted');
       
    if (!isAccepted) {
      throw new Error('Cannot create transaction: Proposal is not accepted');
    }
    
    // Get listing details
    const listingCollection = proposal.listingType === 'buyer' ? 'buyerListings' : 'sellerListings';
    const listingDoc = await getDoc(doc(db, listingCollection, proposal.listingId));
    
    if (!listingDoc.exists()) throw new Error('Listing not found');
    
    const listing = listingDoc.data();
    
    // Create transaction
    const transactionData = {
      proposalId,
      listingId: proposal.listingId,
      listingType: proposal.listingType,
      clientId: listing.userId,
      agentId: proposal.agentId,
      status: 'active',
      services: proposal.services || [],
      packageInfo: proposal.packageInfo || null,
      feeStructure: proposal.feeStructure,
      commissionRate: proposal.commissionRate || null,
      flatFee: proposal.flatFee || null,
      propertyDetails: {
        address: listing.address || listing.location || null,
        price: listing.price || listing.priceRange?.max || null,
        propertyType: listing.propertyType || null,
        bedrooms: listing.bedrooms || null,
        bathrooms: listing.bathrooms || null,
        squareFootage: listing.squareFootage || null
      },
      timeline: {
        proposalSubmitted: proposal.createdAt,
        proposalAccepted: serverTimestamp(),
        expectedClosing: listing.preferredClosingDate || listing.preferredMoveInDate || null
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Creating transaction with data:', JSON.stringify(transactionData));
    const transactionRef = await addDoc(collection(db, 'transactions'), transactionData);
    const transactionId = transactionRef.id;
    console.log('Transaction created with ID:', transactionId);
    
    // Create service instances for each selected service
    for (const serviceName of proposal.services) {
      await createServiceInstance(transactionId, serviceName, proposal.listingType);
    }
    
    // Update proposal status - normalize to 'Accepted' with capital A
    await updateDoc(doc(db, 'proposals', proposalId), {
      status: 'Accepted',
      transactionId: transactionId,
      acceptedAt: serverTimestamp()
    });
    
    // Update listing status
    await updateDoc(doc(db, listingCollection, proposal.listingId), {
      status: 'under_contract',
      acceptedProposalId: proposalId,
      updatedAt: serverTimestamp()
    });
    
    return transactionId;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Rest of the file remains unchanged
export const createServiceInstance = async (transactionId, serviceName, listingType) => {
  try {
    // Find service configuration
    const services = listingType === 'buyer' ? buyerServices : sellerServices;
    const serviceConfig = services.find(s => s.name === serviceName);
    
    if (!serviceConfig) {
      console.warn(`Service ${serviceName} not found, creating basic service`);
      // Create a basic service if config not found
      await addDoc(collection(db, 'transactionServices'), {
        transactionId,
        serviceName: serviceName,
        status: 'pending',
        tasks: [],
        documents: [],
        notes: [],
        startedAt: null,
        completedAt: null,
        agentConfirmed: false,
        clientConfirmed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return;
    }
    
    // Get task template for this service
    const taskTemplate = serviceTasks[serviceConfig.id] || [];
    
    const serviceData = {
      transactionId,
      serviceId: serviceConfig.id,
      serviceName: serviceConfig.name,
      description: serviceConfig.description || '',
      status: 'pending',
      tasks: taskTemplate.map(task => ({
        ...task,
        status: 'pending',
        completedBy: null,
        completedAt: null
      })),
      documents: [],
      notes: [],
      startedAt: null,
      completedAt: null,
      agentConfirmed: false,
      clientConfirmed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    return await addDoc(collection(db, 'transactionServices'), serviceData);
  } catch (error) {
    console.error('Error creating service instance:', error);
    throw error;
  }
};

export const updateTransactionStatus = async (transactionId, status) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

export const addTransactionNote = async (transactionId, noteContent, userId, userRole) => {
  try {
    const noteData = {
      transactionId,
      content: noteContent,
      createdBy: userId,
      createdByRole: userRole,
      createdAt: serverTimestamp()
    };
    
    return await addDoc(collection(db, 'transactionNotes'), noteData);
  } catch (error) {
    console.error('Error adding transaction note:', error);
    throw error;
  }
};

export const updateServiceStatus = async (serviceId, status) => {
  try {
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (status === 'in-progress') {
      updateData.startedAt = serverTimestamp();
    } else if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }
    
    await updateDoc(doc(db, 'transactionServices', serviceId), updateData);
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};

export const updateTaskStatus = async (serviceId, taskIndex, status, userId) => {
  try {
    const serviceDoc = await getDoc(doc(db, 'transactionServices', serviceId));
    if (!serviceDoc.exists()) throw new Error('Service not found');
    
    const serviceData = serviceDoc.data();
    const tasks = serviceData.tasks || [];
    
    // Update the specific task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      completedBy: status === 'completed' ? userId : null,
      completedAt: status === 'completed' ? serverTimestamp() : null
    };
    
    // Update the service document
    await updateDoc(doc(db, 'transactionServices', serviceId), {
      tasks,
      updatedAt: serverTimestamp()
    });
    
    // Check if all tasks are completed
    const allTasksCompleted = tasks.every(task => task.status === 'completed');
    if (allTasksCompleted && serviceData.status !== 'completed') {
      // Optionally update service status or notify
      console.log('All tasks completed for service:', serviceId);
    }
    
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export default {
  createTransaction,
  createServiceInstance,
  updateTransactionStatus,
  addTransactionNote,
  updateServiceStatus,
  updateTaskStatus
};