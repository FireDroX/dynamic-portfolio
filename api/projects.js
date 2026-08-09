const { getPool } = require("../utils/functions");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const { parseImageDataUrl } = require("../utils/images");

const router = express.Router();

const projectsPath = path.join(process.cwd(), "projects");

router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const [rows] = await db.query(`
      SELECT id, name, descriptionFr, descriptionEn,
        descriptionFr AS description, fileName, createdAt,
        (image LIKE 'data:image/%;base64,%'
          AND MOD(CHAR_LENGTH(SUBSTRING_INDEX(image, ',', -1)), 4) = 0) AS hasImage
      FROM projects
    `);
    res.json(rows);
  } catch (error) {
    console.error("Projects list failed:", error);
    return res.status(500).json({ error: "Erreur DB" });
  }
});

router.get("/:project/meta", async (req, res) => {
  const projectName = req.params.project.replace(/[^a-zA-Z0-9_-]/g, "");

  try {
    const db = await getPool();
    const [rows] = await db.query(
      `SELECT id, name, descriptionFr, descriptionEn,
        descriptionFr AS description, fileName, createdAt,
        (image LIKE 'data:image/%;base64,%'
          AND MOD(CHAR_LENGTH(SUBSTRING_INDEX(image, ',', -1)), 4) = 0) AS hasImage
       FROM projects WHERE fileName = ?`,
      [projectName],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Projet introuvable" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Project metadata failed:", error);
    res.status(500).json({ error: "Erreur DB" });
  }
});

router.get("/:project/image", async (req, res) => {
  const projectName = req.params.project.replace(/[^a-zA-Z0-9_-]/g, "");

  try {
    const db = await getPool();
    const [rows] = await db.query(
      "SELECT image FROM projects WHERE fileName = ?",
      [projectName],
    );
    const image = parseImageDataUrl(rows[0]?.image);

    if (!image) {
      return res.status(404).json({ error: "Image introuvable" });
    }

    res.set({
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=86400",
    });
    res.send(image.buffer);
  } catch (error) {
    console.error("Project image failed:", error);
    res.status(500).json({ error: "Erreur DB" });
  }
});

router.use("/:project", (req, res, next) => {
  const projectName = req.params.project.replace(/[^a-zA-Z0-9_-]/g, "");

  const projectDir = path.join(projectsPath, projectName);

  if (!fs.existsSync(projectDir)) {
    return next();
  }

  express.static(projectDir)(req, res, next);
});

router.get("/:project", (req, res, next) => {
  const projectName = req.params.project.replace(/[^a-zA-Z0-9_-]/g, "");

  const projectDir = path.join(projectsPath, projectName);
  const indexPath = path.join(projectDir, "index.html");

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  next();
});

module.exports = router;
