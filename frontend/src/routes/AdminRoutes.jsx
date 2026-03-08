import React from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../context/Auth.context';

const AdminRoutes = () => {


    const {user , isAuthenticated , role, loading} = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />
    }

    if ( isAuthenticated && role !== "admin") {
        return <Navigate to="/" replace={true} />
    }
    return (
        <Outlet />
    );
}

export default AdminRoutes;
