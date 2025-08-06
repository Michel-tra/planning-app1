import React, { useEffect, useState } from 'react';

function PlanningGlobal() {
    const [plannings, setPlannings] = useState([]);

    useEffect(() => {
        fetch('/api/plannings')
            .then(res => res.json())
            .then(data => setPlannings(data))
            .catch(err => console.error('Erreur chargement planning global', err));
    }, []);

    return (

        <div className="page-container">
            <h2>Planning Global</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employé</th>
                        <th>Date</th>
                        <th>Heure début</th>
                        <th>Heure fin</th>
                    </tr>
                </thead>
                <tbody>
                    {plannings.map(plan => (
                        <tr key={plan.id}>
                            <td>{plan.nom_employe}</td>
                            <td>{plan.date}</td>
                            <td>{plan.heure_debut}</td>
                            <td>{plan.heure_fin}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default PlanningGlobal;
