import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const LandingPageProtection = ({ element }) => {
  const role = useSelector((state) => state.auth?.role);

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (role === "user") {
    return <Navigate to="/tickets" replace />;
  }

  return element;
};

export default LandingPageProtection;
