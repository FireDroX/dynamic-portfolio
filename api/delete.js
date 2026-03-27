const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { name } = req.body;

  db.get("SELECT fileName FROM projects WHERE name = ?", [name], (err, row) => {
    if (err || !row) {
      return res.send("Projet introuvable");
    }

    const filePath = path.join(
      __dirname,
      "../projects",
      `${row.fileName}.html`,
    );

    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });

    db.run("DELETE FROM projects WHERE name = ?", [name], () => {
      res.redirect("/panel");
    });
  });
});

module.exports = router;
