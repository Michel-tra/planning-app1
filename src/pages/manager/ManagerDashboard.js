import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

function ManagerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [absencesMois, setAbsencesMois] = useState([]);
    const managerId = localStorage.getItem('utilisateurId');
    const [tauxAbsences, setTauxAbsences] = useState([]);
    const [formattedData, setFormattedData] = useState([]);
    const [retards, setRetards] = useState([]);
    const [filtre, setFiltre] = useState('annee'); // 'annee' | 'mois' | 'semaine'
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [mois, setMois] = useState(new Date().getMonth() + 1);
    const [semaine, setSemaine] = useState(null);
    const [anneeAbs, setAnneeAbs] = useState(new Date().getFullYear());
    const [absencesParUtilisateur, setAbsencesParUtilisateur] = useState([]);

    useEffect(() => {
        const fetchParUtilisateur = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stats/absences-par-mois-utilisateur?annee=${anneeAbs}`);
                setAbsencesParUtilisateur(res.data);
            } catch (err) {
                console.error("Erreur absences par utilisateur :", err);
            }
        };

        fetchParUtilisateur();
    }, [anneeAbs]);



    useEffect(() => {
        const fetchAbsencesParMois = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stats/absences-par-mois?annee=${anneeAbs}`);
                setAbsencesMois(res.data);
            } catch (err) {
                console.error("Erreur chargement absences par mois :", err);
            }
        };

        fetchAbsencesParMois();
    }, [anneeAbs]);




    useEffect(() => {
        const fetchRetards = async () => {
            try {
                const params = { filtre, annee };
                if (filtre === 'mois') params.mois = mois;
                if (filtre === 'semaine') params.semaine = semaine;

                const res = await axios.get('http://localhost:5000/api/stats/retards-par-utilisateur', { params });
                const formatted = res.data.map(item => ({
                    ...item,
                    utilisateur: `${item.prenom} ${item.nom}`
                }));
                setRetards(formatted);
            } catch (err) {
                console.error("Erreur récupération retards :", err);
            }
        };

        fetchRetards();
    }, [filtre, annee, mois, semaine]);


    useEffect(() => {
        if (tauxAbsences.length > 0) {
            const data = tauxAbsences.map(item => ({
                utilisateur: item.nom,
                taux_presence: item.taux_presence,
                taux_absence: item.taux_absence
            }));
            setFormattedData(data);
        }
    }, [tauxAbsences]);

    useEffect(() => {
        const fetchTauxAbsences = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/stats/absences-utilisateurs');
                setTauxAbsences(res.data);
                console.log("📊 Données reçues :", res.data);
            } catch (err) {
                console.error("Erreur chargement taux absences :", err);
            }
        };

        fetchTauxAbsences();
    }, []);


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stats/manager?managerId=${managerId}`);
                setStats(res.data);

                const absMois = await axios.get("http://localhost:5000/api/stats/absences-par-mois");
                setAbsencesMois(absMois.data);
            } catch (err) {
                console.error("Erreur lors du chargement des statistiques :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);


    return (
        <DashboardLayout role="manager">
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold mb-6">Tableau de bord Manager</h2>

                {loading ? (
                    <p>Chargement des statistiques...</p>
                ) : (
                    <>
                        <div className="dashboard-cards">
                            <div className="dashboard-card">
                                <h3>👨‍💼 Utilisateurs connectés</h3>
                                <p>3</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>📍 Mon pointage aujourd'hui</h3>
                                <p>Absent</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>⏰ Taux de pointage</h3>
                                <p>0%</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>📅 Plannings cette semaine</h3>
                                <p>0</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>📝 Congés en attente</h3>
                                <p>0</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>❌ Absents aujourd'hui</h3>
                                <p>3</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>⏱️ Retards aujourd'hui</h3>
                                <p>0</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-4 mt-10">📊 Absences par mois</h3>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            {absencesMois.length === 0 ? (
                                <p>Aucune donnée d'absences disponible.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={absencesMois}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mois" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#3498db" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>


                        <div className="bg-white shadow-md p-6 rounded-lg mt-10">
                            <h5 className="text-xl font-semibold mb-4">📊 Taux de présence et d'absence par utilisateur</h5>
                            {tauxAbsences.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="utilisateur"
                                            angle={-45}
                                            textAnchor="end"
                                            interval={0}
                                            height={100}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="taux_presence" fill="#4CAF50" name="Présence (%)" />
                                        <Bar dataKey="taux_absence" fill="#F44336" name="Absence (%)" />
                                    </BarChart>
                                </ResponsiveContainer>

                            ) : (
                                <p>Aucune donnée d’absence disponible.</p>
                            )}
                        </div>

                        <div className="bg-white shadow p-6 rounded-lg mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">📊 Congés acceptés par mois</h3>
                                <select
                                    value={anneeAbs}
                                    onChange={(e) => setAnneeAbs(e.target.value)}
                                    className="border px-2 py-1 rounded"
                                >
                                    {[2023, 2024, 2025].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>

                            {absencesMois.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={absencesMois}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mois" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#4CAF50" name="Congés acceptés" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>Aucune donnée de congés disponible pour cette année.</p>
                            )}
                        </div>
                        <div className="bg-white shadow p-6 rounded-lg mt-8">
                            <h3 className="text-lg font-semibold mb-4">👤 Congés par bénéficiaire (par mois)</h3>

                            {absencesParUtilisateur.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={absencesParUtilisateur}
                                        layout="vertical"
                                        margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="beneficiaire" />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#8884d8" name="Congés" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>Aucune donnée disponible pour les utilisateurs cette année.</p>
                            )}
                        </div>

                        <h5 className="text-xl font-semibold mb-4">👥 Utilisateurs connectés</h5>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                                        <th className="px-4 py-3">Nom</th>
                                        <th className="px-4 py-3">Prénom</th>
                                        <th className="px-4 py-3">Rôle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.utilisateursConnectes.map((user) => (
                                        <tr key={user.id} className="border-b">
                                            <td className="px-4 py-2">{user.nom}</td>
                                            <td className="px-4 py-2">{user.prenom}</td>
                                            <td className="px-4 py-2 capitalize">{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white shadow p-6 rounded-lg mt-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <h3 className="text-lg font-semibold">🚦 Retards par utilisateur</h3>

                                <div className="flex gap-2 items-center">
                                    <select value={filtre} onChange={e => setFiltre(e.target.value)} className="border px-2 py-1 rounded">
                                        <option value="annee">Par année</option>
                                        <option value="mois">Par mois</option>
                                        <option value="semaine">Par semaine</option>
                                    </select>

                                    <select value={annee} onChange={e => setAnnee(e.target.value)} className="border px-2 py-1 rounded">
                                        {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>

                                    {filtre === 'mois' && (
                                        <select value={mois} onChange={e => setMois(e.target.value)} className="border px-2 py-1 rounded">
                                            {[
                                                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                                                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                                            ].map((m, idx) => (
                                                <option key={idx + 1} value={idx + 1}>{m}</option>
                                            ))}
                                        </select>
                                    )}

                                    {filtre === 'semaine' && (
                                        <input
                                            type="number"
                                            min="1"
                                            max="53"
                                            value={semaine || ''}
                                            onChange={e => setSemaine(e.target.value)}
                                            placeholder="Semaine"
                                            className="border px-2 py-1 rounded w-[90px]"
                                        />
                                    )}
                                </div>
                            </div>

                            {retards.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={retards} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="utilisateur" angle={-45} textAnchor="end" interval={0} height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total_retards" fill="#FF9800" name="Nombre de retards" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>Aucune donnée disponible pour ce filtre.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
        </div>
    );
}

export default ManagerDashboard;
