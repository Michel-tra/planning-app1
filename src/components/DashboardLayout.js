import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                {children}
            </div>
        </>
    );
};

export default DashboardLayout;
