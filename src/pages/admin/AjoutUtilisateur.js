import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';


function AjoutUtilisateur() {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [role, setRole] = useState('employe');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('➡️ Formulaire soumis');

        const newUser = { nom, email, mot_de_passe: motDePasse, role };

        try {
            const response = await fetch('http://localhost:5000/api/utilisateurs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('Utilisateur ajouté avec succès');
                navigate('/admin/utilisateurs');
            } else {
                const errData = await response.json();
                alert('Erreur : ' + errData.message);
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
            alert('Une erreur réseau est survenue');
        }
    };

    return (
        <DashboardLayout>
            <div className="page-container">
                <h2>Ajouter un nouvel utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom :</label>
                        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
                    </div>
                    <div>
                        <label>Email :</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Mot de passe :</label>
                        <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
                    </div>
                    <div>
                        <label>Rôle :</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employe">Employé</option>
                        </select>
                    </div>
                    <button type="submit">Ajouter</button>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default AjoutUtilisateur;
