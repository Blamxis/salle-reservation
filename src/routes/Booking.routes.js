const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Instanciation du service et du contrôleur
const BookingService = require('../services/BookingService');
const bookingService = new BookingService(); // ✅ instanciation correcte
const BookingController = new (require('../controllers/BookingController'))(bookingService);

// Réserver une salle
router.post('/', auth, (req, res) => BookingController.create(req, res));

// Récupérer les réservations pour une salle spécifique
router.get('/room/:roomId', auth, (req, res) => BookingController.getByRoom(req, res));

// Récupérer les réservations de l'utilisateur connecté
router.get('/', auth, (req, res) => BookingController.getUserBookings(req, res));

// Récupérer toutes les réservations (admin uniquement)
router.get('/all', auth, isAdmin, (req, res) => BookingController.getAll(req, res));

// Supprimer une réservation (admin ou propriétaire uniquement)
router.delete('/:id', auth, (req, res) => BookingController.delete(req, res));

module.exports = router;
