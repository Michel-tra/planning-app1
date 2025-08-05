import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell
} from 'recharts';

function StatCard({ label, value, icon }) {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
        </div>
    );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64ca6', '#4caf50', '#f44336'];

function PieSection({ title, data, dataKey, valueKey }) {
    return (
        <div className="graph-section">
            <h3 className="graph-title">{title}</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={valueKey}
                            nameKey={dataKey}
                            outerRadius={100}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p>Aucune donnée disponible.</p>
            )}
        </div>
    );
}

function ManagerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [mois, setMois] = useState(new Date().getMonth() + 1);
    const [semaine, setSemaine] = useState(null);
    const [filtre, setFiltre] = useState('annee');

    const [absencesMois, setAbsencesMois] = useState([]);
    const [tauxAbsences, setTauxAbsences] = useState([]);
    const [retards, setRetards] = useState([]);
    const [parUtilisateur, setParUtilisateur] = useState([]);

    const managerId = JSON.parse(localStorage.getItem('utilisateur'))?.id;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [
                    statsRes,
                    absencesMoisRes,
                    tauxRes,
                    parUserRes,
                    retardsRes
                ] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/stats/manager?managerId=${managerId}`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/stats/absences-par-mois?annee=${annee}`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/stats/absences-utilisateurs`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/stats/absences-par-mois-utilisateur?annee=${annee}`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/stats/retards-par-utilisateur`, {
                        params: { filtre, annee, mois: filtre === 'mois' ? mois : undefined, semaine: filtre === 'semaine' ? semaine : undefined }
                    })
                ]);

                setStats(statsRes.data);
                setAbsencesMois(absencesMoisRes.data);
                setTauxAbsences(tauxRes.data);
                setParUtilisateur(parUserRes.data);
                setRetards(retardsRes.data.map(r => ({
                    ...r,
                    utilisateur: `${r.prenom} ${r.nom}`
                })));
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData(); // Appel initial

        const interval = setInterval(fetchAllData, 15000); // Appel toutes les 15 secondes

        return () => clearInterval(interval); // Nettoyage à la destruction du composant
    }, [annee, mois, semaine, filtre]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stats/manager?managerId=${managerId}`);
                setStats(res.data);
            } catch (e) {
                console.error("Erreur lors du rafraîchissement des stats :", e);
            }
        };

        fetchData(); // chargement initial
        const interval = setInterval(fetchData, 15000); // toutes les 15s

        return () => clearInterval(interval);
    }, []);


    const tauxFormatted = tauxAbsences.map(u => ({
        utilisateur: u.nom,
        taux_presence: u.taux_presence,
        taux_absence: u.taux_absence
    }));

    return (
        <DashboardLayout role="manager">
            <div className="dashboard-container">
                <h2 className="dashboard-title">📊 Tableau de bord Manager</h2>

                {loading ? (
                    <p>Chargement des données...</p>
                ) : (
                    <>
                        <div className="stats-grid">
                            <StatCard label="Utilisateurs connectés" value={stats?.utilisateursConnectes?.length ?? 0} icon="👥" />
                            <StatCard label="Mon pointage aujourd'hui" value={stats?.etatPointageManager ?? '—'} icon="📍" />
                            <StatCard label="Taux de pointage" value={stats?.tauxPointage ?? '0%'} icon="📈" />
                            <StatCard label="Plannings cette semaine" value={stats?.planningsSemaine ?? 0} icon="📅" />
                            <StatCard label="Congés en attente" value={stats?.congesEnAttente ?? 0} icon="📝" />
                            <StatCard label="Absents aujourd'hui" value={stats?.absencesJour ?? 0} icon="❌" />
                            <StatCard label="Retards aujourd'hui" value={stats?.retardsJour ?? 0} icon="⏱️" />
                        </div>


                        <div className="dashboard-graphs">

                            <div className="graphs-grid">
                                <PieSection title="📅 Absences par mois" data={absencesMois} dataKey="mois" valueKey="total" />
                                <PieSection title="🗓️ Congés acceptés par mois" data={absencesMois} dataKey="mois" valueKey="total" />

                            </div>
                            <div className="graph-section">
                                <div className="graph-header">
                                    <h3 className="graph-title">🚦 Retards par utilisateur</h3>
                                    <div className="graph-filtres">
                                        <select value={filtre} onChange={e => setFiltre(e.target.value)}>
                                            <option value="annee">Année</option>
                                            <option value="mois">Mois</option>
                                            <option value="semaine">Semaine</option>
                                        </select>
                                        <select value={annee} onChange={e => setAnnee(Number(e.target.value))}>
                                            {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        {filtre === 'mois' && (
                                            <select value={mois} onChange={e => setMois(Number(e.target.value))}>
                                                {['Janv', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
                                                    .map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                                            </select>
                                        )}
                                        {filtre === 'semaine' && (
                                            <input type="number" min="1" max="53" placeholder="Semaine"
                                                value={semaine || ''} onChange={e => setSemaine(Number(e.target.value))} />
                                        )}
                                    </div>
                                </div>
                                <div className="graphs-grid">
                                    <PieSection data={retards} dataKey="utilisateur" valueKey="total_retards" />
                                </div>
                            </div>



                            <div className="graph-section">
                                <h3 className="graph-title">⏰ Taux de présence et d'absence</h3>
                                {tauxFormatted.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={tauxFormatted}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="utilisateur" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="taux_presence" fill="#4CAF50" name="Présence (%)" />
                                            <Bar dataKey="taux_absence" fill="#F44336" name="Absence (%)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p>Aucune donnée disponible.</p>
                                )}
                            </div>

                            <div className="graph-section">
                                <h3 className="graph-title">👤 Congés par utilisateur</h3>
                                {parUtilisateur.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={parUtilisateur} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="beneficiaire" type="category" />
                                            <Tooltip />
                                            <Bar dataKey="total" fill="#0a9af4ff" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p>Aucune donnée disponible.</p>
                                )}
                            </div>

                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

export default ManagerDashboard;
