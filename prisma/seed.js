const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('🔁 Suppression des anciennes données...');
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Création de l\'admin...');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@salle.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    }
  });

  console.log('👥 Création des utilisateurs...');
  const user1 = await prisma.user.create({
    data: {
      name: 'Jean',
      email: 'jean@test.com',
      password: await bcrypt.hash('password123', 10),
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Emma',
      email: 'emma@test.com',
      password: await bcrypt.hash('password123', 10),
    }
  });

  console.log('🏢 Insertion des salles...');
  await prisma.room.createMany({
    data: [
      { name: 'Salle A', capacity: 20, isAvailable: true },
      { name: 'Salle B', capacity: 40, isAvailable: false },
      { name: 'Salle C', capacity: 12, isAvailable: true }
    ]
  });

  console.log('✅ Données de test insérées avec succès 🎉');
}

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
