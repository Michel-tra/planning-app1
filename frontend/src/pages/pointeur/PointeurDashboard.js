import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api'; // Ton fichier api.js avec axios.create
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import '../../styles/App.css';

const COLORS = ['#007bff', '#00c49f', '#ff8042', '#ffbb28', '#8884d8', '#dc3545', '#28a745'];

function PointeurDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAbsencesParUser = async () => {
            try {
                const res = await API.get(`/api/stats/absences-par-user`);
                const formatted = res.data.map((user, index) => ({
                    nom: user.nom,
                    absences: parseInt(user.absences),
                    taux_absence: parseFloat(user.taux_absence),
                    taux_presence: parseFloat(user.taux_presence),
                    color: COLORS[index % COLORS.length]
                }));
                setData(formatted);
            } catch (err) {
                console.error('Erreur absences par utilisateur :', err);
            }
        };

        fetchAbsencesParUser();
    }, []);

    return (
        <DashboardLayout role="pointeur">
            <div className="dashboard-wrapper">
                <h2 className="section-title">📊 Tableau de bord Pointeur</h2>

                <div className="dashboard-section">
                    {/* Histogramme des absences */}
                    <div className="dashboard-chart">
                        <h3>Nombre d'absences par employé</h3>
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nom" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="absences" fill="#007bff" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>Aucune donnée à afficher.</p>
                        )}

                        <button
                            onClick={() => navigate('/pointeur/absences')}
                            className="stats-button"
                        >
                            📋 Voir la liste détaillée
                        </button>
                    </div>

                    {/* Camembert de répartition des présences */}
                    <div className="dashboard-chart">
                        <h3>Répartition du taux de présence</h3>
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="taux_presence"
                                        nameKey="nom"
                                        outerRadius={90}
                                        label
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
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
                </div>
            </div>
        </DashboardLayout>
    );
}

export default PointeurDashboard;
