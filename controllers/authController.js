import User from "../models/User.js";
import Seller from "../models/Seller.js";
import passport from "passport";
import { Strategy } from "passport-local";

class AuthController {
  static setupPassport(db) {
    passport.use(
      "local",
      new Strategy(async function verify(username, password, cb) {
        try {
          const user = await User.findByEmail(username);
          if (!user) {
            return cb(null, false);
          }
          const valid = await User.verifyPassword(password, user.password);
          if (valid) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        } catch (err) {
          return cb(err);
        }
      })
    );

    //What data to save in session after login
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    //What data to retrieve from session after login
    passport.deserializeUser((user, cb) => {
      cb(null, user);
    });
  }

  static async login(req, res, next) {
    passport.authenticate("local", function(err, user) {
      if (err || !user) {
        return res.redirect("/login");
      }
      
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        
        req.user = user;
        
        // Check if user exists in sellers table
        Seller.findByEmail(user.email)
          .then(seller => {
            if (seller) {
              return res.redirect("/seller-dashboard");
            } else {
              return res.redirect("/secrets");
            }
          })
          .catch(() => {
            return res.redirect("/secrets");
          });
      });
    })(req, res, next);
  }

  static async register(req, res) {
    try {
      const email = req.body.email || req.body.username;
      const password = req.body.password;
      const existingUser = await User.findByEmail(email);
      
      if (existingUser) {
        return res.redirect("/login");
      }

      const user = await User.create(email, password);
      req.login(user, (err) => {
        if (err) {
          console.error(err);
          return res.redirect("/login");
        }
        return res.redirect("/secrets");
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.redirect("/login");
    }
  }

  static logout(req, res) {
    req.logout(function (err) {
      if (err) {
        return res.redirect("/");
      }
      res.redirect("/");
    });
  }
}

export default AuthController;

