// src/components/RootRedirect.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RootRedirect = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Loading...
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  
  const isAdmin = userProfile?.isAdmin === true;
  
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  switch (userProfile?.userType) {
    case 'buyer':
      return <Navigate to="/buyer/dashboard" replace />;
    case 'seller':
      return <Navigate to="/seller/dashboard" replace />;
    case 'agent':
      return <Navigate to="/agent/dashboard" replace />;
    default:
      return <Navigate to="/signin" replace />;
  }
};

export default RootRedirect;