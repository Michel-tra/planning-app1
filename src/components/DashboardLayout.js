import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { User } from 'lucide-react';
import '../styles/App.css';

function DashboardLayout({ children, role }) {
    const navigate = useNavigate();
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur'));


    const handleLogout = async () => {
        const utilisateurId = JSON.parse(localStorage.getItem('user'))?.id;

        try {
            await axios.post('http://localhost:5000/api/logout', { utilisateurId });
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    <div className="flex items-center gap-2 px-4 py-3 border-b">
        <User className="text-blue-600" size={20} />
        <span className="text-sm font-medium">
            {utilisateur?.prenom} {utilisateur?.nom}
        </span>
    </div>

    const renderSidebarLinks = () => {
        switch (role) {
            case 'manager':
                return (
                    <>
                        <li><Link to="/manager/plannings"><i className="fa-solid fa-calendar-days"></i> Plannings</Link></li>
                        <li><Link to="/manager/pointages"><i className="fa-solid fa-hand-pointer"></i> Pointages</Link></li>
                        <li><Link to="/manager/congeEmploye">Demandes de congés</Link></li>
                        <li><Link to="/manager/employes">Employés</Link></li>
                    </>
                );
            case 'pointeur':
                return (
                    <>
                        <li><Link to="/pointeur/ScannerBadge">Scanner un badge</Link></li>
                        <li><Link to="/pointeur/PointagesHistorique">Historique des pointages</Link></li>
                    </>
                );
            case 'employe':
                return (
                    <>
                        <div className="sidebar-links">
                            <a href="/employe/mon-planning"><i className="fas fa-calendar-alt"></i> Mon planning</a>
                            <a href="/employe/conges"><i className="fas fa-plane-departure"></i> Demander un congé</a>
                        </div>
                    </>
                );
            case 'admin':
                return (
                    <>
                        <li><Link to="/admin/utilisateurs">Utilisateurs</Link></li>

                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">{role?.toUpperCase()}</div>
                {utilisateur && (
                    <div className="sidebar-user">
                        <User size={18} color="#fff" />
                        <span>{utilisateur.prenom} {utilisateur.nom}</span>
                    </div>
                )}

                <ul className="sidebar-links">
                    {renderSidebarLinks()}
                </ul>

                <div className="sidebar-footer">
                    <button onClick={handleLogout}> <i className="fas fa-sign-out-alt"></i> Se déconnecter</button>
                </div>
            </aside>

            <main className="main-content">
                {/* ✅ Message de bienvenue personnalisé */}
                {utilisateur && (
                    <div className="welcome-message px-4 py-3 bg-gray-100 text-sm text-gray-700 border-b">
                        👋 Bonjour, <strong>{utilisateur.prenom} {utilisateur.nom}</strong> ! Bienvenue sur votre tableau de bord.
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;
