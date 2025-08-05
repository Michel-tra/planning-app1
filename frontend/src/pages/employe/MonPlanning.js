import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css'; // Assure-toi que ce fichier est bien importé

function MonPlanning() {
    const user = JSON.parse(localStorage.getItem('user'));
    const utilisateurId = user?.id;
    const navigate = useNavigate();

    const [plannings, setPlannings] = useState([]);
    const [erreur, setErreur] = useState('');

    const formaterDateLongue = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const fetchPlanning = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/plannings/personnel/${utilisateurId}`);
                setPlannings(res.data);
            } catch (err) {
                console.error(err);
                setErreur('Erreur lors du chargement du planning.');
            }
        };

        fetchPlanning();
    }, [utilisateurId]);

    return (
        <div className="container">
            <h2 className="page-title">📅 Mon Planning</h2>

            <button className="btn-back" onClick={() => navigate(-1)}>
                ← Retour
            </button>

            {erreur && <p className="error">{erreur}</p>}

            {plannings.length > 0 ? (
                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Heure de début</th>
                                <th>Heure de fin</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plannings.map((planning) => (
                                <tr key={planning.id}>
                                    <td>{formaterDateLongue(planning.date)}</td>
                                    <td>{planning.heure_debut}</td>
                                    <td>{planning.heure_fin}</td>
                                    <td>{planning.description || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data">Aucun planning trouvé.</p>
            )}
        </div>
    );
}

export default MonPlanning;
