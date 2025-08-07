import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import API from '../../api/api';  // <-- Ton fichier api.js avec axios.create

function ModifierUtilisateur() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [utilisateur, setUtilisateur] = useState({
        nom: '',
        prenom: '',
        email: '',
        badge_code: '',
        role: '',
        poste: '',
        telephone: '',
        jour_repos: '',
        date_embauche: '',
        mot_de_passe: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/api/utilisateurs/${id}`)
            .then(res => {
                setUtilisateur(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erreur chargement utilisateur :', err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUtilisateur(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/api/utilisateurs/${id}`, utilisateur);
            alert('✅ Utilisateur modifié avec succès !');
            navigate('/admin/utilisateurs');
        } catch (error) {
            console.error('Erreur lors de la modification :', error);
            alert('❌ Erreur lors de la modification.');
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="form-container">
            <button className="btn-retour" onClick={() => navigate('/admin/utilisateurs')}>
                ⬅ Retour à la gestion des utilisateurs
            </button>

            <h2>✏️ Modifier l'utilisateur</h2>

            <form className="styled-form" onSubmit={handleSubmit}>
                <label>Nom :
                    <input type="text" name="nom" value={utilisateur.nom} onChange={handleChange} required />
                </label>

                <label>Prénom :
                    <input type="text" name="prenom" value={utilisateur.prenom} onChange={handleChange} required />
                </label>

                <label>Email :
                    <input type="email" name="email" value={utilisateur.email} onChange={handleChange} required />
                </label>

                <label>Poste :
                    <input type="text" name="poste" value={utilisateur.poste} onChange={handleChange} />
                </label>

                <label>Téléphone :
                    <input type="text" name="telephone" value={utilisateur.telephone} onChange={handleChange} />
                </label>

                <label>Jour de repos :
                    <input type="text" name="jour_repos" value={utilisateur.jour_repos} onChange={handleChange} />
                </label>

                <label>Date d'embauche :
                    <input type="date" name="date_embauche" value={utilisateur.date_embauche} onChange={handleChange} />
                </label>

                <label>Badge :
                    <input type="text" name="badge_code" value={utilisateur.badge_code} onChange={handleChange} />
                </label>

                <label>Mot de passe (laisser vide si inchangé) :
                    <input type="password" name="mot_de_passe" value={utilisateur.mot_de_passe} onChange={handleChange} />
                </label>

                <label>Rôle :
                    <select name="role" value={utilisateur.role} onChange={handleChange} required>
                        <option value="">-- Choisir un rôle --</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employe">Employé</option>
                        <option value="pointeur">Pointeur</option>
                    </select>
                </label>

                <button type="submit" className="btn-primary">💾 Enregistrer</button>
            </form>
        </div>
    );
}

export default ModifierUtilisateur;
