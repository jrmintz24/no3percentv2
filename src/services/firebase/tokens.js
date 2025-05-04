// src/services/firebase/tokens.js

import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from './config';
import { calculateTokenCost } from './tokenPricing';

// Function to check if user has enough tokens
export const checkTokenBalance = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.tokens || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error checking token balance:', error);
    throw error;
  }
};

// Function to use tokens for bidding with dynamic pricing
export const spendTokenForBid = async (userId, listingId, listingType = 'buyer', isVerified = false, totalTokensToSpend = null) => {
  try {
    // If totalTokensToSpend is not provided, calculate the base cost
    let costToSpend = totalTokensToSpend;
    if (costToSpend === null) {
      const { cost } = await calculateTokenCost(listingId, listingType, isVerified, db);
      costToSpend = cost;
    }
    
    // Create refs
    const userRef = doc(db, 'users', userId);
    const tokenUsageRef = doc(db, 'tokenUsage', `${userId}_${listingId}`);
    
    // Run transaction to ensure atomicity
    const result = await runTransaction(db, async (transaction) => {
      // Check if already bid
      const tokenUsageDoc = await transaction.get(tokenUsageRef);
      if (tokenUsageDoc.exists()) {
        throw new Error('Already bid on this listing');
      }
      
      // Get user's current tokens
      const userDoc = await transaction.get(userRef);
      const currentTokens = userDoc.data()?.tokens || 0;
      
      if (currentTokens < costToSpend) {
        throw new Error(`Not enough tokens. Need ${costToSpend}, have ${currentTokens}`);
      }
      
      // Deduct tokens
      transaction.update(userRef, { 
        tokens: increment(-costToSpend),
        tokensUsed: increment(costToSpend)
      });
      
      // Record usage with cost information
      transaction.set(tokenUsageRef, {
        userId,
        listingId,
        cost: costToSpend,
        listingType,
        isVerified,
        timestamp: serverTimestamp(),
        type: 'bid'
      });
      
      return { success: true, cost: costToSpend };
    });
    
    return result;
  } catch (error) {
    console.error('Error spending tokens:', error);
    return { success: false, error: error.message };
  }
};

// Legacy function - maintain backward compatibility
export const spendTokenForBidLegacy = async (userId, listingId) => {
  try {
    // Check if user has tokens
    const tokens = await checkTokenBalance(userId);
    
    if (tokens < 1) {
      return false; // Not enough tokens
    }
    
    // Deduct token from user
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      tokens: increment(-1),
      tokensUsed: increment(1)
    });
    
    // Record token usage
    const tokenUsageRef = doc(db, 'tokenUsage', `${userId}_${listingId}`);
    await setDoc(tokenUsageRef, {
      userId,
      listingId,
      usedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error using token:', error);
    throw error;
  }
};

// Function to add tokens to a user's account
export const addTokens = async (userId, amount) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      tokens: increment(amount)
    });
    
    // Record token purchase
    const purchaseId = `${userId}_${Date.now()}`;
    const purchaseRef = doc(db, 'tokenPurchases', purchaseId);
    await setDoc(purchaseRef, {
      userId,
      amount,
      purchasedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding tokens:', error);
    throw error;
  }
};

// Function to handle subscription token renewal
export const renewSubscriptionTokens = async (userId, subscriptionTier) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    const subscription = userData.subscription;
    
    if (!subscription || subscription.tier !== subscriptionTier) {
      throw new Error('Invalid subscription');
    }
    
    // Get subscription tier configuration
    const { subscriptionTiers } = await import('../../config/subscriptions');
    const tierConfig = subscriptionTiers[subscriptionTier];
    
    if (!tierConfig) {
      throw new Error('Invalid subscription tier');
    }
    
    // Add monthly tokens
    await updateDoc(userRef, {
      tokens: increment(tierConfig.monthlyTokens),
      'subscription.lastTokenRenewal': serverTimestamp()
    });
    
    // Record the renewal
    const renewalRef = doc(db, 'tokenRenewals', `${userId}_${Date.now()}`);
    await setDoc(renewalRef, {
      userId,
      subscriptionTier,
      tokenAmount: tierConfig.monthlyTokens,
      renewedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error renewing subscription tokens:', error);
    throw error;
  }
};