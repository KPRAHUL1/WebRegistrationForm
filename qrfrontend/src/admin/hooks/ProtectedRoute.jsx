// components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');

  // If there's a token, render the child component (e.g., AdminDashboard)
  // Otherwise, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;