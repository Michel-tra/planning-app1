import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function ModifierUtilisateur() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [utilisateur, setUtilisateur] = useState({
        nom: '',
        email: '',
        role: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Charger les données de l'utilisateur
        fetch(`http://localhost:5000/api/utilisateurs/${id}`)
            .then(res => res.json())
            .then(data => {
                setUtilisateur(data);
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
        console.log('➡️ Formulaire soumis');
        try {
            const res = await fetch(`http://localhost:5000/api/utilisateurs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(utilisateur),
            });

            if (res.ok) {
                alert('Utilisateur modifié avec succès !');
                navigate('/admin/utilisateurs');
            } else {
                alert('Erreur lors de la modification.');
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (

        <div className="page-container">
            <h2>Modifier l'utilisateur</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom :
                    <input type="text" name="nom" value={utilisateur.nom} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Email :
                    <input type="email" name="email" value={utilisateur.email} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Rôle :
                    <select name="role" value={utilisateur.role} onChange={handleChange} required>
                        <option value="">-- Choisir un rôle --</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="employe">Employé</option>
                    </select>
                </label>
                <br />
                <button type="submit">💾 Enregistrer</button>
            </form>
        </div>

    );
}

export default ModifierUtilisateur;
