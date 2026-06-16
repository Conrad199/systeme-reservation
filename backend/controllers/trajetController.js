const db = require('../config/db');

// 1. Récupérer tous les trajets (Barre de recherche Client ou Dashboard Admin)
exports.obtenirTrajets = async (req, res) => {
    const { depart, arrivee, date } = query = req.query;
    try {
        let requete = 'SELECT * FROM trajets WHERE 1=1';
        let parametres = [];

        if (depart) { requete += ' AND ville_depart = ?'; parametres.push(depart); }
        if (arrivee) { requete += ' AND ville_arrivee = ?'; parametres.push(arrivee); }
        if (date) { requete += ' AND date_depart = ?'; parametres.push(date); }

        const [trajets] = await db.query(requete, parametres);
        res.json(trajets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Créer un nouveau trajet (Réservé à l'Admin)
exports.creerTrajet = async (req, res) => {
    const { ville_depart, ville_arrivee, date_depart, heure_depart, prix } = req.body;
    try {
        await db.query(
            'INSERT INTO trajets (ville_depart, ville_arrivee, date_depart, heure_depart, prix) VALUES (?, ?, ?, ?, ?)',
            [ville_depart, ville_arrivee, date_depart, heure_depart, prix]
        );
        res.status(201).json({ message: "Trajet ajouté avec succès !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Obtenir l'état des 22 sièges pour un trajet donné
exports.obtenirSiegesOccupes = async (req, res) => {
    const { id } = req.params;
    try {
        // Sélectionne les numéros de sièges réservés pour ce trajet spécifique
        const [sieges] = await db.query(
            `SELECT sr.numero_siege FROM sieges_reserves sr
             JOIN reservations r ON sr.reservation_id = r.id
             WHERE r.trajet_id = ? AND r.statut != 'annule'`, 
            [id]
        );
        
        // Transforme le résultat en un tableau simple de numéros (ex: [1, 4, 12])
        const listeNumeros = sieges.map(s => s.numero_siege);
        res.json({ trajet_id: id, sieges_occupes: listeNumeros });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};