// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User:', user);
    console.log('Allowed:', allowedRoles);

    if (!user) {
        return <Navigate to="/" />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};


export default PrivateRoute;
