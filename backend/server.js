const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Route principale de test
app.get('/', (req, res) => {
    res.send('Le serveur du système de réservation fonctionne parfaitement !');
});

// Route de test pour la base de données
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ message: "Connexion à phpMyAdmin réussie !", data: rows });
    } catch (error) {
        res.status(500).json({ error: "Échec de connexion à la base de données", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Importation et utilisation des routes d'authentification
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Importation et utilisation des routes de trajets
const trajetRoutes = require('./routes/trajetRoutes');
app.use('/api/trajets', trajetRoutes);