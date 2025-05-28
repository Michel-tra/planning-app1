import React from 'react';

const Unauthorized = () => {
    return (
        <div style={{ padding: '20px', color: 'red' }}>
            <h2>⛔ Accès non autorisé</h2>
            <p>Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
    );
};

export default Unauthorized;
