import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';



function Login() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();
    const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: motDePasse })
            });

            const data = await response.json();
            console.log("Réponse login :", data);

            if (!response.ok) {
                setErreur(data.message || 'Erreur de connexion');
                setIsLoading(false);
                return;
            }

            const utilisateur = data.utilisateur || data.user || data;

            // Stockage des infos utilisateur
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('utilisateurId', data.user.id);
            localStorage.setItem('utilisateurNom', data.user.nom);
            localStorage.setItem('utilisateur', JSON.stringify({
                id: data.user.id,
                nom: data.user.nom,
                prenom: data.user.prenom,
                role: data.user.role
            }));

            const role = utilisateur.role;
            if (['admin', 'manager', 'employe', 'pointeur'].includes(role)) {
                navigate(`/${role}`);
            } else {
                setErreur('Rôle utilisateur inconnu');
            }

        } catch (err) {
            console.error('❌ Erreur réseau :', err);
            setErreur('Erreur réseau ou serveur.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <img src="/logoplanning.png" alt="Logo" style={styles.logo} />
                <h2 style={styles.title}>Connexion</h2>

                {erreur && (
                    <div style={styles.erreur}>
                        {erreur}
                    </div>
                )}

                <div style={styles.inputGroup}>
                    <FaEnvelope style={styles.icon} />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <FaLock style={styles.icon} />
                    <input
                        type={afficherMotDePasse ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <label style={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={afficherMotDePasse}
                        onChange={() => setAfficherMotDePasse(!afficherMotDePasse)}
                    />
                    <span style={{ marginLeft: 8 }}>Afficher le mot de passe</span>
                </label>

                <button type="submit" disabled={isLoading} style={styles.button}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f0f8ff',
        height: '100vh',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        width: '320px',
        gap: '1rem',
    },
    logo: {
        width: '500px',
        height: '100px',
        objectFit: 'contain',
        alignSelf: 'center',
        marginBottom: '10px',
        marginTop: '-30px',
        marginLeft: '50px',
        marginRight: '50px',
        borderRadius: '8px',
    },
    title: {
        textAlign: 'center',
        color: '#0077b6',
        marginBottom: '0.5rem',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        padding: '0.6rem 0.8rem',
        borderRadius: '8px',
    },
    icon: {
        marginRight: '10px',
        color: '#0077b6',
    },
    input: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        flex: 1,
        fontSize: '1rem',
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.9rem',
        color: '#333',
    },
    button: {
        backgroundColor: '#0077b6',
        color: 'white',
        padding: '0.7rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease',
    },
    erreur: {
        backgroundColor: '#ffe0e0',
        color: '#b00000',
        padding: '10px',
        border: '1px solid #ff4d4d',
        borderRadius: '8px',
        marginBottom: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
};

export default Login;
