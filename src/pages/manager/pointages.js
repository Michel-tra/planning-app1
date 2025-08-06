import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

function Pointages() {
    const [pointages, setPointages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPointages();
    }, []);

    const fetchPointages = async () => {
        try {
            const res = await axios.get('/api/pointages');
            setPointages(res.data);
        } catch (error) {
            console.error('Erreur lors du chargement des pointages :', error);
        }
    };

    return (
        <div className="pointages-page">
            <h2 className="pointages-title">📋 Historique des Pointages</h2>

            <div className="pointages-actions">
                <button className="btn-retour" onClick={() => navigate(-1)}>← Retour</button>

                <a
                    href={`/api/pointages/export/pdf?utilisateur_id=${JSON.parse(localStorage.getItem('user')).id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className="btn-pdf">Télécharger PDF</button>
                </a>
            </div>

            <div className="pointages-table-container">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
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
        </div>
    );
}

export default Pointages;
