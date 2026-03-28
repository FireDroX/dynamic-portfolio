const express = require("express");
const router = express.Router();

// LOGIN
router.post("/", (req, res) => {
  const { password } = req.body;

  if (password === process.env.PANEL_PASSWORD) {
    req.session.authenticated = true;
    return res.json({ success: true });
  }

  res.status(401).json({ error: "Mot de passe incorrect" });
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
