import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';


function AdminDashboard() {

    return (
        <DashboardLayout role="admin">

            <h1>Tableau de bord Administrateur</h1>
            <p>Bienvenue sur le tableau de bord administrateur. Vous pouvez gérer les utilisateurs et voir le planning global.</p>

        </DashboardLayout>
    );
}

export default AdminDashboard;
