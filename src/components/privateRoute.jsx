// components/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) return null; // Or a spinner

  return session ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;