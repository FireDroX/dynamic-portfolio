const { getPool } = require("../utils/functions");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { name } = req.body;

  try {
    const pool = await getPool();
    const results =
      await pool.query`SELECT fileName FROM projects WHERE name = ${name}`;

    const projectPath = path.join(
      __dirname,
      "../projects",
      results.recordset[0].fileName,
    );
    fs.rm(projectPath, { recursive: true, force: true }, async () => {
      await pool.query`DELETE FROM projects WHERE name = ${name}`;
      res.json({ success: true });
    });
  } catch (error) {
    return res.status(404).json({ error: "Projet introuvable" });
  }
});

module.exports = router;
