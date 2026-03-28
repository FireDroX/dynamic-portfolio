const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { name } = req.body;

  db.get("SELECT fileName FROM projects WHERE name = ?", [name], (err, row) => {
    if (!row) return res.status(404).json({ error: "Projet introuvable" });

    const projectPath = path.join(__dirname, "../projects", row.fileName);

    fs.rm(projectPath, { recursive: true, force: true }, () => {
      db.run("DELETE FROM projects WHERE name = ?", [name], () => {
        res.json({ success: true });
      });
    });
  });
});

module.exports = router;
