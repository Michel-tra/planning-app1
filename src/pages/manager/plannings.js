import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/App.css';
import { useNavigate } from 'react-router-dom';

//const formatDate = (date) => {
//    if (!date) return '';
//  const d = new Date(date);
//return isNaN(d.getTime()) ? '' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
//};

/*const formatHeure = (heure) => {
    if (!heure || typeof heure !== 'string') return '';
    const [h, m] = heure.split(':');
    return `${h}h${m}`;
};*/

function Plannings() {
    const [plannings, setPlannings] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [form, setForm] = useState({
        nom_utilisateur: '',
        utilisateur_id: '',
        date: '',
        heure_debut: '',
        heure_fin: '',
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const resetForm = () => {
        setForm({ nom_utilisateur: '', utilisateur_id: '', date: '', heure_debut: '', heure_fin: '', description: '' });
        setIsEditing(false);
        setEditId(null);
    };


    const [formVisible, setFormVisible] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchPlannings();
        fetchUtilisateurs();
    }, []);

    const fetchPlannings = async () => {
        try {
            const res = await axios.get('/api/plannings');
            console.log('Plannings reçus:', res.data);
            setPlannings(res.data);

        } catch (error) {
            console.error('Erreur chargement plannings:', error);
        }
    };

    const fetchUtilisateurs = async () => {
        try {
            const res = await axios.get('/api/utilisateurs');
            setUtilisateurs(res.data);
            console.log('Utilisateurs chargés :', res.data);
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error);
        }
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        try {
            const utilisateur = utilisateurs.find(
                (u) => u.nom.toLowerCase() === form.nom_utilisateur.trim().toLowerCase()

            );

            if (!utilisateur) {
                alert("Utilisateur introuvable. Veuillez saisir un nom valide.");
                return;
            }

            const payload = {
                utilisateur_id: utilisateur.id,
                date: form.date,
                heure_debut: form.heure_debut,
                heure_fin: form.heure_fin,
                description: form.description,
            };

            await axios.post('/api/plannings', payload);
            fetchPlannings();
            setForm({ nom_utilisateur: '', date: '', heure_debut: '', heure_fin: '' });
            console.log("Formulaire envoyé :", form);

        } catch (error) {
            console.error('Erreur ajout planning:', error);
        }
    };


    const handleDelete = async id => {
        try {
            await axios.delete(`/api/plannings/${id}`);
            fetchPlannings();
        } catch (error) {
            console.error('Erreur suppression planning:', error);
        }
    };

    const toggleForm = () => {
        setFormVisible(!formVisible);

    }

    const handleUpdate = async () => {
        const utilisateur = utilisateurs.find(
            (u) => u.nom.toLowerCase() === form.nom_utilisateur.trim().toLowerCase()
        );

        if (!utilisateur) {
            alert("Utilisateur introuvable.");
            return;
        }

        try {
            await axios.put(`/api/plannings/${editId}`, {
                utilisateur_id: utilisateur.id,
                date: form.date,
                heure_debut: form.heure_debut,
                heure_fin: form.heure_fin,
                description: form.description,
            });

            fetchPlannings();
            resetForm();
        } catch (error) {
            console.error('Erreur mise à jour planning:', error);
        }
    };
    console.log(plannings);



    return (
        <div className="planning-container">
            <h2>Gestion des Plannings</h2>
            <button className="return-button" onClick={() => navigate('/manager')}>← Retour</button>

            {/* Bouton pour afficher/masquer le formulaire */}
            <button onClick={toggleForm} className="toggle-button">
                {formVisible ? 'Fermer le formulaire' : 'Ajouter un planning'}
            </button>

            {/* Formulaire déroulant */}
            {formVisible && (
                <div
                    className="form-section"
                    style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        maxWidth: '600px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Ajouter un planning</h3>

                    <div
                        className="planning-form"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                        }}
                    >
                        <label style={{ fontWeight: 'bold' }}>
                            Nom de l'utilisateur
                            <input
                                type="text"
                                name="nom_utilisateur"
                                value={form.nom_utilisateur}
                                onChange={handleChange}
                                placeholder="Entrer le nom"
                                style={{
                                    marginTop: '4px',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                }}
                            />
                        </label>

                        <label style={{ fontWeight: 'bold' }}>
                            Date
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                style={{
                                    marginTop: '4px',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                }}
                            />
                        </label>

                        <label style={{ fontWeight: 'bold' }}>
                            Heure de début
                            <input
                                type="time"
                                name="heure_debut"
                                value={form.heure_debut}
                                onChange={handleChange}
                                style={{
                                    marginTop: '4px',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                }}
                            />
                        </label>

                        <label style={{ fontWeight: 'bold' }}>
                            Heure de fin
                            <input
                                type="time"
                                name="heure_fin"
                                value={form.heure_fin}
                                onChange={handleChange}
                                style={{
                                    marginTop: '4px',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                }}
                            />
                        </label>
                        <label style={{ fontWeight: 'bold', gridColumn: '1 / 3' }}>
                            Description
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description du planning"
                                style={{
                                    marginTop: '4px',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                    resize: 'vertical',
                                }}
                            />
                        </label>

                    </div>

                    <button
                        className="add-button"
                        onClick={isEditing ? handleUpdate : handleAdd}
                    >
                        {isEditing ? 'Mettre à jour' : 'Ajouter'}
                    </button>

                </div>
            )}

            {/* Tableau des plannings */}
            <div className="table-section">
                <h3>Liste des plannings</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Date</th>
                            <th>Début</th>
                            <th>Fin</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plannings.map(planning => (
                            <tr key={planning.id}>
                                <td>{planning.id}</td>
                                <td>{planning.nom}</td>
                                <td>{new Date(planning.date).toLocaleDateString()}</td>
                                <td>{planning.heure_debut}</td>
                                <td>{planning.heure_fin}</td>
                                <td>{planning.description ? planning.description : 'Aucune description'}</td>

                                <td>
                                    <button onClick={() => {
                                        setForm({
                                            nom_utilisateur: planning.nom,
                                            utilisateur_id: planning.utilisateur_id,
                                            date: new Date(planning.date).toISOString().split('T')[0],
                                            heure_debut: planning.heure_debut,
                                            heure_fin: planning.heure_fin,
                                            description: planning.description || ''
                                        });
                                        setFormVisible(true);
                                        setIsEditing(true);
                                        setEditId(planning.id);
                                    }}>
                                        Modifier
                                    </button>
                                    <button onClick={() => handleDelete(planning.id)}>Supprimer</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Plannings;
