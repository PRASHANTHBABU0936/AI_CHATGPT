import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from './auth/AuthForm';
import './LoadingSpinner.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return children;
};

export default ProtectedRoute;
