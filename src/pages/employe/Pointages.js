import React, { useState } from 'react';


function Pointage() {
    const [status, setStatus] = useState('');

    const pointer = (type) => {
        fetch('/api/pointages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, userId: JSON.parse(localStorage.getItem('user')).id })
        })
            .then(res => res.json())
            .then(data => setStatus(`✅ ${data.message}`))
            .catch(err => {
                console.error('Erreur pointage :', err);
                setStatus('❌ Erreur lors du pointage');
            });
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
