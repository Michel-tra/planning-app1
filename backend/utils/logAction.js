exports.enregistrerActivite = async (db, utilisateur_id, action) => {
    try {
        await db.execute(
            "INSERT INTO journal_activite (utilisateur_id, action) VALUES (?, ?)",
            [utilisateur_id, action]
        );
    } catch (err) {
        console.error('Erreur enregistrement activité :', err);
    }
};
