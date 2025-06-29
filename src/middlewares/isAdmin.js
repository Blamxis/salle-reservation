const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    next();
  } catch (error) {
    console.error('[isAdmin] Erreur middleware :', error);
    return res.status(500).json({ error: 'Erreur interne' });
  }
};

module.exports = isAdmin;
