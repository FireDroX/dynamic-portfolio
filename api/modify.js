const express = require("express");
const auth = require("../middleware/auth");
const { getPool } = require("../utils/functions");
const { parseProjectUpload } = require("../services/projectUpload");
const { replaceProjectArchive } = require("../services/projectArchive");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  let archiveTransaction = null;

  try {
    const { fields, image, zip } = await parseProjectUpload(req);
    const originalFileName = (fields.originalFileName || "").replace(
      /[^a-zA-Z0-9_-]/g,
      "",
    );
    const name = fields.name?.trim();
    const descriptionFr = fields.descriptionFr?.trim();
    const descriptionEn = fields.descriptionEn?.trim();

    if (!originalFileName || !name || !descriptionFr || !descriptionEn) {
      return res.status(400).json({ error: "Champs manquants." });
    }

    const pool = await getPool();
    const [projects] = await pool.query(
      "SELECT fileName FROM projects WHERE fileName = ?",
      [originalFileName],
    );
    if (!projects.length) {
      return res.status(404).json({ error: "Projet introuvable." });
    }

    if (zip) {
      archiveTransaction = await replaceProjectArchive(
        zip.buffer,
        originalFileName,
      );
    }

    if (image) {
      await pool.query(
        `UPDATE projects
         SET name = ?, descriptionFr = ?, descriptionEn = ?, image = ?
         WHERE fileName = ?`,
        [name, descriptionFr, descriptionEn, image, originalFileName],
      );
    } else {
      await pool.query(
        `UPDATE projects
         SET name = ?, descriptionFr = ?, descriptionEn = ?
         WHERE fileName = ?`,
        [name, descriptionFr, descriptionEn, originalFileName],
      );
    }

    if (archiveTransaction) {
      await archiveTransaction.commit();
      archiveTransaction = null;
    }

    return res.json({ success: true });
  } catch (error) {
    if (archiveTransaction) {
      try {
        await archiveTransaction.rollback();
      } catch (rollbackError) {
        console.error("Project update rollback failed:", rollbackError);
      }
    }

    console.error("Project update failed:", error);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Impossible de modifier le projet.",
    });
  }
});

module.exports = router;
