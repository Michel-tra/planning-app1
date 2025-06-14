import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CongeEmploye = () => {
    const [demandes, setDemandes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/conges/manager/toutes');
            setDemandes(res.data);
        } catch (error) {
            console.error('Erreur chargement des congés', error);
        }
    };

    const handleUpdate = async (id, statut) => {
        try {
            await axios.put(`http://localhost:5000/api/conges/manager/${id}`, {
                statut,
                commentaire: statut === 'refuse' ? 'Refusé par le manager' : '',
            });
            fetchDemandes();
        } catch (error) {
            console.error('Erreur mise à jour du statut', error);
        }
    };

    return (
        <div className="container">
            <h2>Demandes de congé des employés</h2>
            {/* BOUTON RETOUR */}
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                ← Retour
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Employé</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Motif</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {demandes.map((d) => (
                        <tr key={d.id}>
                            <td>{d.nom}</td>
                            <td>{d.date_debut}</td>
                            <td>{d.date_fin}</td>
                            <td>{d.commentaire || '-'}</td>
                            <td>{d.statut}</td>
                            <td>
                                {d.statut === 'en_attente' && (
                                    <>
                                        <button onClick={() => handleUpdate(d.id, 'accepte')}>Accepter</button>
                                        <button onClick={() => handleUpdate(d.id, 'refuse')}>Refuser</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CongeEmploye;
