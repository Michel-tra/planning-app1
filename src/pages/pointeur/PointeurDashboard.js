import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';

function PointeurDashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        const fetchAbsences = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/absences');
                setData(res.data); // Le backend doit retourner [{ nom: 'Alice', absences: 3 }, ...]
            } catch (error) {
                console.error('Erreur lors du chargement des absences :', error);
            }
        };

        fetchAbsences();
    }, []);

    return (
        <DashboardLayout role="pointeur">
            <div style={styles.dashboard}>
                <div style={styles.chartContainer}>
                    <h3>Absences des employés</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nom" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="absences" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </DashboardLayout>
    );
}

const styles = {
    dashboard: {
        padding: '2rem',
        width: '100%'
    },
    chartContainer: {
        background: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }
};

export default PointeurDashboard;
