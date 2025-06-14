import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

function PointagesHistorique() {
    const [pointages, setPointages] = useState([]);
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    const fetchPointages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pointages/filtre', {
                params: date ? { date } : {}
            });
            setPointages(res.data);
        } catch (err) {
            console.error('Erreur chargement des pointages :', err);
        }
    };

    useEffect(() => {
        fetchPointages();
    }, [date]);



    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text('Historique des pointages', 10, 10);
        doc.autoTable({
            head: [['Nom', 'Date', 'Heure', 'Type']],
            body: pointages.map(p => [
                p.nom_utilisateur || p.utilisateur || p.utilisateur_id,
                new Date(p.horodatage).toLocaleDateString(),
                new Date(p.horodatage).toLocaleTimeString(),

                p.type
            ]),
            startY: 20
        });
        doc.save('historique_pointages.pdf');
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(pointages.map(p => ({
            Nom: p.nom_utilisateur || p.utilisateur || p.utilisateur_id,

            Type: p.type,
            "Date & Heure": new Date(p.horodatage).toLocaleString()
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pointages");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, "historique_pointages.xlsx");
    };


    return (
        <div style={styles.container}>
            <h2>Historique des pointages</h2>
            {/* BOUTON RETOUR */}
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
                ← Retour
            </button>
            <div style={styles.actions}>
                <div>
                    <label>Filtrer par date : </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={styles.dateInput}
                    />
                </div>
                <div>
                    <button onClick={exportPDF} style={styles.exportButton}>Exporter PDF</button>
                    <button onClick={exportExcel} style={styles.exportButton}>Exporter Excel</button>
                </div>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Date & Heure</th>
                    </tr>
                </thead>
                <tbody>
                    {pointages.length > 0 ? pointages.map(p => (
                        <tr key={p.id}>
                            <td>{p.nom_utilisateur || p.utilisateur}</td>
                            <td>{p.type}</td>
                            <td>{new Date(p.horodatage).toLocaleString()}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>Aucun pointage trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        background: '#f8f9fa',
        minHeight: '100vh'
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    dateInput: {
        padding: '0.4rem',
        fontSize: '1rem'
    },
    exportButton: {
        marginLeft: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }
};

export default PointagesHistorique;
