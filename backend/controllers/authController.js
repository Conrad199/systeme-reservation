const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Inscription d'un nouvel utilisateur
exports.inscription = async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;
    try {
        // Vérifier si l'utilisateur existe déjà
        const [dejaExiste] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        if (dejaExiste.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Crypter le mot de passe
        const salt = await bcrypt.genSalt(10);
        const motDePasseCrypte = await bcrypt.hash(mot_de_passe, salt);

        // Insérer dans la base de données
        await db.query(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, "client")',
            [nom, email, motDePasseCrypte]
        );

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Connexion d'un utilisateur
exports.connexion = async (req, res) => {
    const { email, mot_de_passe } = req.body;
    try {
        // Rechercher l'utilisateur
        const [utilisateurs] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        if (utilisateurs.length === 0) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        const utilisateur = utilisateurs[0];

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        if (!motDePasseValide) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }

        // Générer le token JWT sécurisé
        const token = jwt.sign(
            { id: utilisateur.id, role: utilisateur.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Connexion réussie !",
            token,
            utilisateur: { id: utilisateur.id, nom: utilisateur.nom, role: utilisateur.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};