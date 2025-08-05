import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';
import '../../styles/App.css';

function StatCard({ label, value, icon }) {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <h4>{label}</h4>
                <div>{value}</div>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [droitsConges, setDroitsConges] = useState([]);
    const [vue, setVue] = useState('beneficiaire');
    const [congesParBeneficiaire, setCongesParBeneficiaire] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`);
                setStats(response.data);
            } catch (error) {
                console.error('Erreur chargement stats admin:', error);
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/logs`);
                setLogs(response.data);
            } catch (error) {
                console.error('Erreur chargement logs admin:', error);
            }
        };

        const fetchDroitsConges = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats/conges-anciennete?annee=${annee}`);
                setDroitsConges(res.data);
            } catch (error) {
                console.error("Erreur chargement droit à congé :", error);
            }
        };

        fetchStats();
        fetchLogs();
        fetchDroitsConges();
    }, [annee]);

    useEffect(() => {
        if (vue === 'beneficiaire') {
            const fetchBeneficiaires = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats/conges-par-beneficiaire?annee=${annee}`);
                    setCongesParBeneficiaire(res.data);
                } catch (error) {
                    console.error("Erreur chargement congés par bénéficiaire :", error);
                }
            };
            fetchBeneficiaires();
        }
    }, [vue, annee]);

    return (
        <DashboardLayout role="admin">
            <div className="dashboard-container">
                <h1>Tableau de bord Administrateur</h1>
                <p>
                    Bienvenue sur le tableau de bord administrateur. Vous pouvez gérer les utilisateurs et suivre les statistiques clés.
                </p>

                {/* Statistiques générales */}
                {stats ? (
                    <div className="stats-grid">
                        <StatCard label="Total utilisateurs" value={stats.totalUtilisateurs} icon="👤" />
                        <StatCard label="Connectés" value={stats?.connectes ?? 0} icon="🟢" />
                        <StatCard label="Pointages aujourd’hui" value={stats?.pointagesAujourdhui ?? 0} icon="🕒" />
                        <StatCard label="Congés en attente" value={stats?.congesEnAttente ?? 0} icon="📅" />
                        <StatCard
                            label="Répartition des rôles"
                            icon="📊"
                            value={
                                Array.isArray(stats.repartition)
                                    ? stats.repartition.map((r, i) => (
                                        <div key={i}>
                                            <strong>{r.role}</strong>: {r.total}
                                        </div>
                                    ))
                                    : "Non disponible"
                            }
                        />
                    </div>
                ) : (
                    <p>Chargement des statistiques...</p>
                )}

                {/* Journal d'activité */}
                <div className="card full-width">
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
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;
