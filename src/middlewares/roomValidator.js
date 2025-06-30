const { body, validationResult } = require('express-validator');

const roomValidationRules = [
  body('name')
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit faire au moins 2 caractères'),

  body('capacity')
    .isInt({ min: 1 }).withMessage('La capacité doit être un entier supérieur à 0'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable doit être un booléen'),
];

// Middleware pour gérer les erreurs
const validateRoom = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const list = errors.array().map(err => ({ field: err.param, message: err.msg }));
    return res.status(400).json({ errors: list });
  }
  next();
};

module.exports = {
  roomValidationRules,
  validateRoom,
};
