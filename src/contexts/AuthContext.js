// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';
import { subscriptionTiers } from '../config/subscriptions';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, displayName, userType) {
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the display name
      await updateProfile(userCredential.user, { displayName });

      // Create the user document in Firestore with subscription info
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        userType,
        verificationStatus: 'unverified',
        // Add subscription information for agents
        ...(userType === 'agent' ? {
          subscription: {
            tier: 'starter',
            startDate: serverTimestamp(),
            nextBillingDate: null, // No billing for starter
            status: 'active'
          },
          tokens: subscriptionTiers.starter.welcomeTokens, // Give welcome token
          tokensUsed: 0
        } : {}),
        createdAt: serverTimestamp()
      });

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Sign in function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign out function
  function logout() {
    return signOut(auth);
  }

  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Fetch user profile from Firestore
  async function fetchUserProfile(user) {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile({ id: userDoc.id, ...userDoc.data() });
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  }

  // Update user profile
  async function updateUserProfile(data) {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);

    try {
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Refresh user profile
      await fetchUserProfile(currentUser);

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get user subscription tier helper
  function getUserSubscriptionTier(userProfile) {
    if (!userProfile?.subscription) return subscriptionTiers.starter;
    return subscriptionTiers[userProfile.subscription.tier] || subscriptionTiers.starter;
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await fetchUserProfile(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loading,
    getUserSubscriptionTier
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}