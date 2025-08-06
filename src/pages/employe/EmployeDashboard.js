import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from 'recharts';

function EmployeDashboard() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [arriveesGraph, setArriveesGraph] = useState([]);
    const [taux, setTaux] = useState(null);
    const utilisateurId = localStorage.getItem('utilisateurId');

    function StatCard({ label, value, icon }) {
        return (
            <div className="stat-card bg-white shadow-md rounded-lg p-4 flex flex-col items-start">
                <div className="text-2xl">{icon}</div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-lg font-semibold mt-1">{value}</div>
            </div>
        );
    }




    useEffect(() => {
        const fetchHistoriqueArrivees = async () => {
            try {
                const res = await axios.get(`/api/stats/historique-arrivees/${utilisateurId}`);
                let totalHeures = 0;

                const formatted = res.data.map(row => {
                    const parts = row.heure_arrivee.split(':');
                    const heureFloat = parseFloat(parts[0]) + parseFloat(parts[1]) / 60;

                    totalHeures += heureFloat;

                    return {
                        jour: new Date(row.jour).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                        heure: heureFloat,
                        heure_label: row.heure_arrivee,
                        en_retard: heureFloat > 8.25
                    };
                });

                const moyenne = parseFloat((totalHeures / formatted.length).toFixed(2));
                setArriveesGraph({ data: formatted, moyenne });
            } catch (err) {
                console.error("Erreur chargement historique arrivées :", err);
            }
        };

        if (utilisateurId) {
            fetchHistoriqueArrivees();
        }
    }, [utilisateurId]);

    useEffect(() => {
        const fetchTaux = async () => {
            try {
                const res = await axios.get(`/api/stats/absences-utilisateur/${utilisateurId}`);
                setTaux(res.data);
            } catch (err) {
                console.error("Erreur taux absence/presence :", err);
            }
        };

        if (utilisateurId) fetchTaux();
    }, [utilisateurId]);

    useEffect(() => {
        const fetchResume = async () => {
            if (!utilisateurId) {
                console.error("Aucun utilisateurId trouvé !");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`/api/pointages/resume-jour/${utilisateurId}`);
                setResume(res.data);
            } catch (error) {
                console.error("Erreur fetchResume :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [utilisateurId]);

    return (
        <DashboardLayout role="employe">
            <div className="dashboard-container">
                <h2 className="dashboard-title">👤 Tableau de bord Employé</h2>

                {/* 🔗 Boutons de raccourci */}
                <div className="shortcut-buttons">
                    <Link to="/employe/historique-pointages" className="shortcut-button">
                        🕒 Historique des Pointages
                    </Link>
                    <Link to="/employe/historique-conges" className="shortcut-button">
                        🏖️ Historique des Congés
                    </Link>
                </div>

                <div className="stats-section">
                    <h3 className="section-title">📊 Résumé du jour</h3>

                    {loading ? (
                        <p className="text-gray">Chargement...</p>
                    ) : resume ? (
                        <div className="stat-grid">

                            <StatCard
                                label="📅 Date"
                                value={
                                    resume.date
                                        ? new Date(resume.date).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : 'Non disponible'
                                }
                            />

                            <StatCard
                                label="⏰ Mes pointages"
                                value={
                                    resume.pointages && resume.pointages.length > 0 ? (
                                        <ul className="pointage-list">
                                            {resume.pointages.map((p, index) => {
                                                let horodatage = p.horodatage;
                                                try {
                                                    if (horodatage && horodatage.seconds) {
                                                        horodatage = new Date(horodatage.seconds * 1000);
                                                    } else {
                                                        horodatage = new Date(horodatage);
                                                    }
                                                } catch (e) {
                                                    horodatage = null;
                                                }

                                                return (
                                                    <li key={index}>
                                                        <strong>{p.type}</strong> à{' '}
                                                        {horodatage
                                                            ? horodatage.toLocaleString('fr-FR', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })
                                                            : 'Date invalide'}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <span className="text-info">Aucun pointage enregistré.</span>
                                    )
                                }
                            />

                            <StatCard
                                label="🗓️ Planning du jour"
                                value={
                                    resume.planning && resume.planning.heure_debut && resume.planning.heure_fin
                                        ? `${resume.planning.heure_debut} → ${resume.planning.heure_fin}`
                                        : 'Non disponible'
                                }
                            />

                            <StatCard
                                label="📌 Statut"
                                value={resume.estPresent ? 'Présent' : 'Absent'}
                            />

                            <StatCard
                                label="🕓 Heures travaillées"
                                value={resume.heuresTravaillees || '0h'}
                            />

                            <StatCard
                                label="🏖️ Congé"
                                value={
                                    resume.conge ? (
                                        <div>
                                            Du <strong>{resume.conge.date_debut}</strong> au{' '}
                                            <strong>{resume.conge.date_fin}</strong>
                                            <br />
                                            Statut : <span>{resume.conge.statut}</span>
                                        </div>
                                    ) : (
                                        <span className="text-muted">Pas en congé aujourd'hui.</span>
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <p className="text-muted">Aucune donnée disponible.</p>
                    )}
                </div>

                {/* 📈 Graphiques */}
                {taux && (
                    <div className="bg-white shadow p-6 rounded-xl mt-10">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800">📊 Taux de présence / absence</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[taux]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="utilisateur" hide />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="taux_presence" fill="#4CAF50" name="Présence (%)" />
                                <Bar dataKey="taux_absence" fill="#F44336" name="Absence (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {arriveesGraph.data && arriveesGraph.data.length > 0 && (
                    <div className="bg-white shadow-md rounded-lg p-6 mt-10">
                        <h3 className="text-lg font-semibold mb-4 text-blue-700">📈 Historique des heures d’arrivée (30 derniers jours)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={arriveesGraph.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="jour" />
                                <YAxis
                                    domain={[6, 12]}
                                    tickFormatter={(val) => `${Math.floor(val)}h${(val % 1 * 60).toFixed(0).padStart(2, '0')}`}
                                    label={{ value: 'Heure', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip
                                    formatter={(val) => `${Math.floor(val)}h${(val % 1 * 60).toFixed(0).padStart(2, '0')}`}
                                    labelFormatter={(label) => `📅 ${label}`}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="heure"
                                    name="Heure d’arrivée"
                                    stroke="#4CAF50"
                                    strokeWidth={2}
                                    dot={({ cx, cy, payload }) => (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={4}
                                            fill={payload.en_retard ? '#F44336' : '#4CAF50'}
                                            stroke={payload.en_retard ? '#F44336' : '#4CAF50'}
                                        />
                                    )}
                                    activeDot={{ r: 6 }}
                                    isAnimationActive={false}
                                />
                                <ReferenceLine y={8.25} stroke="#2196F3" strokeDasharray="4 4" label="08:15 (Retard)" />
                                {arriveesGraph.moyenne && (
                                    <ReferenceLine
                                        y={arriveesGraph.moyenne}
                                        stroke="#FF9800"
                                        strokeDasharray="5 5"
                                        label={`Moyenne ${Math.floor(arriveesGraph.moyenne)}h${(arriveesGraph.moyenne % 1 * 60).toFixed(0).padStart(2, '0')}`}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}




            </div>
        </DashboardLayout>
    );
}

export default EmployeDashboard;
