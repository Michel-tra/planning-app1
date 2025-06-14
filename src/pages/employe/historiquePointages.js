import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';



function HistoriquePointages() {
    const [pointages, setPointages] = useState([]);
    const utilisateurId = localStorage.getItem('utilisateurId');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchPointages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/pointages/historique/${utilisateurId}`);
                setPointages(res.data);
            } catch (err) {
                console.error("Erreur lors du chargement des pointages :", err);
            }
        };

        fetchPointages();
    }, [utilisateurId]);
    const formatLongDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <DashboardLayout role="employe">
            <h2 className="text-2xl font-bold mb-4">Historique des pointages</h2>
            {/* BOUTON RETOUR */}
            <button onClick={() => navigate(-1)} className="mb-4 bg-gray-200 p-2 rounded hover:bg-gray-300 transition">
                ← Retour
            </button>
            <ul className="space-y-3">
                {pointages.map((p, i) => (
                    <li key={i} className="bg-white p-3 rounded shadow">
                        <strong>{p.date}</strong>  {p.type} le {formatLongDate(p.horodatage)}
                    </li>
                ))}
            </ul>
        </DashboardLayout>
    );
}

export default HistoriquePointages;
