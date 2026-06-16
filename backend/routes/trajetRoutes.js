const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajetController');

// Routes publiques (Client)
router.get('/', trajetController.obtenirTrajets);
router.get('/:id/sieges', trajetController.obtenirSiegesOccupes);

// Route administrative (Dashboard)
router.post('/', trajetController.creerTrajet);

module.exports = router;