import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';



function ManagerDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); // Supprime l'utilisateur
        navigate('/'); // Redirige vers la page de connexion
    };

    return (
        <DashboardLayout>
            <div className="manager-dashboard">
                <h2 className="dashboard-title">Bienvenue, Manager</h2>
                <div className="dashboard-buttons">
                    <button onClick={handleLogout}>Se déconnecter</button>
                    <ul>
                        <li><button onClick={() => navigate('/manager/plannings')}>Gérer les plannings</button></li>
                        <li><button onClick={() => navigate('/manager/employes')}>Voir les employés</button></li>
                        <li><button onClick={() => navigate('/manager/pointages')}>Suivi des pointages</button></li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ManagerDashboard;
