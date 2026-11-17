const express = require("express");
const { isValidTech } = require("../utils/stack");
const { resolveTechIcon } = require("../utils/techIcons");

const router = express.Router();

// A brand icon only changes with a Simple Icons upgrade: let browsers keep it.
const CACHE = "public, max-age=604800, stale-while-revalidate=86400";

// GET /api/tech-icons?name=Socket.io -> { title, hex, path } or 404.
// The name goes in the query: a technology may contain "/" (e.g. "CI/CD").
router.get("/", (req, res) => {
  const { name } = req.query;
  if (typeof name !== "string" || !isValidTech(name)) {
    return res.status(400).json({ error: "Nom de technologie invalide." });
  }

  const icon = resolveTechIcon(name);
  res.set("Cache-Control", CACHE);
  if (!icon) return res.status(404).json({ error: "Icône introuvable." });
  return res.json(icon);
});

module.exports = router;
