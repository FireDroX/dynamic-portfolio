const { getPool } = require("../utils/functions");
const express = require("express");
const auth = require("../middleware/auth");
const { parseImageDataUrl } = require("../utils/images");

const router = express.Router();

// GET all projects
router.get("/", auth, async (req, res) => {
  const db = await getPool();

  try {
    const [rows] = await db.query("SELECT * FROM projects");
    res.json(
      rows.map((project) => ({
        ...project,
        image: parseImageDataUrl(project.image) ? project.image : "",
      })),
    );
  } catch (error) {
    return res.send("Erreur DB");
  }
});

module.exports = router;
