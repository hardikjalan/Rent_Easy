import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Event from "../models/Event.js";
import Accessory from "../models/Accessory.js";
import Booking from "../models/Booking.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class HomeController {
  static home(req, res) {
    res.sendFile(join(__dirname, "../views/html/home.html"));
  }

  static login(req, res) {
    res.sendFile(join(__dirname, "../views/html/login.html"));
  }

  static register(req, res) {
    res.sendFile(join(__dirname, "../views/html/register.html"));
  }

  static secrets(req, res) {
    res.sendFile(join(__dirname, "../views/html/secrets.html"));
  }

  static async events(req, res) {
    const events = await Event.getAll();
    res.json(events);
  }

  static async accessories(req, res) {
    const accessories = await Accessory.getAll();
    res.json(accessories);
  }

  static eventsPage(req, res) {
    res.sendFile(join(__dirname, "../views/html/events.html"));
  }

  static accessoriesPage(req, res) {
    res.sendFile(join(__dirname, "../views/html/accessories.html"));
  }

  static async getEventById(req, res) {
    const eventId = req.params.id;
    const event = await Event.getById(eventId);
    res.json(event);
  }

  static async getAccessoryById(req, res) {
    const accessoryId = req.params.id;
    const accessory = await Accessory.getById(accessoryId);
    res.json(accessory);
  }
}

export default HomeController;
