const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bookingsCtrl = {
  // Get the bookings list from the database
  async getBookingsList(req, res) {
    try {
      const list = await prisma.treks.findMany();
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Add a booking to a trek
  async addBooking(req, res) {
    const { trekID } = req.body;
    try {
      // Find if the trek exists, and if it exists, add a new booking
      const newBooking = await prisma.book.create({
        data: {
          user_id: req.user.user_id,
          trek_id: parseInt(trekID, 10),
          booking_date: new Date(),
          state: "En attente de paiement"
        }
      });

      return res.status(200).json({ message: "Réservation ajoutée" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get a bookings list for a guide, using its id
  async getBookingsForUser(req, res) {
    const { id } = req.params;
    try {
      const bookings = await prisma.book.findMany({
        where: { user_id: parseInt(id, 10) },
        include: {
          treks: true
        }
      });

      if (!bookings.length) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      return res.json(bookings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Get bookings for a user
  async getMyBookings(req, res) {
    const userID = req.user.user_id;
    try {
      const bookings = await prisma.book.findMany({
        where: {
          user_id: userID
        },
        include: {
          treks: true
        }
      });

      if (!bookings.length) {
        return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
      }

      return res.json(bookings);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  }
};

module.exports = bookingsCtrl;
