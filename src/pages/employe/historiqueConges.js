import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';


function HistoriqueConges() {
    const [conges, setConges] = useState([]);
    const utilisateurId = localStorage.getItem('utilisateurId');
    const navigate = useNavigate();
    // Fonction pour formater la date au format "jour mois année"
    const formaterDateLongue = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };



    useEffect(() => {
        const fetchConges = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/conges/historique/${utilisateurId}`);
                setConges(res.data);
                console.log("Données reçues :", res.data);

            } catch (err) {
                console.error("Erreur lors du chargement des congés :", err);
            }
        };

        fetchConges();
    }, [utilisateurId]);

    return (
        <DashboardLayout role="employe">
            <h2 className="text-2xl font-bold mb-4">Historique des congés</h2>
            {/* BOUTON RETOUR */}
            <button onClick={() => navigate(-1)} className="mb-4 bg-gray-200 p-2 rounded hover:bg-gray-300 transition">
                ← Retour
            </button>
            <ul className="space-y-3">
                {conges.map((c, i) => (
                    <li key={i} className="bg-white p-3 rounded shadow">
                        Du <strong>{formaterDateLongue(c.date_debut)}</strong> au <strong>{formaterDateLongue(c.date_fin)}</strong> — {c.statut}
                    </li>
                ))}
            </ul>
        </DashboardLayout>
    );
}

export default HistoriqueConges;
