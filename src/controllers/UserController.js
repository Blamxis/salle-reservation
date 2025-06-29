const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async register(req, res) {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await this.userService.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe invalide' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Email ou mot de passe invalide' });

    // 🔐 Génère access & refresh token
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 💾 Sauvegarde le refresh token en DB
    await this.userService.updateUser(user.id, { refreshToken });

    res.json({
      message: 'Connexion réussie',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('[login] Erreur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async logout(req, res) {
  try {
    const userId = req.user.id;

    await this.userService.updateUser(userId, { refreshToken: null });

    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    console.error('[logout] Erreur :', err);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
}

  async getMe(req, res) {
    try {
      const user = await this.userService.getMe(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    } 
  } 

  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async deleteUser(req, res) {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ error: 'ID invalide' });

  try {
    const user = await this.userService.getMe(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await this.userService.deleteUser(userId);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('[deleteUser] Erreur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

  async updateUser(req, res) {
    try {
      const userId = parseInt(req.params.id);

    // Admin ou le proprio du compte
      if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
      }

      const updated = await this.userService.updateUser(userId, req.body);
      res.json({ message: 'Utilisateur mis à jour', user: updated });
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ error: 'Aucun token fourni' });

  try {
    // Vérifie le refreshToken
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await this.userService.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Refresh token invalide' });
    }

    // 🔄 Nouveau accessToken
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('[refreshToken] Erreur :', err);
    res.status(403).json({ error: 'Token expiré ou invalide' });
  }
}

}

module.exports = UserController;
