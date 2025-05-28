import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';

function Pointer() {
    const user = JSON.parse(localStorage.getItem('user'));
    const utilisateurId = user?.id;

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pointages, setPointages] = useState([]);
    const [dateFiltre, setDateFiltre] = useState(new Date().toISOString().slice(0, 10)); // Date du jour (format YYYY-MM-DD)
    const navigate = useNavigate();
    const handlePointer = async (type) => {
        setMessage('');
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/pointages', {
                utilisateur_id: utilisateurId,
                type: type
            });
            console.log('Nouveau pointage ajouté :', res.data);
            setMessage(res.data.message);
            fetchPointages(); // Mettre à jour la liste après pointage
        } catch (err) {
            setError('Erreur lors du pointage.');
            console.error('Erreur :', err);
        }
    };

    const fetchPointages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pointages');
            console.log('Tous les pointages reçus :', res.data);

            const filtres = res.data.filter(p =>
                p.utilisateur_id === utilisateurId &&
                p.horodatage.startsWith(dateFiltre)
            );

            console.log('Pointages filtrés :', filtres);
            setPointages(filtres);
        } catch (err) {
            console.error('Erreur de récupération des pointages :', err);
        }
    };


    useEffect(() => {
        fetchPointages();
    }, [dateFiltre]);
    const handleRetour = () => {
        navigate('/employe');
    };



    return (
        <DashboardLayout>
            <div style={{ padding: 20 }}>
                <h2>Pointeuse</h2>
                <button onClick={handleRetour} style={{ marginBottom: 20 }}>
                    ← Retour
                </button>

                <label>Date : </label>
                <input
                    type="date"
                    value={dateFiltre}
                    onChange={(e) => setDateFiltre(e.target.value)}
                    style={{ marginBottom: 20 }}
                />

                <a
                    href={`http://localhost:5000/api/pointages/export/pdf?utilisateur_id=${utilisateurId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button>Télécharger PDF</button>
                </a>


                <div>
                    <button onClick={() => handlePointer('entrée')} style={{ marginRight: 10 }}>
                        Entrée
                    </button>
                    <button onClick={() => handlePointer('sortie')}>
                        Sortie
                    </button>
                    <button onClick={fetchPointages} style={{ marginLeft: 10 }}>
                        Actualiser
                    </button>

                </div>

                {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
                {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

                <h3 style={{ marginTop: 30 }}>Mes pointages du {dateFiltre} :</h3>
                <table border="1" cellPadding="8" style={{ marginTop: 10, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Horodatage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointages.length > 0 ? (
                            pointages.map(p => (
                                <tr key={p.id}>
                                    <td>{p.type}</td>
                                    <td>{new Date(p.horodatage).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Aucun pointage trouvé pour cette date.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default Pointer;
