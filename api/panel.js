const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all projects
router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM projects", [], (err, projects) => {
    if (err) return res.status(500).json({ error: "Erreur DB" });

    res.json(projects);
  });
});

module.exports = router;
