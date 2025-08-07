import React, { useEffect, useState } from 'react';
import API from '../../api/api';
// Ton fichier api.js avec axios.create

const PlanningForm = ({ onPlanningCree }) => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [formData, setFormData] = useState({
        utilisateur_id: '',
        date: '',
        heure_debut: '',
        heure_fin: '',
        tache: '',
    });

    useEffect(() => {
        API.get('/api/utilisateurs')
            .then((res) => setUtilisateurs(res.data))
            .catch((err) => console.error('Erreur chargement utilisateurs:', err));
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/api/plannings', formData);
            alert('✅ Planning créé avec succès !');
            if (onPlanningCree) onPlanningCree();  // callback pour rafraîchir la liste
            setFormData({
                utilisateur_id: '',
                date: '',
                heure_debut: '',
                heure_fin: '',
                tache: '',
            });
        } catch (err) {
            console.error('Erreur création planning:', err);
            alert('❌ Erreur lors de la création du planning.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="planning-form">
            <h3>🗓️ Créer un Planning</h3>

            <label>Employé</label>
            <select
                name="utilisateur_id"
                value={formData.utilisateur_id}
                onChange={handleChange}
                required
            >
                <option value="">-- Choisir un utilisateur --</option>
                {utilisateurs.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.nom} {u.prenom} ({u.role})
                    </option>
                ))}
            </select>

            <label>Date</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />

            <label>Heure de début</label>
            <input
                type="time"
                name="heure_debut"
                value={formData.heure_debut}
                onChange={handleChange}
                required
            />

            <label>Heure de fin</label>
            <input
                type="time"
                name="heure_fin"
                value={formData.heure_fin}
                onChange={handleChange}
                required
            />

            <label>Tâche</label>
            <input
                type="text"
                name="tache"
                value={formData.tache}
                onChange={handleChange}
                required
            />

            <button type="submit" className="btn-primary">➕ Créer le planning</button>
        </form>
    );
};

export default PlanningForm;
