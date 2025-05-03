import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userProfile, loading } = useAuth();
  
  // If auth is still loading, show nothing or a spinner
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
  
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  
  // Check if user is admin - admins can access any route
  const isAdmin = userProfile?.isAdmin === true;
  
  // If role is required and user doesn't have it (and is not admin), redirect to home
  if (requiredRole && userProfile?.userType !== requiredRole && !isAdmin) {
    // Special case: if the route requires admin role, only allow users with isAdmin=true
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/" replace />;
    }
    
    // For non-admin routes, apply the standard role check
    if (requiredRole !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }
  
  // User is authenticated and has the required role (or is admin)
  return children;
};

export default ProtectedRoute;