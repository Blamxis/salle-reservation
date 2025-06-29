const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/prismaClient');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Route test
app.get('/', async (req, res) => {
  res.json({ message: '✅ API OK' });
});

// Connexion DB + lancement serveur
async function startServer() {
  try {
    // Test rapide de connexion à la base
    await prisma.$queryRaw`SELECT 1`;

    console.log('✅ Connexion à la base de données réussie');

    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Connexion à la base de données échouée :', error.message);
    process.exit(1); // Stoppe l'app si la DB ne répond pas
  }
}

startServer();
