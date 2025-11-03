import Seller from "../models/Seller.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Event from "../models/Event.js";
import Accessory from "../models/Accessory.js";
import db from "../models/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class SellerController {
  static showRegister(req, res) {
    res.sendFile(join(__dirname, "../views/html/seller-register.html"));
  }

  static async register(req, res) {
    try {
      const { full_name, email, password, phone, business_name, business_address } = req.body;
      

      const existingSeller = await Seller.findByEmail(email);
      if (existingSeller) {
        return res.redirect("/login");
      }

      const seller = await Seller.create({
        full_name,
        email,
        password,
        phone,
        business_name,
        business_address,
      });

      console.log("Seller registered:", seller.email);

      req.login(seller, (err) => {
        if (err) {
          console.error(err);
          return res.redirect("/login");
        }
        
        return res.redirect("/seller-dashboard");
      });
    } catch (err) {
      console.error("Seller registration error:", err);
      res.redirect("/login");
    }
  }

  static showDashboard(req, res) {
    res.sendFile(join(__dirname, "../views/html/seller-dashboard.html"));
  }

  static showAddEvent(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    res.sendFile(join(__dirname, "../views/html/add-event.html"));
  }

  static showAddAccessory(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    res.sendFile(join(__dirname, "../views/html/add-accessory.html"));
  }

  static async createEvent(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const sellerId = req.user.seller_id || req.user.id;

      const {
        event_name,
        location,
        city,
        state,
        postal_code,
        description,
        capacity,
        price_per_day
      } = req.body;

      const result = await db.query(
        `INSERT INTO events (event_name, location, city, state, postal_code, description, capacity, price_per_day, is_available)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) RETURNING *`,
        [event_name, location, city, state, postal_code, description, capacity, price_per_day]
      );

      console.log("Event created by seller ID:", sellerId);
      console.log("Event data:", result.rows[0]);

      res.redirect("/seller-dashboard?success=Event added successfully!");
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).send("Error creating event: " + err.message);
    }
  }

  static async createAccessory(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

  
      const sellerId = req.user.seller_id || req.user.id;

      const {
        accessory_name,
        description,
        quantity_available,
        price_per_day
      } = req.body;

      const result = await db.query(
        `INSERT INTO accessories (accessory_name, description, quantity_available, price_per_day, is_available)
         VALUES ($1, $2, $3, $4, true) RETURNING *`,
        [accessory_name, description, quantity_available, price_per_day]
      );

      console.log("Accessory created by seller ID:", sellerId);
      console.log("Accessory data:", result.rows[0]);

      res.redirect("/seller-dashboard?success=Accessory added successfully!");
    } catch (err) {
      console.error("Error creating accessory:", err);
      res.status(500).send("Error creating accessory: " + err.message);
    }
  }
}

export default SellerController;
