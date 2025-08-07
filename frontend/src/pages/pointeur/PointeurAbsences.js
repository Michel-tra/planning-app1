import React, { useEffect, useState } from 'react';
import API from '../../api/api';  // <-- Ton fichier api.js avec axios.create
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import '../../styles/App.css';

const PointeurAbsences = () => {
    const [resume, setResume] = useState(null);
    const [parUtilisateur, setParUtilisateur] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await API.get(`/api/stats/absences`);
                const res2 = await API.get(`/api/stats/absences-par-user`);

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

    return (
        <DashboardLayout role="pointeur">
            <div className="absences-wrapper">
                <h2 className="absences-title">📊 Statistiques des absences</h2>

                <button className="back-button" onClick={() => navigate('/pointeur/')}>
                    ← Retour au Dashboard
                </button>

                {loading && <p>Chargement...</p>}
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

                {!loading && !erreur && (
                    <>
                        {resume && (
                            <div className="summary-card">
                                <p><strong>Total utilisateurs :</strong> {resume.total_utilisateurs}</p>
                                <p><strong>Moyenne des absences :</strong> {resume.moyenne}</p>
                            </div>
                        )}

                        <div className="absences-table-container">
                            <h3>Détails par utilisateur</h3>
                            <button onClick={() => window.open(`/api/stats/export/absences`)} className="export-button">
                                ⬇️ Exporter PDF
                            </button>

                            <table className="absences-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Absences</th>
                                        <th>Taux Présence (%)</th>
                                        <th>Taux Absence (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parUtilisateur.map((u, i) => (
                                        <tr key={i}>
                                            <td>{u.nom}</td>
                                            <td>{u.prenom}</td>
                                            <td>{u.absences}</td>
                                            <td>{u.taux_presence}%</td>
                                            <td>{u.taux_absence}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PointeurAbsences;
