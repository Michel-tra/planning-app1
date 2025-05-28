import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlanningEmploye = ({ utilisateurId }) => {
    const [plannings, setPlannings] = useState([]);
    const [demande, setDemande] = useState('');

    useEffect(() => {
        fetchPlannings();
    }, []);

    const fetchPlannings = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/plannings/employe/${utilisateurId}`);
            setPlannings(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement du planning', err);
        }
    };

    const demanderModification = (planningId) => {
        const commentaire = prompt('Entrez votre demande de modification :');
        if (!commentaire) return;

        axios.post(`http://localhost:5000/api/demandes_modif`, {
            planning_id: planningId,
            utilisateur_id: utilisateurId,
            commentaire,
        })
            .then(() => alert('Demande envoyée'))
            .catch(err => console.error(err));
    };

    const demanderConge = (date) => {
        const raison = prompt('Raison de la demande de congé :');
        if (!raison) return;

        axios.post(`http://localhost:5000/api/demandes_conge`, {
            utilisateur_id: utilisateurId,
            date,
            raison
        })
            .then(() => alert('Demande de congé envoyée'))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h3>📅 Mon Planning</h3>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Heure début</th>
                        <th>Heure fin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plannings.map((p) => (
                        <tr key={p.id}>
                            <td>{p.date}</td>
                            <td>{p.heure_debut}</td>
                            <td>{p.heure_fin}</td>
                            <td>
                                <button onClick={() => demanderModification(p.id)}>🛠 Modifier</button>
                                <button onClick={() => demanderConge(p.date)}>🌴 Demander congé</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlanningEmploye;
