import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

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

// Function to use a token for bidding (no "use" prefix)
export const spendTokenForBid = async (userId, listingId) => {
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