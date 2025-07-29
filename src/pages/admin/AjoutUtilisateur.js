import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

function AjoutUtilisateur() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        telephone: '',
        poste: '',
        badge_code: '',
        role: 'employe',
        jour_repos: '',
        date_embauche: ''
    });

    const [erreur, setErreur] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.motDePasse.length < 6) {
            setErreur("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/utilisateurs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: form.nom,
                    prenom: form.prenom,
                    email: form.email,
                    mot_de_passe: form.motDePasse,
                    telephone: form.telephone,
                    poste: form.poste,
                    badge_code: form.badge_code,
                    role: form.role,
                    jour_repos: form.jour_repos,
                    date_embauche: form.date_embauche,
                }),
            });

            if (response.ok) {
                alert("✅ Utilisateur ajouté avec succès");
                navigate('/admin/utilisateurs');
            } else {
                const errData = await response.json();
                setErreur(errData.message || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
            setErreur('Une erreur réseau est survenue');
        }
    };

    return (
        <div className="ajout-utilisateur-container">
            <h2 className="titre-ajout">➕ Ajouter un utilisateur</h2>

            {erreur && <div className="erreur-message">{erreur}</div>}

            <form className="form-ajout" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Nom :
                        <input type="text" name="nom" value={form.nom} onChange={handleChange} required />
                    </label>
                    <label>Prénom :
                        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required />
                    </label>
                </div>

                <div className="form-row">
                    <label>Email :
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                    </label>
                    <label>Mot de passe :
                        <input type="password" name="motDePasse" value={form.motDePasse} onChange={handleChange} required />
                    </label>
                </div>

                <div className="form-row">
                    <label>Téléphone :
                        <input type="text" name="telephone" value={form.telephone} onChange={handleChange} />
                    </label>
                    <label>Poste :
                        <input type="text" name="poste" value={form.poste} onChange={handleChange} />
                    </label>
                </div>

                <div className="form-row">
                    <label>Badge Code :
                        <input type="text" name="badge_code" value={form.badge_code} onChange={handleChange} />
                    </label>
                    <label>Rôle :
                        <select name="role" value={form.role} onChange={handleChange} required>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employe">Employé</option>
                            <option value="pointeur">Pointeur</option>
                        </select>
                    </label>
                </div>

                <div className="form-row">
                    <label>Jour de repos :
                        <select name="jour_repos" value={form.jour_repos} onChange={handleChange} required>
                            <option value="">-- Choisir un jour --</option>
                            <option value="lundi">Lundi</option>
                            <option value="mardi">Mardi</option>
                            <option value="mercredi">Mercredi</option>
                            <option value="jeudi">Jeudi</option>
                            <option value="vendredi">Vendredi</option>
                            <option value="samedi">Samedi</option>
                            <option value="dimanche">Dimanche</option>
                        </select>
                    </label>
                    <label>Date d'embauche :
                        <input type="date" name="date_embauche" value={form.date_embauche} onChange={handleChange} required />
                    </label>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-retour" onClick={() => navigate('/admin/utilisateurs')}>← Retour</button>
                    <button type="submit" className="btn-ajouter">✅ Ajouter l'utilisateur</button>
                </div>
            </form>
        </div>
    );
}

export default AjoutUtilisateur;
