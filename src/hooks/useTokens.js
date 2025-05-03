import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import { useAuth } from '../contexts/AuthContext';

export const useTokens = () => {
  const { currentUser } = useAuth();
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!currentUser) {
      setTokens(0);
      setLoading(false);
      return;
    }
    
    // Initial fetch
    const fetchTokens = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setTokens(userDoc.data().tokens || 0);
        } else {
          setTokens(0);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchTokens();
    
    // Set up listener for real-time updates
    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setTokens(doc.data().tokens || 0);
        } else {
          setTokens(0);
        }
      },
      (err) => {
        console.error("Error in token snapshot:", err);
        setError(err.message);
      }
    );
    
    return () => unsubscribe();
  }, [currentUser]);
  
  return { tokens, loading, error };
};