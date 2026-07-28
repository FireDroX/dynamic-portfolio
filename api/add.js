const express = require("express");
const auth = require("../middleware/auth");
const { getPool } = require("../utils/functions");
const { parseProjectUpload } = require("../services/projectUpload");
const {
  getProjectSlug,
  installProjectArchive,
} = require("../services/projectArchive");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  let archiveTransaction = null;

  try {
    const { fields, image, zip } = await parseProjectUpload(req);
    const name = fields.name?.trim();
    const description = fields.description?.trim();

    if (!name || !description || !zip) {
      return res.status(400).json({ error: "Champs manquants." });
    }

    const projectSlug = getProjectSlug(zip.fileName);
    archiveTransaction = await installProjectArchive(zip.buffer, projectSlug);

    const pool = await getPool();
    await pool.query(
      "INSERT INTO projects (name, description, fileName, image) VALUES (?, ?, ?, ?)",
      [name, description, projectSlug, image || ""],
    );

    await archiveTransaction.commit();
    archiveTransaction = null;
    return res.redirect("/panel");
  } catch (error) {
    if (archiveTransaction) {
      try {
        await archiveTransaction.rollback();
      } catch (rollbackError) {
        console.error("Project creation rollback failed:", rollbackError);
      }
    }

    console.error("Project creation failed:", error);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Impossible d'ajouter le projet.",
    });
  }
});

module.exports = router;
