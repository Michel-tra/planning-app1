import React, { useState } from 'react';
import API from '../../api/api';  // <-- Ton fichier api.js avec axios.create

function Pointage() {
    const [status, setStatus] = useState('');

    const pointer = async (type) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await API.post('/api/pointages', {
                type,
                userId: user.id
            });

            setStatus(`✅ ${response.data.message}`);
        } catch (err) {
            console.error('Erreur pointage :', err);
            setStatus('❌ Erreur lors du pointage');
        }
    };

    return (
        <div className="page-container">
            <h2>Pointage</h2>
            <button onClick={() => pointer('arrivee')}>Pointer l'arrivée</button>
            <button onClick={() => pointer('depart')}>Pointer le départ</button>
            {status && <p>{status}</p>}
        </div>
    );
}

export default Pointage;
