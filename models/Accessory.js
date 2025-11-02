import db from "./db.js";

class Accessory {
  static async getAll() {
    const result = await db.query("SELECT * FROM accessories WHERE is_available = TRUE");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query("SELECT * FROM accessories WHERE accessory_id = $1", [id]);
    return result.rows[0];
  }
}

export default Accessory;

