import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DemandesConge = () => {
    const [demandes, setDemandes] = useState([]);
    const [form, setForm] = useState({ date_debut: '', date_fin: '', motif: '' });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/conges/employe/${user.id}`);
            setDemandes(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des demandes', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/conges', {
                utilisateur_id: user.id,
                ...form
            });
            setForm({ date_debut: '', date_fin: '', motif: '' });
            fetchDemandes(); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la demande', error);
        }
    };

    return (
        <div className="container">
            <h2>Mes demandes de congé</h2>

            <form onSubmit={handleSubmit} className="conge-form">
                <label>Date début :
                    <input type="date" name="date_debut" value={form.date_debut} onChange={handleChange} required />
                </label>
                <label>Date fin :
                    <input type="date" name="date_fin" value={form.date_fin} onChange={handleChange} required />
                </label>
                <label>Motif :
                    <input type="text" name="motif" value={form.motif} onChange={handleChange} required />
                </label>
                <button type="submit">Envoyer la demande</button>
            </form>

            <table className="conges-table">
                <thead>
                    <tr>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Motif</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {demandes.map((demande) => (
                        <tr key={demande.id}>
                            <td>{demande.date_debut}</td>
                            <td>{demande.date_fin}</td>
                            <td>{demande.motif}</td>
                            <td style={{ color: demande.statut === 'validé' ? 'green' : demande.statut === 'refusé' ? 'red' : 'orange' }}>
                                {demande.statut}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DemandesConge;
