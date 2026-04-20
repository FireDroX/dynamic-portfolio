const express = require("express");
const { getProjectBySlug } = require("../utils/functions");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlug(slug);

    if (!project || !project.image) {
      return res.redirect("/favicon.svg");
    }

    const image = project.image.split(",")[1];
    const buffer = Buffer.from(image, "base64");

    res.set("Content-Type", "image/png"); // adapte si jpg/webp
    res.set("Cache-Control", "public, max-age=31536000, immutable");

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.redirect("/favicon.svg");
  }
});

module.exports = router;
