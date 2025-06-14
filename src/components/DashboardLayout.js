import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import '../styles/App.css';

function DashboardLayout({ children, role }) {
    const navigate = useNavigate();

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
                        <li><Link to="/admin/statistiques">Statistiques</Link></li>
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
                <ul className="sidebar-links">
                    {renderSidebarLinks()}
                </ul>

                <div className="sidebar-footer">
                    <button onClick={handleLogout}> <i className="fas fa-sign-out-alt"></i> Se déconnecter</button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;
