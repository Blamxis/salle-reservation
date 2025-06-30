const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères'),
];

const updateUserValidation = [
  body('name')
    .optional()
    .notEmpty().withMessage('Le nom ne peut pas être vide'),

  body('email')
    .optional()
    .isEmail().withMessage('Email invalide'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Le rôle doit être user ou admin'),
];

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const list = errors.array().map(err => ({ field: err.param, message: err.msg }));
    return res.status(400).json({ errors: list });
  }
  next();
};

module.exports = {
  registerValidation,
  updateUserValidation,
  validateUser,
};
