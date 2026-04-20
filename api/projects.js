const { getPool } = require("../utils/functions");
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const router = express.Router();

const projectsPath = path.join(process.cwd(), "projects");

router.get("/", async (req, res) => {
  const db = await getPool();

  try {
    const results = await db.query`SELECT * FROM projects`;
    res.send(results.recordset);
  } catch (error) {
    return res.send("Erreur DB");
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
