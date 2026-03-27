// routes/panel.js
const express = require("express");

const router = express.Router();

// Middleware pour lire les forms
router.use(express.urlencoded({ extended: true }));

// LOGIN PAGE
router.get("/", (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST">
      <input type="password" name="password" placeholder="Mot de passe"/>
      <button>Connexion</button>
    </form>
  `);
});

// LOGIN POST
router.post("/", (req, res) => {
  const { password } = req.body;

  if (password === process.env.PANEL_PASSWORD) {
    req.session.authenticated = true;
    return res.redirect("/panel");
  }

  res.send("Mot de passe incorrect");
});

module.exports = router;
