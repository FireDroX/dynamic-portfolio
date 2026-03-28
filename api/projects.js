const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const db = require("../db");

const router = express.Router();

const projectsPath = path.join(__dirname, "../", "projects");

router.get("/", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, projects) => {
    if (err) return res.send("Erreur DB");

    res.send(projects);
  });
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
  const projectDir = path.join(__dirname, "projects", projectName);

  const indexPath = path.join(projectDir, "index.html");

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  next();
});

module.exports = router;
