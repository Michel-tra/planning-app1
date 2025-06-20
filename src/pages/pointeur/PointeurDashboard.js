import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import '../../styles/App.css';

function PointeurDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ total: 0, moyenne: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const res = await axios.get('http://localhost:5000/api/stats/absences');
            setStats(res.data);
        };

        const fetchAbsencesParUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/stats/absences-par-user');
                const formatted = res.data.map(user => ({
                    nom: user.nom,
                    absences: parseInt(user.absences),
                    taux_absence: parseFloat(user.taux_absence),
                    taux_presence: parseFloat(user.taux_presence)
                }));
                setData(formatted);
            } catch (err) {
                console.error('Erreur absences par utilisateur :', err);
            }
        };

        fetchStats();
        fetchAbsencesParUser();
    }, []);

    return (
        <DashboardLayout role="pointeur">
            <div style={styles.dashboard}>
                <h2 style={{ marginBottom: '1.5rem' }}>Tableau de bord Pointeur</h2>

                <div style={styles.chartSection}>
                    <div style={styles.chartContainer}>
                        <h3>Nombre d'absences par employé</h3>
                        {data.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nom" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="absences" fill="#007bff" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <p>Aucune donnée à afficher.</p>}

                        <button
                            onClick={() => navigate('/pointeur/absences')}
                            style={styles.detailButton}
                        >
                            📋 Voir la liste détaillée
                        </button>
                    </div>
                    <h3>Taux d’absence et de présence</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nom" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Bar dataKey="taux_absence" fill="#dc3545" name="Taux d'absence (%)" />
                            <Bar dataKey="taux_presence" fill="#28a745" name="Taux de présence (%)" />
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </div>


        </DashboardLayout >
    );
}

const styles = {
    dashboard: {
        padding: '2rem',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    chartSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    chartContainer: {
        background: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '2rem',
        gap: '1rem'
    },
    statCard: {
        background: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
        flex: 1
    },
    detailButton: {
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '5px',
        background: '#007bff',
        color: '#fff',
        cursor: 'pointer'
    }
};

export default PointeurDashboard;
