const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { originalName, name, description } = req.body;

  if (!originalName || !name || !description) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  db.get(
    "SELECT * FROM projects WHERE name = ?",
    [originalName],
    (err, row) => {
      if (!row) {
        return res.status(404).json({ error: "Projet introuvable" });
      }

      db.run(
        "UPDATE projects SET name = ?, description = ? WHERE name = ?",
        [name, description, originalName],
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur DB" });
          }

          res.json({ success: true });
        },
      );
    },
  );
});

module.exports = router;
