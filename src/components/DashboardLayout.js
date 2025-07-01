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
                        <li><Link to="/pointeur/ScannerBadge"><i className="fa-sharp fa-light fa-rectangle-barcode"></i> Scanner un badge</Link></li>
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
                <div className="w-10 h-10">
                </div>
                <div className="sidebar-header flex justify-between items-center">
                    <span>{role?.toUpperCase()}</span>
                </div>

                {utilisateur && (
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-900 rounded text-white">
                        <div className="flex items-center gap-2">
                            <User size={18} color="#fff" />
                            <span className="text-sm font-medium">
                                {utilisateur.prenom} {utilisateur.nom}
                            </span>
                        </div>
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
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
                        <p className="text-sm text-gray-700">
                            👋 Bonjour, <strong>{utilisateur.prenom} {utilisateur.nom}</strong> ! Bienvenue sur votre tableau de bord.
                        </p>
                        <img
                            src="/logo.jpeg"
                            alt="Logo"
                            style={{ width: '100px', height: '100px', objectFit: 'contain', marginLeft: '800px' }}
                        />
                    </div>
                )}



                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;
