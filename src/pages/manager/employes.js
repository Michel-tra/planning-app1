import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import '../../styles/App.css';
import { useNavigate } from 'react-router-dom';



function Employes() {
    const [employes, setEmployes] = useState([]);
    const [form, setForm] = useState({ nom: '', poste: '', email: '', telephone: '', anciennete: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEmployes();
    }, []);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const actionRow = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        gap: '10px',
    };

    const searchInputStyle = {
        flex: 1,
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    };



    const fetchEmployes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/employes');
            setEmployes(res.data);
        } catch (error) {
            console.error('Erreur lors du chargement des employés :', error);
        }
    };
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        try {
            await axios.post('http://localhost:5000/api/employes', form);
            fetchEmployes();
            setForm({ nom: '', poste: '', email: '', telephone: '', anciennete: '' });
        } catch (error) {
            console.error('Erreur lors de l\'ajout :', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/employes/${id}`);
            fetchEmployes();
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    };

    const handleEdit = (employe) => {
        setEditingId(employe.id);
        setForm(employe);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/employes/${editingId}`, form);
            fetchEmployes();
            setForm({ nom: '', poste: '', email: '', telephone: '', anciennete: '' });
            setEditingId(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="employes-container">

                <button onClick={() => navigate(-1)} style={retourButtonStyle}>
                    ⬅ Retour
                </button>

                <h2 className="employes-title">Gestion des Employés</h2>
                <div style={topBarStyle}>
                    <button className="btn toggle" onClick={toggleForm}>
                        {showForm ? 'Masquer le formulaire' : 'Ajouter un employé'}
                    </button>
                    <input
                        type="text"
                        placeholder="🔍 Rechercher par nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyle}
                    />
                </div>



                {showForm && (
                    <div style={formContainer}>
                        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
                        <input name="poste" placeholder="Poste" value={form.poste} onChange={handleChange} />
                        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                        <input name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
                        <input name="anciennete" placeholder="Ancienneté" value={form.anciennete} onChange={handleChange} />

                        <div style={actionRow}>
                            {editingId ? (
                                <button onClick={handleUpdate}>Mettre à jour</button>
                            ) : (
                                <button onClick={handleAdd}>Ajouter</button>
                            )}
                        </div>
                    </div>

                )}

                <table className="employe-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Poste</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Ancienneté</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employes
                            .filter(emp =>
                                emp.nom.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td>
                                    <td>{emp.nom}</td>
                                    <td>{emp.poste}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.telephone}</td>
                                    <td>{emp.anciennete}</td>
                                    <td>
                                        <button onClick={() => handleEdit(emp)}>Modifier</button>
                                        <button onClick={() => handleDelete(emp.id)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>

    );
}
// Styles
const formContainer = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    maxWidth: '500px',
};


const retourButtonStyle = {
    marginBottom: '20px',
    padding: '8px 16px',
    backgroundColor: ' #3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};
const topBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px',
};




export default Employes;
