import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

function Pointages() {
    const [pointages, setPointages] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchPointages();
    }, []);

    const fetchPointages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pointages');
            setPointages(res.data);
        } catch (error) {
            console.error('Erreur lors du chargement des pointages :', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="pointages-container">
                <h2>Historique des Pointages</h2>
                {/* BOUTON RETOUR */}
                <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                    ← Retour
                </button>
                <table className="pointages-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom de l'utilisateur</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Heure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointages.map(p => {
                            const date = new Date(p.horodatage);
                            const jour = date.toLocaleDateString();
                            const heure = date.toLocaleTimeString();

                            return (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nom_utilisateur}</td>
                                    <td>{p.type}</td>
                                    <td>{jour}</td>
                                    <td>{heure}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Pointages;
