import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';


function ManagerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const managerId = localStorage.getItem('utilisateurId');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stats/manager?managerId=${managerId}`);
                setStats(res.data);
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <StatCard label="👨‍💼 Utilisateurs connectés" value={stats.employesActifs} />
                            <StatCard label="📍 Mon pointage aujourd'hui" value={stats.etatPointageManager} />
                            <StatCard label="🕒 Taux de pointage" value={stats.tauxPointage} />
                            <StatCard label="📅 Plannings cette semaine" value={stats.planningsSemaine} />
                            <StatCard label="🏖️ Congés en attente" value={stats.congesEnAttente} />
                            <StatCard label="❌ Absents aujourd'hui" value={stats.absencesJour} />
                            <StatCard label="⏰ Retards aujourd'hui" value={stats.retardsJour} />
                        </div>

                        <h3 className="text-xl font-semibold mb-4">👥 Utilisateurs connectés</h3>
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
