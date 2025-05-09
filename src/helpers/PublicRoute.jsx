
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
export function PublicRoute() {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Outlet />;
  } else {
    return <Navigate to="/home" />;
  }
}
