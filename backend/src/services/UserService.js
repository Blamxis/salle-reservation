const prisma = require('../config/prismaClient');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');

class UserService {
  async register({ name, email, password }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email déjà utilisé');

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return { message: 'Utilisateur inscrit', user: { id: user.id, name: user.name, email: user.email } };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur introuvable');

    const match = await comparePassword(password, user.password);
    if (!match) throw new Error('Mot de passe incorrect');

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { message: 'Connexion réussie', token };
  }

  async findByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

  async findById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

  async getMe(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

  async getAllUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

  async deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}

  async updateUser(id, data) {
  return await prisma.user.update({ where: { id }, data });
}

}

module.exports = new UserService();
