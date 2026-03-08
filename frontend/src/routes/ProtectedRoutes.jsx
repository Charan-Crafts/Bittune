import React from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../context/Auth.context';
const ProtectedRoutes = () => {

    const {user , isAuthenticated , role, loading} = useAuth();

    if (loading) {
        return null;
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace={true} />
    }
    return <Outlet />
}

export default ProtectedRoutes;
