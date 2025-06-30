class RoomController {
  constructor(roomService) {
    this.roomService = roomService;
  }

  async getAll(req, res) {
    const rooms = await this.roomService.getAllRooms();
    res.json(rooms);
  }

  async getOne(req, res) {
    const room = await this.roomService.getRoomById(parseInt(req.params.id));
    if (!room) return res.status(404).json({ error: 'Salle introuvable' });
    res.json(room);
  }

  async create(req, res) {
    const { name, capacity } = req.body;
    if (!name || !capacity) return res.status(400).json({ error: 'Champs requis manquants' });

    const room = await this.roomService.createRoom({ name, capacity });
    res.status(201).json(room);
  }

  async update(req, res) {
    const { name, capacity, isAvailable } = req.body;
    const id = parseInt(req.params.id);

    try {
      const updated = await this.roomService.updateRoom(id, { name, capacity, isAvailable });
      res.json(updated);
    } catch (err) {
      res.status(404).json({ error: 'Salle non trouvée' });
    }
  }

  async delete(req, res) {
    const id = parseInt(req.params.id);
    try {
      await this.roomService.deleteRoom(id);
      res.json({ message: 'Salle supprimée' });
    } catch {
      res.status(404).json({ error: 'Salle non trouvée' });
    }
  }
}

module.exports = RoomController;
