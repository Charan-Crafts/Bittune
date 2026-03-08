import React from 'react';
import { Navigate, Outlet } from 'react-router';

import {useAuth} from "../context/Auth.context";

const PublicRoutes = () => {

    const {user , isAuthenticated , role, loading} = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        if (role === "admin") {
            return <Navigate to="/admin" replace={true} />;
        }
        return <Navigate to="/" replace={true} />;
    }
    return (
        <Outlet />
    );
}

export default PublicRoutes;
