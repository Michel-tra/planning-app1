import React, { useEffect, useState } from 'react';

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
        fetch('http://localhost:5000/api/utilisateurs')
            .then((res) => res.json())
            .then((data) => setUtilisateurs(data))
            .catch((err) => console.error('Erreur chargement utilisateurs:', err));
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/plannings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                alert('Planning créé !');
                onPlanningCree(); // pour rafraîchir la liste après création
                setFormData({ utilisateur_id: '', date: '', heure_debut: '', heure_fin: '', tache: '' });
            } else {
                alert('Erreur lors de la création du planning.');
            }
        } catch (err) {
            console.error('Erreur réseau:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Créer un Planning</h3>

            <label>Employé</label>
            <select name="utilisateur_id" value={formData.utilisateur_id} onChange={handleChange} required>
                <option value="">-- Choisir un utilisateur --</option>
                {utilisateurs.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.nom} ({u.role})
                    </option>
                ))}
            </select>

            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />

            <label>Heure de début</label>
            <input type="time" name="heure_debut" value={formData.heure_debut} onChange={handleChange} required />

            <label>Heure de fin</label>
            <input type="time" name="heure_fin" value={formData.heure_fin} onChange={handleChange} required />

            <label>Tâche</label>
            <input type="text" name="tache" value={formData.tache} onChange={handleChange} required />

            <button type="submit">Créer le planning</button>
        </form>
    );
};

export default PlanningForm;
