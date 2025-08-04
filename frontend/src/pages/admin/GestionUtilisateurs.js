import React, { useEffect, useState } from 'react';
import '../../styles/App.css';
import { useNavigate } from 'react-router-dom';

function GestionUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [recherche, setRecherche] = useState('');
    const [filtreActif, setFiltreActif] = useState(true);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetch('http://localhost:5000/api/utilisateurs')
            .then(res => res.json())
            .then(data => {
                const usersWithStatus = data.map(u => ({ ...u, actif: u.actif ?? true }));
                setUtilisateurs(usersWithStatus);
            })
            .catch(err => console.error('Erreur chargement utilisateurs', err));
    }, []);

    const handleModifier = (id) => {
        navigate(`/admin/modifier-utilisateur/${id}`);
    };

    const exportPDF = async () => {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.text("Liste des utilisateurs", 10, 10);
        utilisateurs.forEach((u, i) => {
            doc.text(`${i + 1}. ${u.nom} ${u.prenom} - ${u.email} - ${u.role}`, 10, 20 + i * 10);
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
                body: JSON.stringify({ actif: !actif })
            });

            if (res.ok) {
                setUtilisateurs(prev =>
                    prev.map(u => (u.id === id ? { ...u, actif: !actif } : u))
                );
            } else {
                alert("Erreur mise à jour statut.");
            }
        } catch (err) {
            console.error("Erreur réseau :", err);
        }
    };

    const utilisateursFiltres = utilisateurs
        .filter(user => (user.nom + user.prenom + user.email + user.role).toLowerCase().includes(recherche.toLowerCase()))
        .filter(user => filtreActif ? user.actif : true);

    return (
        <div className="pointages-container">
            <h2 style={{ marginBottom: "20px", fontSize: "26px" }}>👥 Gestion des Utilisateurs</h2>

            <div className="actions" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="🔍 Rechercher nom/email/rôle"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className="input-recherche"
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        minWidth: "250px"
                    }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button className="btn-retour" onClick={() => navigate('/admin/')}>← Retour</button>

                    <button className="btn-pdf" onClick={() => navigate('/admin/ajouter-utilisateur')}>➕ Ajouter</button>
                    <button className="btn-pdf" onClick={exportPDF}>📄 Export PDF</button>
                    <button className="btn-pdf" onClick={() => window.location.reload()}>🔁 Rafraîchir</button>
                    <button className="btn-pdf" onClick={() => setFiltreActif(prev => !prev)}>
                        {filtreActif ? '👁️ Afficher tout' : '✅ Afficher actifs seulement'}
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="pointages-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Badge</th>
                            <th>Rôle</th>
                            <th>Poste</th>
                            <th>Téléphone</th>
                            <th>Jour de repos</th>
                            <th>Date d'embauche</th>
                            <th>Dernier login</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilisateursFiltres.length === 0 ? (
                            <tr>
                                <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        ) : (
                            utilisateursFiltres.map(user => (
                                <tr key={user.id} style={!user.actif ? { opacity: 0.5, background: "#f8f8f8" } : {}}>
                                    <td>{user.nom}</td>
                                    <td>{user.prenom}</td>
                                    <td>{user.email}</td>
                                    <td>{user.badge_code || 'N/A'}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                            style={{
                                                padding: '5px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc'
                                            }}
                                        >
                                            <option value="employe">Employé</option>
                                            <option value="manager">Manager</option>
                                            <option value="pointeur">Pointeur</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>{user.poste || 'N/A'}</td>
                                    <td>{user.telephone || 'N/A'}</td>
                                    <td>{user.jour_repos || 'N/A'}</td>
                                    <td>{formatDate(user.date_embauche)}</td>
                                    <td>{formatDateTime(user.dernier_login)}</td>
                                    <td>
                                        <button
                                            className="btn-pdf"
                                            onClick={() => handleToggleStatus(user.id, user.actif)}
                                            style={{
                                                backgroundColor: user.actif ? '#28a745' : '#dc3545',
                                                color: '#fff'
                                            }}
                                        >
                                            {user.actif ? '🟢 Actif' : '🔴 Inactif'}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-pdf"
                                            onClick={() => handleModifier(user.id)}
                                            title="Modifier"
                                            style={{ backgroundColor: '#007bff', color: 'white' }}
                                        >
                                            ✏️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestionUtilisateurs;
