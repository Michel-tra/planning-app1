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

    useEffect(() => {
        const fetchHistoriqueArrivees = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stats/historique-arrivees/${utilisateurId}`);
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
                const res = await axios.get(`http://localhost:5000/api/stats/absences-utilisateur/${utilisateurId}`);
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
                const res = await axios.get(`http://localhost:5000/api/pointages/resume-jour/${utilisateurId}`);
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
            <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">👤 Tableau de bord Employé</h2>

                {/* 🔗 Raccourcis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <Link to="/employe/historique-pointages" className="bg-white border border-blue-200 p-6 rounded-2xl shadow hover:shadow-md hover:bg-blue-50 transition">
                        <div className="text-xl font-semibold text-blue-700">🕒 Historique des Pointages</div>
                    </Link>
                    <Link to="/employe/historique-conges" className="bg-white border border-blue-200 p-6 rounded-2xl shadow hover:shadow-md hover:bg-blue-50 transition">
                        <div className="text-xl font-semibold text-blue-700">🏖️ Historique des Congés</div>
                    </Link>
                </div>

                {/* 📊 Résumé */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">📊 Résumé du jour</h3>

                    {loading ? (
                        <p className="text-gray-600">Chargement...</p>
                    ) : resume ? (
                        <div className="card-grid">
                            <div className="card full-width">
                                <h4 className="text-blue-800 text-lg font-semibold mb-3">🕒 Mes pointages aujourd'hui</h4>
                                {resume.pointages.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-700">
                                        {resume.pointages.map((p, index) => (
                                            <li key={index}>
                                                <strong>{p.type}</strong> à {p.horodatage}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Aucun pointage enregistré aujourd'hui.</p>
                                )}
                            </div>

                            <div className="card">
                                <h4>📅 Planning du jour</h4>
                                <p>{resume.planning ? `${resume.planning.heure_debut} → ${resume.planning.heure_fin}` : "Non disponible"}</p>
                            </div>
                            <div className="card">
                                <h4>📌 Statut</h4>
                                <p>{resume.estPresent ? "Présent" : "Absent"}</p>
                            </div>
                            <div className="card">
                                <h4>🕓 Heures travaillées</h4>
                                <p>{resume.heuresTravaillees || "0h"}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucune donnée disponible.</p>
                    )}
                </div>

                {/* 📈 Graphiques */}
                {taux && (
                    <div className="bg-white shadow p-6 rounded-xl mt-10">
                        <h4 className="text-lg font-semibold mb-4 text-blue-800">📊 Taux de présence / absence</h4>
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
                        <h4 className="text-lg font-semibold mb-4 text-blue-700">📈 Historique des heures d’arrivée (30 derniers jours)</h4>
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

                {/* 📅 Planning */}
                {resume && resume.planning && (
                    <div className="bg-white p-6 rounded-xl shadow border mt-6">
                        <h4 className="text-lg font-semibold mb-3 text-blue-800">📅 Planning du jour</h4>
                        <p className="text-gray-700">
                            <strong>{resume.planning.heure_debut}</strong> → <strong>{resume.planning.heure_fin}</strong><br />
                            {resume.planning.description}
                        </p>
                    </div>
                )}

                {/* 🏖️ Congé */}
                {resume && (
                    <div className="bg-white p-6 rounded-xl shadow border mt-6">
                        <h4 className="text-lg font-semibold mb-3 text-blue-800">🏖️ Congé</h4>
                        {resume.conge ? (
                            <p className="text-gray-700">
                                Du <strong>{resume.conge.date_debut}</strong> au <strong>{resume.conge.date_fin}</strong><br />
                                Statut : <span className="capitalize">{resume.conge.statut}</span>
                            </p>
                        ) : (
                            <p className="text-gray-500">Pas en congé aujourd'hui.</p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default EmployeDashboard;
