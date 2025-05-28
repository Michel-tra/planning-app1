import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';


function GestionUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/utilisateurs')
            .then(res => res.json())
            .then(data => setUtilisateurs(data))
            .catch(err => console.error('Erreur lors du chargement des utilisateurs', err));
    }, []);

    const handleModifier = (id) => {
        window.location.href = `/admin/modifier-utilisateur/${id}`;
    };

    const handleSupprimer = async (id) => {
        const confirm = window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?');
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:5000/api/utilisateurs/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Supprimer l'utilisateur localement
                setUtilisateurs(prev => prev.filter(u => u.id !== id));
            } else {
                alert('Erreur lors de la suppression.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="page-container">
                <h2>Gestion des utilisateurs</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <button onClick={() => window.location.href = '/admin/ajouter-utilisateur'}>
                        ➕ Ajouter un utilisateur
                    </button>
                </div>


                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilisateurs.map(user => (
                            <tr key={user.id}>
                                <td>{user.nom}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleModifier(user.id)}>Modifier</button>
                                    <button onClick={() => handleSupprimer(user.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default GestionUtilisateurs;
