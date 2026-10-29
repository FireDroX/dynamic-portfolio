const { getPool } = require("../utils/functions");
const express = require("express");
const auth = require("../middleware/auth");
const { removeProjectArchive } = require("../services/projectArchive");

const router = express.Router();

// Projects are identified by fileName (unique slug): names can be shared.
router.post("/", auth, async (req, res) => {
  const fileName = String(req.body?.fileName || "").replace(
    /[^a-zA-Z0-9_-]/g,
    "",
  );
  if (!fileName || fileName !== req.body.fileName) {
    return res.status(400).json({ error: "Projet invalide" });
  }

  let archiveTransaction = null;

  try {
    const pool = await getPool();
    const [projects] = await pool.query(
      "SELECT fileName FROM projects WHERE fileName = ?",
      [fileName],
    );
    if (!projects.length) {
      return res.status(404).json({ error: "Projet introuvable" });
    }

    archiveTransaction = await removeProjectArchive(fileName);
    await pool.query("DELETE FROM projects WHERE fileName = ?", [fileName]);

    const removal = archiveTransaction;
    archiveTransaction = null;
    try {
      await removal.commit();
    } catch (cleanupError) {
      // The project is gone from the site; only a hidden folder is left.
      console.error("Project files cleanup failed:", cleanupError);
    }

    return res.json({ success: true });
  } catch (error) {
    if (archiveTransaction) {
      try {
        await archiveTransaction.rollback();
      } catch (rollbackError) {
        console.error("Project deletion rollback failed:", rollbackError);
      }
    }

    console.error("Project deletion failed:", error);
    return res.status(500).json({ error: "Impossible de supprimer le projet." });
  }
});

module.exports = router;
