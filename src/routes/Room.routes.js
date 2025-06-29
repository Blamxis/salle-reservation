const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const {
  roomValidationRules,
  validateRoom
} = require('../middlewares/roomValidator');

const RoomService = require('../services/RoomService');
const RoomController = new (require('../controllers/RoomController'))(RoomService);

// Routes publiques
router.get('/', (req, res) => RoomController.getAll(req, res));
router.get('/:id', (req, res) => RoomController.getOne(req, res));

// Admin only
router.post(
  '/',
  auth,
  isAdmin,
  roomValidationRules,
  validateRoom,
  (req, res) => RoomController.create(req, res)
);

router.put(
  '/:id',
  auth,
  isAdmin,
  roomValidationRules,
  validateRoom,
  (req, res) => RoomController.update(req, res)
);

router.delete('/:id', auth, isAdmin, (req, res) => RoomController.delete(req, res));

module.exports = router;
