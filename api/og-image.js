const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const { getProjectBySlug } = require("../utils/functions");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlug(slug);

    if (!project || !project.image) {
      return res.redirect("/favicon.svg");
    }

    const width = 1200;
    const height = 630;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // 🎨 Background
    ctx.fillStyle = "#b29a80";
    ctx.fillRect(0, 0, width, height);

    // Gradient léger
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#e7e5e5");
    gradient.addColorStop(1, "#b29a80");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 📸 Image projet (verticale à gauche)
    if (project?.image) {
      const base64 = project.image.split(",")[1];
      const buffer = Buffer.from(base64, "base64");

      const img = await loadImage(buffer);

      const imgWidth = 300;
      const imgHeight = 450;

      const x = 80;
      const y = (height - imgHeight) / 2;

      // rounded corners
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + 20, y);
      ctx.lineTo(x + imgWidth - 20, y);
      ctx.quadraticCurveTo(x + imgWidth, y, x + imgWidth, y + 20);
      ctx.lineTo(x + imgWidth, y + imgHeight - 20);
      ctx.quadraticCurveTo(
        x + imgWidth,
        y + imgHeight,
        x + imgWidth - 20,
        y + imgHeight,
      );
      ctx.lineTo(x + 20, y + imgHeight);
      ctx.quadraticCurveTo(x, y + imgHeight, x, y + imgHeight - 20);
      ctx.lineTo(x, y + 20);
      ctx.quadraticCurveTo(x, y, x + 20, y);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, x, y, imgWidth, imgHeight);
      ctx.restore();
    }

    // 📝 Texte
    ctx.fillStyle = "#0e0e0e";

    // Titre
    ctx.font = "bold 60px sans-serif";
    const title = project?.name || "Projet";
    wrapText(ctx, title, 450, 150, 650, 70);

    // Description
    ctx.fillStyle = "#555453";
    ctx.font = "30px sans-serif";
    const desc = project?.description || "";
    wrapText(ctx, desc, 450, 275, 650, 40);

    // Branding
    ctx.fillStyle = "#0e0e0e";
    ctx.font = "24px sans-serif";
    ctx.fillText("addrien.fr", 1050, 600);

    // 📤 Output
    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (err) {
    console.error(err);
    res.redirect("/favicon.svg");
  }
});

// helper wrap text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

module.exports = router;
