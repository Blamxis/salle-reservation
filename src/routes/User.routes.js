const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const UserController = new (require('../controllers/UserController'))(UserService);
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Auth routes
router.post('/register', (req, res) => UserController.register(req, res));
router.post('/login', (req, res) => UserController.login(req, res));
router.post('/logout', authMiddleware, (req, res) => UserController.logout(req, res));

// Protected route (any logged user)
router.get('/me', authMiddleware, (req, res) => UserController.getMe(req, res));

// Admin-only
router.get('/', authMiddleware, isAdmin, (req, res) => UserController.getAllUsers(req, res));
router.delete('/:id', authMiddleware, isAdmin, (req, res) => UserController.deleteUser(req, res));

// Admin or self
router.put('/:id', authMiddleware, (req, res) => UserController.updateUser(req, res));

// Test secured
router.get('/secure', authMiddleware, (req, res) => {
  res.json({ message: 'Route sécurisée ✅', user: req.user });
});

router.post('/refresh', (req, res) => UserController.refreshToken(req, res));

module.exports = router;
