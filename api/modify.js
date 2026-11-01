const express = require("express");
const auth = require("../middleware/auth");
const { getPool } = require("../utils/functions");
const { parseProjectUpload } = require("../services/projectUpload");
const { replaceProjectArchive } = require("../services/projectArchive");
const { parseContributors } = require("../utils/contributors");
const { parsePublished } = require("../utils/publication");

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

    // Optional: when the field is absent the stored contributors are kept.
    const contributors =
      fields.contributors === undefined
        ? undefined
        : parseContributors(fields.contributors);

    if (!originalFileName || !name || !descriptionFr || !descriptionEn) {
      return res.status(400).json({ error: "Champs manquants." });
    }
    if (contributors === null) {
      return res.status(400).json({ error: "Contributeurs invalides." });
    }
    // Optional too: absent keeps the current visibility.
    const published = parsePublished(fields.published);
    if (published === null) {
      return res.status(400).json({ error: "Statut de publication invalide." });
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

    const updates = { name, descriptionFr, descriptionEn };
    if (image) updates.image = image;
    if (contributors) updates.contributors = JSON.stringify(contributors);
    if (published !== undefined) updates.published = published;

    const columns = Object.keys(updates);
    await pool.query(
      `UPDATE projects
       SET ${columns.map((column) => `${column} = ?`).join(", ")}
       WHERE fileName = ?`,
      [...Object.values(updates), originalFileName],
    );

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
