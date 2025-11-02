import db from "./db.js";

class Booking {
  static async create(data) {
    const result = await db.query(
      `INSERT INTO bookings (user_id, seller_id, event_id, payment_id, accessory_ids, 
       accessory_quantities, start_date, end_date, booking_status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        data.user_id,
        data.seller_id,
        data.event_id,
        data.payment_id,
        data.accessory_ids,
        data.accessory_quantities,
        data.start_date,
        data.end_date,
        data.booking_status || "PENDING",
        new Date().toISOString(),
      ]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT * FROM bookings ORDER BY booking_id DESC");
    return result.rows;
  }

  static async getByUserId(userId) {
    const result = await db.query(
      "SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_id DESC",
      [userId]
    );
    return result.rows;
  }
}

export default Booking;
