// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: motDePasse }) // Assure-toi que le backend attend bien "password"
            });

            const data = await response.json();

            if (!response.ok) {
                setErreur(data.message || 'Erreur de connexion');
                return;
            }

            // ✅ Stockage des infos utilisateur dans localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirection en fonction du rôle
            const role = data.user.role;
            if (role === 'admin' || role === 'manager' || role === 'employe') {
                navigate(`/${role}`);
            } else {
                setErreur('Rôle utilisateur inconnu');
            }

        } catch (err) {
            console.error('❌ Erreur réseau :', err);
            setErreur('Erreur réseau ou serveur.');
        }
    };


    return (
        <div>
            <h2>Connexion</h2>
            {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} placeholder="Mot de passe" required />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}

export default Login;


