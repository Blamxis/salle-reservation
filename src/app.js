const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/prismaClient');
const userRoutes = require('./routes/User.routes');
const roomRoutes = require('./routes/Room.routes');
const bookingRoutes = require('./routes/Booking.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import des routes
app.use('/api/users', userRoutes); // routes auth (register, login etc..)
app.use('/api/rooms', roomRoutes); // routes pour les salles
app.use('/api/bookings', bookingRoutes); // routes pour les réservations

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

    app.listen(process.env.PORT || 4000, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${process.env.PORT || 4000}`);
    });
  } catch (error) {
    console.error('❌ Connexion à la base de données échouée :', error.message);
    process.exit(1); // Stoppe l'app si la DB ne répond pas
  }
}

startServer();
