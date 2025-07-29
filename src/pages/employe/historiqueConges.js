import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

function HistoriqueConges() {
    const [conges, setConges] = useState([]);
    const utilisateurId = localStorage.getItem('utilisateurId');
    const navigate = useNavigate();

    const formaterDateLongue = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatutIcon = (statut) => {
        switch (statut.toLowerCase()) {
            case 'accepté':
                return '✅';
            case 'refusé':
                return '❌';
            case 'en attente':
                return '⏳';
            default:
                return '❔';
        }
    };

    useEffect(() => {
        const fetchConges = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/conges/historique/${utilisateurId}`);
                setConges(res.data);
            } catch (err) {
                console.error("Erreur lors du chargement des congés :", err);
            }
        };
        fetchConges();
    }, [utilisateurId]);

    return (
        <DashboardLayout role="employe">
            <div className="historique-conges-container">
                <button onClick={() => navigate(-1)} className="retour-btn">← Retour</button>
                <h2 className="titre">Historique des congés</h2>

                <table className="conges-table">
                    <thead>
                        <tr>
                            <th>Date de début</th>
                            <th>Date de fin</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conges.map((c, i) => (
                            <tr key={i}>
                                <td>{formaterDateLongue(c.date_debut)}</td>
                                <td>{formaterDateLongue(c.date_fin)}</td>
                                <td className={`statut ${c.statut.toLowerCase()}`}>
                                    {getStatutIcon(c.statut)} {c.statut}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default HistoriqueConges;
