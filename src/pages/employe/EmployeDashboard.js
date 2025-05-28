import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';



function EmployeDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); // Supprime l'utilisateur
        navigate('/'); // Redirige vers la page de connexion
    }

    return (
        <DashboardLayout>
            <div className="container">
                <h2>Bienvenue, Employé</h2>
                <button onClick={handleLogout}>Se déconnecter</button>
                <ul>
                    <li><button onClick={() => navigate('/employe/mon-planning')}>Voir mon planning</button></li>
                    <li><button onClick={() => navigate('/employe/pointer')}>Pointer</button></li>
                    <li><button onClick={() => navigate('/employe/conges')}>Demander un congé</button></li>
                </ul>
            </div>
        </DashboardLayout>
    );
}

export default EmployeDashboard;
