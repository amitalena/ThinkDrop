import React from 'react';

import PrivateAppBar from '../../components/common/PrivateAppBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoutes = () => {
    const { token } = useSelector((state) => state?.user);

    if (!token) {
        return <Navigate to="/" />;
    }

    return (
        <PrivateAppBar>
            <Outlet />
        </PrivateAppBar>
    );
};

export default PrivateRoutes