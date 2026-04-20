const { getPool } = require("../utils/functions");
const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  const db = await getPool();

  try {
    const results = await db.query`SELECT * FROM projects`;
    res.send(results.recordset);
  } catch (error) {
    return res.send("Erreur DB");
  }
});

module.exports = router;
