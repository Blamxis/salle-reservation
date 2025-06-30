class BookingController {
  constructor(service) {
    this.service = service;
  }

  async create(req, res) {
    try {
      const { roomId, startDate, endDate } = req.body;
      const userId = req.user.id;

      const booking = await this.service.createBooking({ roomId, startDate, endDate, userId });

      res.status(201).json(booking);
    } catch (err) {
      console.error('[create booking]', err);
      res.status(400).json({ error: err.message });
    }
  }

  async getByRoom(req, res) {
  try {
    const { roomId } = req.params;
    const data = await this.service.getByRoom(roomId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async getUserBookings(req, res) {
  try {
    const bookings = await this.service.getByUser(req.user.id);
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async getAll(req, res) {
  try {
    const bookings = await this.service.getAll();
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async delete(req, res) {
  try {
    const deleted = await this.service.deleteBooking(req.params.id, req.user);
    res.json({ message: 'Réservation supprimée', deleted });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

}

module.exports = BookingController;
