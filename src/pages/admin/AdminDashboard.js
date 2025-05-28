import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';


function AdminDashboard() {
    // const navigate = useNavigate();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user'); // Supprime l'utilisateur
        navigate('/'); // Redirige vers la page de connexion
    };
    return (
        <DashboardLayout>

            <h1>Tableau de bord Administrateur</h1>
            <p>Bienvenue sur le tableau de bord administrateur. Vous pouvez gérer les utilisateurs et voir le planning global.</p>
            <button onClick={handleLogout}>Se déconnecter</button>
            <ul>
                <li><Link to="/admin/GestionUtilisateurs">Gérer les utilisateurs</Link></li>
                <li><Link to="/admin/Supperviser">Systeme</Link></li>
            </ul>
        </DashboardLayout>
    );
}

export default AdminDashboard;
