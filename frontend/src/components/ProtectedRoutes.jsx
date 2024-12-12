import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user]);

  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;