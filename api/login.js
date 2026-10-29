const crypto = require("node:crypto");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const router = express.Router();

// Brute-force guard: only failed attempts count, per client IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez plus tard." },
});

// Hashing first gives both sides the same length, as timingSafeEqual requires.
const digest = (value) => crypto.createHash("sha256").update(value).digest();

const isPanelPassword = (password) => {
  const expected = process.env.PANEL_PASSWORD;
  if (!expected || typeof password !== "string") return false;

  return crypto.timingSafeEqual(digest(password), digest(expected));
};

// LOGIN
router.post("/", loginLimiter, (req, res, next) => {
  if (!isPanelPassword(req.body?.password)) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  // New session id on login, so an id set before authentication is never promoted.
  req.session.regenerate((error) => {
    if (error) return next(error);

    req.session.authenticated = true;
    res.json({ success: true });
  });
});

// LOGOUT (bonus)
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// CHECK AUTH
router.get("/me", (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

module.exports = router;
