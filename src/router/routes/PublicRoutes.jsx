import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


const PublicRoutes = () => {
    const { user } = useSelector((state) => state?.user);

    // Redirect to admin dashboard if user is authenticated
    if (user) {
        return <Navigate to="/dashboard" />;
    }

    // Render public content (e.g., login page)
    return <Outlet />;
};

export default PublicRoutes;