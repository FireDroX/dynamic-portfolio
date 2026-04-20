const { getPool } = require("../utils/functions");
const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { originalName, name, description } = req.body;

  if (!originalName || !name || !description) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    const pool = await getPool();
    await pool.query`SELECT * FROM projects WHERE name = ${originalName}`;
    await pool.query`UPDATE projects SET name = ${name}, description = ${description} WHERE name = ${originalName}`;
    res.json({ success: true });
  } catch (error) {
    return res.status(404).json({ error: "Projet introuvable" });
  }
});

module.exports = router;
