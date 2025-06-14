import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

function MonPlanning() {
    const user = JSON.parse(localStorage.getItem('user'));
    const utilisateurId = user?.id;
    const navigate = useNavigate();

    const [plannings, setPlannings] = useState([]);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        const fetchPlanning = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/plannings/personnel/${utilisateurId}`);
                setPlannings(res.data);
            } catch (err) {
                console.error(err);
                setErreur('Erreur lors du chargement du planning.');
            }
        };

        fetchPlanning();
    }, [utilisateurId]);

    return (
        <DashboardLayout>
            <div style={{ padding: 20 }}>
                <h2>Mon planning</h2>
                {/* BOUTON RETOUR */}
                <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                    ← Retour
                </button>

                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

                {plannings.length > 0 ? (
                    <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Heure de début</th>
                                <th>Heure de fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plannings.map(planning => (
                                <tr key={planning.id}>
                                    <td>{planning.date}</td>
                                    <td>{planning.heure_debut}</td>
                                    <td>{planning.heure_fin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Aucun planning trouvé.</p>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MonPlanning;
