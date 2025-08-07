import React, { useEffect, useState } from 'react';
import API from '../../api/api';  // <-- Ton fichier api.js avec axios.create
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css'; // Fichier CSS séparé
import { FaClock, FaArrowLeft } from 'react-icons/fa';

function HistoriquePointages() {
    const [pointages, setPointages] = useState([]);
    const utilisateurId = localStorage.getItem('utilisateurId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPointages = async () => {
            try {
                const res = await API.get(`/api/pointages/historique/${utilisateurId}`);
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
    };

    return (
        <DashboardLayout role="employe">
            <div className="pointages-container">
                <button className="retour-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Retour
                </button>
                <h2 className="titre-page">Historique des pointages</h2>
                <table className="pointages-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Date et heure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointages.map((p, i) => (
                            <tr key={i}>
                                <td><FaClock /></td>
                                <td>{p.type}</td>
                                <td>{formatLongDate(p.horodatage)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default HistoriquePointages;
