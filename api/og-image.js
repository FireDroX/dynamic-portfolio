const express = require("express");
const { getPool, getProjectBySlug } = require("../utils/functions");
const { parseImageDataUrl } = require("../utils/images");
const { renderPortfolioOg, renderProjectOg } = require("../utils/og");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await getPool();
    const [projects] = await db.query(`
      SELECT fileName, createdAt
      FROM projects
      ORDER BY fileName
    `);

    res.set("Content-Type", "image/png");
    res.set(
      "Cache-Control",
      "public, max-age=300, stale-while-revalidate=3600",
    );
    res.send(renderPortfolioOg(projects));
  } catch (err) {
    console.error("Portfolio OG generation failed:", err);
    res.redirect("/preview.png");
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlug(slug);

    const projectImage = parseImageDataUrl(project?.image);

    if (!project || !projectImage) {
      return res.redirect("/preview.png");
    }

    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.send(await renderProjectOg(project, projectImage.buffer));
  } catch (err) {
    console.error(err);
    res.redirect("/preview.png");
  }
});

module.exports = router;
