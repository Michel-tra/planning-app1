import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PointeurAbsences = () => {
    const [resume, setResume] = useState(null);
    const [parUtilisateur, setParUtilisateur] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await axios.get('http://localhost:5000/api/stats/absences');
                const res2 = await axios.get('http://localhost:5000/api/stats/absences-par-user');

                setResume(res1.data);
                setParUtilisateur(res2.data);
                setLoading(false);
            } catch (err) {
                console.error('Erreur chargement données absences :', err);
                setErreur('Impossible de charger les données.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Statistiques des absences</h2>

            {resume && (
                <div>
                    <p><strong>Total utilisateurs :</strong> {resume.total_utilisateurs}</p>
                    <p><strong>Moyenne des absences :</strong> {resume.moyenne}</p>
                </div>
            )}

            <h3>Détails par utilisateur</h3>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Nombre d'absences</th>
                    </tr>
                </thead>
                <tbody>
                    {parUtilisateur.map((u) => (
                        <tr key={u.utilisateur_id}>
                            <td>{u.nom}</td>
                            <td>{u.prenom}</td>
                            <td>{u.absences}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PointeurAbsences;
