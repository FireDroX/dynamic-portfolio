const { getPool } = require("../utils/functions");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const { parseImageDataUrl } = require("../utils/images");
const { readStoredContributors } = require("../utils/contributors");
const {
  PUBLIC_PROJECT_COLUMNS,
  listPublishedProjects,
} = require("../services/projectListing");

const withContributors = (project) => ({
  ...project,
  contributors: readStoredContributors(project.contributors),
});

const router = express.Router();

const projectsPath = path.join(process.cwd(), "projects");

const toSlug = (value) => value.replace(/[^a-zA-Z0-9_-]/g, "");

// Unpublished projects are hidden from every public route, files included.
const isPublished = async (slug) => {
  const db = await getPool();
  const [rows] = await db.query(
    "SELECT 1 FROM projects WHERE fileName = ? AND published = 1",
    [slug],
  );
  return rows.length > 0;
};

// Paginated: ?page=1&size=10&year=2025&q=search
router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const result = await listPublishedProjects(db, req.query);
    res.json({ ...result, items: result.items.map(withContributors) });
  } catch (error) {
    console.error("Projects list failed:", error);
    return res.status(500).json({ error: "Erreur DB" });
  }
});

router.get("/:project/meta", async (req, res) => {
  const projectName = toSlug(req.params.project);

  try {
    const db = await getPool();
    const [rows] = await db.query(
      `SELECT ${PUBLIC_PROJECT_COLUMNS}
       FROM projects WHERE fileName = ? AND published = 1`,
      [projectName],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Projet introuvable" });
    }
    res.json(withContributors(rows[0]));
  } catch (error) {
    console.error("Project metadata failed:", error);
    res.status(500).json({ error: "Erreur DB" });
  }
});

router.get("/:project/image", async (req, res) => {
  const projectName = toSlug(req.params.project);

  try {
    const db = await getPool();
    const [rows] = await db.query(
      "SELECT image FROM projects WHERE fileName = ? AND published = 1",
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

router.use("/:project", async (req, res, next) => {
  const projectName = toSlug(req.params.project);
  const projectDir = path.join(projectsPath, projectName);

  try {
    if (!fs.existsSync(projectDir) || !(await isPublished(projectName))) {
      return next();
    }
  } catch (error) {
    return next(error);
  }

  express.static(projectDir)(req, res, next);
});

router.get("/:project", async (req, res, next) => {
  const projectName = toSlug(req.params.project);

  const projectDir = path.join(projectsPath, projectName);
  const indexPath = path.join(projectDir, "index.html");

  try {
    if (fs.existsSync(indexPath) && (await isPublished(projectName))) {
      return res.sendFile(indexPath);
    }
  } catch (error) {
    return next(error);
  }

  next();
});

module.exports = router;
