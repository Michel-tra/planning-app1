import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';
import '../../styles/App.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Erreur chargement stats admin:', error);
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/logs');
                setLogs(response.data);
            } catch (error) {
                console.error('Erreur chargement logs admin:', error);
            }
        };

        fetchStats();
        fetchLogs();
    }, []);

    return (
        <DashboardLayout role="admin">
            <h1>Tableau de bord Administrateur</h1>
            <p>Bienvenue sur le tableau de bord administrateur. Vous pouvez gérer les utilisateurs et voir les statistiques globales.</p>

            {/* 🧮 Statistiques générales */}
            {stats ? (
                <div className="stats-container">
                    <p><strong>Total d’utilisateurs :</strong> {stats.totalUtilisateurs}</p>
                    <p><strong>Utilisateurs connectés :</strong> {stats.connectes}</p>
                    <p><strong>Pointages aujourd’hui :</strong> {stats.pointagesAujourdhui}</p>
                    <p><strong>Congés en attente :</strong> {stats.congesEnAttente}</p>

                    <h3>Répartition des rôles :</h3>
                    <ul>
                        {stats.repartition.map((item, index) => (
                            <li key={index}>{item.role} : {item.total}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Chargement des statistiques...</p>
            )}

            {/* 🧠 Activité récente */}
            <div className="logs-container">
                <h3>Activité récente</h3>
                {logs.length === 0 ? (
                    <p>Aucune activité récente.</p>
                ) : (
                    <table className="log-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Rôle</th>
                                <th>Action</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.nom}</td>
                                    <td>{log.prenom}</td>
                                    <td>{log.role}</td>
                                    <td>{log.action}</td>
                                    <td>{new Date(log.date_action).toLocaleString()}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;
