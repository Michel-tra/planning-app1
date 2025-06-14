import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function calculerAnciennete(dateEmbauche) {
    const aujourdHui = new Date();
    const embauche = new Date(dateEmbauche);
    const diffAnnee = aujourdHui.getFullYear() - embauche.getFullYear();
    const diffMois = aujourdHui.getMonth() - embauche.getMonth();
    const totalMois = diffAnnee * 12 + diffMois;
    const annees = Math.floor(totalMois / 12);
    const mois = totalMois % 12;
    return `${annees} an(s) et ${mois} mois`;
}

const Employes = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/utilisateurs/manager/employes')
            .then(response => setUtilisateurs(response.data))
            .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
    }, []);

    return (
        <div className="employes-container" style={{ padding: '2rem' }}>
            <h2>Liste des Employés</h2>
            {/* BOUTON RETOUR */}
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                ← Retour
            </button>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Poste</th>
                        <th>Téléphone</th>
                        <th>Jour de repos</th>
                        <th>Ancienneté</th>
                    </tr>
                </thead>
                <tbody>
                    {utilisateurs.map(utilisateur => (
                        <tr key={utilisateur.id}>
                            <td>{utilisateur.nom}</td>
                            <td>{utilisateur.email}</td>
                            <td>{utilisateur.role}</td>
                            <td>{utilisateur.poste || '—'}</td>
                            <td>{utilisateur.telephone || '—'}</td>
                            <td>{utilisateur.jour_repos || '—'}</td>
                            <td>
                                {utilisateur.date_embauche
                                    ? calculerAnciennete(utilisateur.date_embauche)
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Employes;
