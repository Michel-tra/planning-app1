import React, { useEffect, useState } from 'react';
import '../../styles/App.css';
import { useNavigate } from 'react-router-dom';

function GestionUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [recherche, setRecherche] = useState('');
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Non définie';
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Non définie' : date.toLocaleDateString();
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Jamais';
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Jamais' : date.toLocaleString();
    };

    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:5000/api/utilisateurs')
            .then(res => res.json())
            .then(data => {
                // S'assurer que chaque utilisateur a la propriété actif
                const usersWithStatus = data.map(u => ({ ...u, actif: u.actif ?? true }));
                setUtilisateurs(usersWithStatus);
                console.log('Utilisateurs chargés :', usersWithStatus);
            })

            .catch(err => console.error('Erreur chargement utilisateurs', err));
    }, []);

    const handleModifier = (id) => {
        window.location.href = `/admin/modifier-utilisateur/${id}`;
    };
    const exportPDF = async () => {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        doc.text("Liste des utilisateurs", 10, 10);
        utilisateurs.forEach((u, i) => {
            doc.text(`${i + 1}. ${u.nom} - ${u.email} - ${u.role}`, 10, 20 + i * 10);
        });

        doc.save("utilisateurs.pdf");
    };
    const handleChangeRole = async (id, nouveauRole) => {
        try {
            const res = await fetch(`http://localhost:5000/api/utilisateurs/${id}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: nouveauRole }),
            });
            if (res.ok) {
                setUtilisateurs(prev =>
                    prev.map(u => (u.id === id ? { ...u, role: nouveauRole } : u))
                );
            } else {
                alert("Erreur lors du changement de rôle.");
            }
        } catch (err) {
            console.error("Erreur rôle :", err);
        }
    };
    const handleToggleStatus = async (id, actif) => {
        try {
            const res = await fetch(`http://localhost:5000/api/utilisateurs/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actif: !actif }),
            });
            if (res.ok) {
                setUtilisateurs(prev =>
                    prev.map(u => (u.id === id ? { ...u, actif: !actif } : u))
                );
            }
        } catch (err) {
            console.error("Erreur activation :", err);
        }
    };


    const handleSupprimer = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/utilisateurs/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setUtilisateurs(prev => prev.filter(u => u.id !== id));
            } else {
                alert('Erreur suppression');
            }
        } catch (error) {
            console.error('Erreur suppression :', error);
        }
    };

    // Filtrage des utilisateurs
    const utilisateursFiltres = utilisateurs.filter(user =>
        (user.nom + user.prenom + user.email + user.role)
            .toLowerCase()
            .includes(recherche.toLowerCase())
    );

    return (
        <div className="page-container">
            <h2>Gestion des utilisateurs</h2>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="🔍 Rechercher par nom, email ou rôle"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    style={{ marginRight: '1rem', padding: '5px' }}
                />
                <div style={{ marginBottom: '1rem' }}>
                    <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                        ← Retour
                    </button>
                    <button onClick={() => window.location.href = '/admin/ajouter-utilisateur'}>
                        ➕ Ajouter un utilisateur
                    </button>
                    <button onClick={exportPDF} style={{ marginLeft: '1rem' }}>📑 Export PDF</button>
                    <button onClick={() => window.location.reload()}>🔁 Rafraîchir</button>

                </div>

            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Date d'embauche</th>
                        <th>Dernier login</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {utilisateursFiltres.length === 0 ? (
                        <tr><td colSpan="7">Aucun utilisateur trouvé.</td></tr>
                    ) : (
                        utilisateursFiltres.map(user => (
                            <tr key={user.id}>
                                <td>{user.nom}</td>
                                <td>{user.prenom}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                    >
                                        <option value="employe">Employé</option>
                                        <option value="manager">Manager</option>
                                        <option value="pointeur">Pointeur</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>

                                <td>{formatDate(user.date_embauche)}</td>
                                <td>{formatDateTime(user.dernier_login)}</td>
                                <td>
                                    <button onClick={() => handleToggleStatus(user.id, user.actif)}>
                                        {user.actif ? 'Désactiver' : 'Activer'}
                                    </button>
                                </td>

                                <td>
                                    <button onClick={() => handleModifier(user.id)}>✏️</button>
                                    <button onClick={() => handleSupprimer(user.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GestionUtilisateurs;
