const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const router = express.Router();

router.get("/:name", (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).send("Project name is required !");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return res.status(400).send("Invalid project name");
  }

  const filePath = path.join(__dirname, "../projects", `${name}.html`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`Project "${name}" not found`);
  }

  res.sendFile(filePath);
});

module.exports = router;
