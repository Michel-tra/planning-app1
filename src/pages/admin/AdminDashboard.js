import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import axios from 'axios';
import '../../styles/App.css';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

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

        const fetchDroitsConges = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/stats/conges-anciennete?annee=${annee}`);
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
                    const res = await axios.get(`http://localhost:5000/api/admin/stats/conges-par-beneficiaire?annee=${annee}`);
                    console.log("🚀 Données bénéficiaires :", res.data);
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
            <h1>Tableau de bord Administrateur</h1>
            <p>Bienvenue sur le tableau de bord administrateur. Vous pouvez gérer les utilisateurs et suivre les statistiques clés.</p>

            {/* Statistiques générales */}
            {stats ? (
                <div className="card-grid">
                    <div className="card">
                        <h4>Total utilisateurs</h4>
                        <p>{stats.totalUtilisateurs}</p>
                    </div>
                    <div className="card">
                        <h4>Connectés</h4>
                        <p>{stats.connectes}</p>
                    </div>
                    <div className="card">
                        <h4>Pointages aujourd’hui</h4>
                        <p>{stats.pointagesAujourdhui}</p>
                    </div>
                    <div className="card">
                        <h4>Congés en attente</h4>
                        <p>{stats.congesEnAttente}</p>
                    </div>
                    <div className="card full-width">
                        <h4>Répartition des rôles</h4>
                        <ul>
                            {stats.repartition.map((item, i) => (
                                <li key={i}>{item.role} : {item.total}</li>
                            ))}
                        </ul>
                    </div>
                </div>

            ) : (
                <p>Chargement des statistiques...</p>
            )}

            {/* Vue comparative congés par bénéficiaire */}
            <div className="card full-width">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Congés par bénéficiaire</h3>
                    <div>
                        <label htmlFor="annee">Année :</label>{' '}
                        <select value={annee} onChange={(e) => setAnnee(e.target.value)}>
                            <option value="tous">Toutes</option>
                            {[2023, 2024, 2025, 2026].map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {congesParBeneficiaire.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={congesParBeneficiaire}
                            margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="nom"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={100}
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#17a2b8" name="Congés effectués" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Aucune donnée de congé disponible pour cette vue.</p>
                )}
            </div>

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

            {/* Droit à congé */}
            <div className="card full-width">
                <h3>Utilisateurs ayant droit à un congé (≥ 1 an d’ancienneté)</h3>
                {droitsConges.length === 0 ? (
                    <p>Aucun utilisateur avec un an d’ancienneté cette année.</p>
                ) : (
                    <table className="log-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Date d'embauche</th>
                                <th>Ancienneté</th>
                            </tr>
                        </thead>
                        <tbody>
                            {droitsConges.map(user => (
                                <tr key={user.id}>
                                    <td>{user.nom}</td>
                                    <td>{user.prenom}</td>
                                    <td>{new Date(user.date_embauche).toLocaleDateString()}</td>
                                    <td>{user.anciennete} an(s)</td>
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
