import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import '../../styles/App.css';
import { useNavigate } from 'react-router-dom';

const formatDate = (isoDate) => {
    return isoDate.split('T')[0]; // extrait uniquement "2025-05-14"
};


function Plannings() {
    const [plannings, setPlannings] = useState([]);
    const [form, setForm] = useState({ utilisateur_id: '', date: '', heure_debut: '', heure_fin: '' });

    const navigate = useNavigate();
    useEffect(() => {
        fetchPlannings();
    }, []);

    const fetchPlannings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/plannings');
            setPlannings(res.data);
        } catch (error) {
            console.error('Erreur lors du chargement des plannings:', error);
        }
    };


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:5000/api/plannings', form);
            fetchPlannings();
            setForm({ utilisateur_id: '', date: '', heure_debut: '', heure_fin: '' });
        } catch (error) {
            console.error('Erreur ajout planning:', error);
        }
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`http://localhost:5000/api/plannings/${id}`);
            fetchPlannings();
        } catch (error) {
            console.error('Erreur suppression planning:', error);
        }
    };

    const handleUpdate = async (id) => {
        try {
            console.log("Formulaire à envoyer :", form);
            await axios.put(`http://localhost:5000/api/plannings/${id}`, form);
            fetchPlannings();
        } catch (error) {
            console.error('Erreur mise à jour planning:', error);
        }
    };



    return (
        <DashboardLayout>
            <div className="planning-container">
                <h2>Gestion des Plannings</h2>
                <button className="return-button" onClick={() => navigate('/manager')}>← Retour</button>

                <div className="form-section">
                    <input name="utilisateur_id" placeholder="ID utilisateur" value={form.utilisateur_id} onChange={handleChange} />
                    <input type="date" name="date" value={formatDate(form.date)} onChange={handleChange} />
                    <input name="heure_debut" type="time" value={form.heure_debut} onChange={handleChange} />
                    <input name="heure_fin" type="time" value={form.heure_fin} onChange={handleChange} />
                    <button onClick={handleAdd}>Ajouter</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Utilisateur</th>
                            <th>Date</th>
                            <th>Début</th>
                            <th>Fin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plannings.map(planning => (
                            <tr key={planning.id}>
                                <td>{planning.id}</td>
                                <td>{planning.utilisateur_id}</td>
                                <td>{planning.date}</td>
                                <td>{planning.heure_debut}</td>
                                <td>{planning.heure_fin}</td>
                                <td>
                                    <button onClick={() => setForm(planning)}>Modifier</button>
                                    <button onClick={() => handleDelete(planning.id)}>Supprimer</button>
                                    <button onClick={() => handleUpdate(planning.id)}>Mettre à jour</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Plannings;
