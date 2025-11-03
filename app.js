import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

import db from "./models/db.js";

import AuthController from "./controllers/authController.js";
import HomeController from "./controllers/homeController.js";
import BookingController from "./controllers/bookingController.js";
import SellerController from "./controllers/sellerController.js";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

AuthController.setupPassport(db);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

app.get("/", HomeController.home);
app.get("/login", HomeController.login);
app.get("/register", HomeController.register);
app.get("/logout", AuthController.logout);

app.get("/seller-register", SellerController.showRegister);
app.post("/seller-register", SellerController.register);
app.get("/seller-dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    SellerController.showDashboard(req, res);
  } else {
    res.redirect("/login");
  }
});

app.get("/add-event", (req, res) => {
  if (req.isAuthenticated()) {
    SellerController.showAddEvent(req, res);
  } else {
    res.redirect("/login");
  }
});
app.post("/api/events/create", (req, res) => {
  if (req.isAuthenticated()) {
    SellerController.createEvent(req, res);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/add-accessory", (req, res) => {
  if (req.isAuthenticated()) {
    SellerController.showAddAccessory(req, res);
  } else {
    res.redirect("/login");
  }
});
app.post("/api/accessories/create", (req, res) => {
  if (req.isAuthenticated()) {
    SellerController.createAccessory(req, res);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    HomeController.secrets(req, res);
  } else {
    res.redirect("/login");
  }
});

app.get("/events", HomeController.eventsPage);
app.get("/accessories", HomeController.accessoriesPage);


app.get("/api/events", HomeController.events);
app.get("/api/events/:id", HomeController.getEventById);
app.get("/api/accessories", HomeController.accessories);
app.get("/api/accessories/:id", HomeController.getAccessoryById);

app.get("/book-event", BookingController.bookEvent);
app.get("/book-accessory", BookingController.bookAccessory);
app.get("/booking-success", BookingController.showBookingSuccess);
app.post("/api/bookings/create", BookingController.createBooking);
app.get("/api/bookings", BookingController.getUserBookings);
app.get("/api/bookings/payments", BookingController.getUserPayments);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);

app.post("/login", AuthController.login);
app.post("/register", AuthController.register);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

