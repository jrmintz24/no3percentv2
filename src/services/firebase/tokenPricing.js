// src/services/firebase/tokenPricing.js

import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export const calculateTokenCost = async (listingId, listingType, isVerified, db) => {
  // Base costs
  const BASE_COST = {
    buyer: 1,
    seller: 2, // Sellers are more valuable
  };
  
  // Verification multiplier
  const VERIFICATION_MULTIPLIER = isVerified ? 1.5 : 1;
  
  // Get bid count for dynamic pricing
  const proposalsRef = collection(db, 'proposals');
  const q = query(proposalsRef, where('listingId', '==', listingId));
  const snapshot = await getDocs(q);
  const bidCount = snapshot.size;
  
  // Dynamic multiplier based on bid count
  let demandMultiplier = 1;
  if (bidCount >= 10) {
    demandMultiplier = 2;
  } else if (bidCount >= 5) {
    demandMultiplier = 1.5;
  } else if (bidCount >= 3) {
    demandMultiplier = 1.2;
  }
  
  // Calculate final cost
  const baseCost = BASE_COST[listingType];
  const finalCost = Math.ceil(baseCost * VERIFICATION_MULTIPLIER * demandMultiplier);
  
  return {
    cost: finalCost,
    factors: {
      baseCost,
      isVerified,
      bidCount,
      verificationMultiplier: VERIFICATION_MULTIPLIER,
      demandMultiplier,
    }
  };
};

// Get the highest current bid for priority ranking
export const getHighestPriorityBid = async (listingId, db) => {
  const proposalsRef = collection(db, 'proposals');
  const q = query(
    proposalsRef,
    where('listingId', '==', listingId),
    orderBy('totalTokensSpent', 'desc'),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const highestProposal = snapshot.docs[0].data();
    return highestProposal.totalTokensSpent || highestProposal.tokenCost || 0;
  }
  
  return 0;
};