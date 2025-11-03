import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import db from "../models/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class BookingController {
  static showBookingSuccess(req, res) {
    res.sendFile(join(__dirname, "../views/html/booking-success.html"));
  }

  static bookEvent(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    res.sendFile(join(__dirname, "../views/html/book-event.html"));
  }

  static bookAccessory(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    res.sendFile(join(__dirname, "../views/html/book-accessory.html"));
  }

  static async createBooking(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.redirect("/login");
      }

      const totalAmount = parseFloat(req.body.calculated_amount || 0);
      
      if (!totalAmount || isNaN(totalAmount)) {
        throw new Error("Invalid total amount");
      }

      const payment = await Payment.create({
        total_amount: totalAmount,
        payment_status: "PENDING",
        payment_method: "ONLINE",
        transaction_id: `TXN_${Date.now()}`,
      });

      
      const userId = req.user.id || req.user.user_id;

      const booking = await Booking.create({
        user_id: userId,
        seller_id: req.body.seller_id || 1, 
        event_id: req.body.event_id || null,
        payment_id: payment.payment_id,
        accessory_ids: req.body.accessory_id || req.body.accessory_ids || "",
        accessory_quantities: req.body.quantity || req.body.accessory_quantities || "1",
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        booking_status: "CONFIRMED",
      });

      res.redirect("/booking-success?id=" + booking.booking_id);
    } catch (err) {
      console.error("Booking error:", err);
      res.status(500).send("Error creating booking: " + err.message);
    }
  }

  static async getUserBookings(req, res) {
    try {
      const userId = req.user?.id || req.user?.user_id;
      if (!userId) {
        return res.json([]);
      }
      
      const bookings = await Booking.getByUserId(userId);
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching bookings" });
    }
  }

  static async getUserPayments(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.user?.id || req.user?.user_id;
      if (!userId) {
        return res.json([]);
      }
      
      const bookings = await Booking.getByUserId(userId);
      console.log("User bookings:", bookings);
      

      const paymentIds = bookings
        .map(b => b.payment_id)
        .filter(id => id);
      
      console.log("Payment IDs:", paymentIds);
      
      if (paymentIds.length === 0) {
        return res.json([]);
      }
      
      const result = await db.query(
        `SELECT * FROM payments WHERE payment_id = ANY($1::bigint[])`,
        [paymentIds]
      );
      
      console.log("Payment data:", result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching payments:", err);
      res.status(500).json({ error: "Error fetching payments" });
    }
  }
}

export default BookingController;

