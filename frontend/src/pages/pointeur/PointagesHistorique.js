import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';

function PointagesHistorique() {
    const [pointages, setPointages] = useState([]);
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
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
        <div className="historique-container">
            <h2 className="historique-title">🕒 Historique des Pointages</h2>

            <button className="btn-retour" onClick={() => navigate(-1)}>← Retour</button>

            <div className="historique-actions">
                <div className="filtre-section">
                    <label>Filtrer par date :</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="date-input"
                    />
                </div>
                <div>
                    <button onClick={exportPDF} className="btn-export">📄 Exporter PDF</button>
                    <button onClick={exportExcel} className="btn-export">📊 Exporter Excel</button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="historique-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Date & Heure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pointages.length > 0 ? (
                            pointages.map(p => (
                                <tr key={p.id}>
                                    <td>{p.nom_utilisateur || p.utilisateur}</td>
                                    <td>{p.type}</td>
                                    <td>{new Date(p.horodatage).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="no-data">Aucun pointage trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PointagesHistorique;
