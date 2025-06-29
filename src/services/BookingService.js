const prisma = require('../config/prismaClient');

console.log('[DEBUG] Prisma models:', Object.keys(prisma));

class BookingService {
  async createBooking({ roomId, startDate, endDate, userId }) {
    // Vérif si la salle existe
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new Error("Salle introuvable");

    // Vérif si elle est disponible pour les dates
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    });

    if (conflict) throw new Error("Salle déjà réservée sur cette période");

    // Création
    return await prisma.booking.create({
      data: {
        roomId,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });
  }

  async getByRoom(roomId) {
  return await prisma.booking.findMany({
    where: { roomId: Number(roomId) },
    select: {
      id: true,
      startDate: true,
      endDate: true
    },
    orderBy: { startDate: 'asc' }
  });
}

async getByUser(userId) {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      room: true
    }
  });
}

async getAll() {
  return await prisma.booking.findMany({
    include: {
      user: true,
      room: true
    }
  });
}

async deleteBooking(id, user) {
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });

  if (!booking) throw new Error("Réservation introuvable");

  // Autorisé si admin ou proprio
  if (user.role !== 'admin' && booking.userId !== user.id) {
    throw new Error("Accès refusé");
  }

  return await prisma.booking.delete({ where: { id: Number(id) } });
}

}

module.exports = BookingService;
