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
                body: JSON.stringify({ email, password: motDePasse })
            });

            const data = await response.json();

            if (!response.ok) {
                setErreur(data.message || 'Erreur de connexion');
                return;
            }

            // Stockage des infos utilisateur
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('utilisateurId', data.user.id); // ✅ AJOUT ICI
            localStorage.setItem('utilisateurNom', data.user.nom); // (optionnel mais utile)

            // Redirection selon le rôle
            const role = data.user.role;
            if (role === 'admin' || role === 'manager' || role === 'employe' || role === 'pointeur') {
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
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                width: '300px',
                textAlign: 'center',
            }}>
                <h2 style={{ marginBottom: '20px' }}>Connexion</h2>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        value={motDePasse}
                        onChange={e => setMotDePasse(e.target.value)}
                        placeholder="Mot de passe"
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Se connecter</button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default Login;
