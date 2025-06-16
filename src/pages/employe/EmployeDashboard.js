import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';


function EmployeDashboard() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    const utilisateurId = localStorage.getItem('utilisateurId');
    console.log("utilisateurId =", utilisateurId);

    useEffect(() => {
        const fetchResume = async () => {
            if (!utilisateurId) {
                console.error("Aucun utilisateurId trouvé !");
                setLoading(false);
                return;
            }
            try {
                console.log("Appel API vers:", `http://localhost:5000/api/pointages/resume-jour/${utilisateurId}`);
                const res = await axios.get(`http://localhost:5000/api/pointages/resume-jour/${utilisateurId}`);
                console.log("Réponse API :", res.data);
                setResume(res.data);
            } catch (error) {
                console.error("Erreur fetchResume :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [utilisateurId]);

    return (
        <DashboardLayout role="employe">
            <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">👤 Tableau de bord Employé</h2>

                {/* 🔗 Raccourcis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <Link to="/employe/historique-pointages" className="bg-white border border-blue-200 p-6 rounded-2xl shadow hover:shadow-md hover:bg-blue-50 transition">
                        <div className="text-xl font-semibold text-blue-700">🕒 Historique des Pointages</div>
                    </Link>
                    <Link to="/employe/historique-conges" className="bg-white border border-blue-200 p-6 rounded-2xl shadow hover:shadow-md hover:bg-blue-50 transition">
                        <div className="text-xl font-semibold text-blue-700">🏖️ Historique des Congés</div>
                    </Link>
                </div>

                {/* 📊 Résumé */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">📊 Résumé du jour</h3>

                    {loading ? (
                        <p className="text-gray-600">Chargement...</p>
                    ) : resume ? (
                        <div className="space-y-6">

                            {/* Pointages */}
                            <div className="bg-white p-6 rounded-xl shadow border">
                                <h4 className="text-lg font-semibold mb-3 text-blue-800">🕒 Mes pointages aujourd'hui</h4>
                                {resume.pointages.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-700">
                                        {resume.pointages.map((p, index) => (
                                            <li key={index}>
                                                <strong>{p.type}</strong> à {p.horodatage}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Aucun pointage enregistré aujourd'hui.</p>
                                )}
                            </div>

                            {/* Planning */}
                            <div className="bg-white p-6 rounded-xl shadow border">
                                <h4 className="text-lg font-semibold mb-3 text-blue-800">📅 Planning du jour</h4>
                                {resume.planning ? (
                                    <p className="text-gray-700">
                                        <strong>{resume.planning.heure_debut}</strong> → <strong>{resume.planning.heure_fin}</strong><br />
                                        {resume.planning.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-500">Aucun planning prévu aujourd'hui.</p>
                                )}
                            </div>

                            {/* Congé */}
                            <div className="bg-white p-6 rounded-xl shadow border">
                                <h4 className="text-lg font-semibold mb-3 text-blue-800">🏖️ Congé</h4>
                                {resume.conge ? (
                                    <p className="text-gray-700">
                                        Du <strong>{resume.conge.date_debut}</strong> au <strong>{resume.conge.date_fin}</strong><br />
                                        Statut : <span className="capitalize">{resume.conge.statut}</span>
                                    </p>
                                ) : (
                                    <p className="text-gray-500">Pas en congé aujourd'hui.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Aucune donnée disponible.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );

}

export default EmployeDashboard;
