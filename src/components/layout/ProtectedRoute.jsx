import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
