import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css'; // ← Nouveau fichier CSS

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const jour = String(d.getDate()).padStart(2, '0');
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const annee = d.getFullYear();
    return `${jour}/${mois}/${annee}`;
};

const CongeEmploye = () => {
    const [demandes, setDemandes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/conges/manager/toutes`);
            setDemandes(res.data);
        } catch (error) {
            console.error('Erreur chargement des congés', error);
        }
    };

    const handleUpdate = async (id, statut) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/conges/manager/${id}`, {
                statut,
                commentaire: statut === 'refuse' ? 'Refusé par le manager' : '',
            });
            fetchDemandes();
        } catch (error) {
            console.error('Erreur mise à jour du statut', error);
        }
    };

    return (
        <div className="conge-container">
            <h2 className="conge-title">🗓️ Demandes de congé des employés</h2>
            <button className="btn-retour" onClick={() => navigate(-1)}>← Retour</button>
            <div className="table-wrapper">
                <table className="conge-table">
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
                                <td>{formatDate(d.date_debut)}</td>
                                <td>{formatDate(d.date_fin)}</td>
                                <td>{d.commentaire || '-'}</td>
                                <td className={`statut ${d.statut}`}>{d.statut}</td>
                                <td>
                                    {d.statut === 'en_attente' && (
                                        <div className="btn-group">
                                            <button className="btn-accept" onClick={() => handleUpdate(d.id, 'accepte')}>
                                                ✔ Accepter
                                            </button>
                                            <button className="btn-refuse" onClick={() => handleUpdate(d.id, 'refuse')}>
                                                ✖ Refuser
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CongeEmploye;
