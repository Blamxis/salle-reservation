const prisma = require('../config/prismaClient');

class RoomService {
  async getAllRooms() {
    return await prisma.room.findMany();
  }

  async getRoomById(id) {
    return await prisma.room.findUnique({ where: { id } });
  }

  async createRoom(data) {
    return await prisma.room.create({ data });
  }

  async updateRoom(id, data) {
    return await prisma.room.update({
      where: { id },
      data,
    });
  }

  async deleteRoom(id) {
    return await prisma.room.delete({ where: { id } });
  }
}

module.exports = new RoomService();
