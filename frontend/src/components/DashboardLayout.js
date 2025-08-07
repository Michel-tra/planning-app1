import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import API from '../api/api'; // Assure-toi que ce chemin est correct
import { User } from 'lucide-react';
import '../styles/App.css';

function DashboardLayout({ children, role }) {
    const navigate = useNavigate();
    const utilisateur = JSON.parse(localStorage.getItem('utilisateur'));

    const handleLogout = async () => {
        const utilisateurId = JSON.parse(localStorage.getItem('user'))?.id;
        try {
            await API.post(`/api/logout`, { utilisateurId });
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };


    const renderSidebarLinks = () => {
        switch (role) {
            case 'manager':
                return (
                    <>
                        <li><Link to="/manager/plannings"><i className="fa-solid fa-calendar-days"></i> Plannings</Link></li>
                        <li><Link to="/manager/pointages"><i className="fa-solid fa-clock"></i> Pointages</Link></li>
                        <li><Link to="/manager/congeEmploye"><i className="fa-solid fa-plane-departure"></i>Demandes de congés</Link></li>
                        <li><Link to="/manager/employes"><i className="fa-solid fa-users"></i> Employés</Link></li>
                    </>
                );
            case 'pointeur':
                return (
                    <>
                        <li><Link to="/pointeur/ScannerBadge"><i className="fa-duotone fa-solid fa-scanner-touchscreen"></i> Scanner un badge</Link></li>
                        <li><Link to="/pointeur/PointagesHistorique"><i className="fa-solid fa-clock"></i> Historique des pointages</Link></li>
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
                        <li><Link to="/admin/utilisateurs"><i className="fa-solid fa-users"></i> Utilisateurs</Link></li>
                    </>
                );
            default:
                return null;
        }
    };
    return (
        <div className="layout">
            {/* ✅ Sidebar avec les liens de navigation */}
            <aside className="sidebar">
                {/* En-tête de la sidebar */}
                <div className="sidebar-header flex justify-between items-center mb-4">
                    <span>{role?.toUpperCase()}</span>
                </div>

                {/* Infos utilisateur */}
                {utilisateur && (
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-900 rounded text-white mb-4">
                        <div className="flex items-center gap-2">
                            <User size={30} color="#e85d04" />
                            <span className="text-sm font-medium">
                                {utilisateur.prenom && <span style={{ color: '#ffffffff', fontSize: '30px' }}>{utilisateur.prenom}</span>} {utilisateur.nom && <span style={{ color: '#ffffffff', fontSize: '30px' }}>{utilisateur.nom}</span>}
                            </span>
                        </div>
                    </div>
                )}

                {/* Liens + bouton déconnexion ensemble */}
                <ul className="sidebar-links">
                    {renderSidebarLinks()}
                    <li>
                        <button className="logout-button" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt"></i> Se déconnecter
                        </button>
                    </li>
                </ul>
            </aside>

            {/* ✅ Contenu principal */}
            <main className="main-content">
                {utilisateur && (
                    <div className="top-bar">
                        <p className="welcome-message">
                            👋 Bonjour, <strong>{utilisateur.prenom} {utilisateur.nom}</strong> ! Bienvenue sur votre espace de travail.
                        </p>
                        <div className="logo-container">
                            <img src="/logoplanning.png" alt="Logo" className="logo-img" />
                        </div>
                    </div>
                )}

                {children}
            </main>
        </div>

    );
}

export default DashboardLayout;
