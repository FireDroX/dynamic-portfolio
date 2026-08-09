const { createCanvas, loadImage } = require("canvas");

const WIDTH = 1200;
const HEIGHT = 630;
const COLORS = {
  background: "#0e0e0e",
  surface: "#151515",
  surfaceSoft: "#1a1918",
  text: "#e7e5e5",
  accent: "#acabaa",
  secondary: "#b29a80",
  border: "#34312e",
  green: "#78ad77",
};

function roundedRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  );
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function drawBackground(ctx) {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createRadialGradient(965, 180, 20, 965, 180, 500);
  glow.addColorStop(0, "rgba(178, 154, 128, 0.15)");
  glow.addColorStop(1, "rgba(178, 154, 128, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#2b2927";
  for (let y = 18; y < HEIGHT; y += 18) {
    for (let x = 18; x < WIDTH; x += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawBrand(ctx, label = "ADRIEN · PORTFOLIO") {
  ctx.fillStyle = COLORS.secondary;
  ctx.font = "600 18px sans-serif";
  ctx.fillText(label, 70, 72);

  ctx.fillStyle = COLORS.accent;
  ctx.font = "16px monospace";
  ctx.textAlign = "right";
  ctx.fillText("addrien.fr", WIDTH - 70, 72);
  ctx.textAlign = "left";
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) lines.push(line);

  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && visibleLines.length) {
    let lastLine = `${visibleLines.at(-1)}…`;
    while (ctx.measureText(lastLine).width > maxWidth && lastLine.length > 2) {
      lastLine = `${lastLine.slice(0, -2).trimEnd()}…`;
    }
    visibleLines[visibleLines.length - 1] = lastLine;
  }

  visibleLines.forEach((currentLine, index) => {
    ctx.fillText(currentLine, x, y + index * lineHeight);
  });

  return y + visibleLines.length * lineHeight;
}

function formatProjectDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  })
    .format(date)
    .replace(".", "");
}

function drawTerminal(ctx, projects = []) {
  const x = 665;
  const y = 110;
  const width = 465;
  const height = 400;

  roundedRect(ctx, x, y, width, height, 22);
  ctx.fillStyle = COLORS.surface;
  ctx.fill();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  roundedRect(ctx, x, y, width, height, 22);
  ctx.clip();
  ctx.fillStyle = COLORS.surfaceSoft;
  ctx.fillRect(x, y, width, 58);
  ctx.fillStyle = COLORS.border;
  ctx.fillRect(x, y + 57, width, 1);
  ctx.restore();

  ctx.fillStyle = COLORS.accent;
  ctx.font = "14px monospace";
  ctx.fillText("adrien@portfolio: ~/projects", x + 24, y + 33);

  ctx.fillStyle = COLORS.secondary;
  ctx.font = "16px monospace";
  ctx.fillText("$", x + 24, y + 80);
  ctx.fillStyle = COLORS.text;
  ctx.fillText("ls -lah", x + 49, y + 80);

  ctx.fillStyle = COLORS.accent;
  ctx.font = "13px monospace";
  ctx.fillText(
    `total ${projects.length} projet${projects.length > 1 ? "s" : ""}`,
    x + 24,
    y + 106,
  );

  const maxRows = 10;
  const hasHiddenProjects = projects.length > maxRows;
  const visibleProjects = hasHiddenProjects
    ? projects.slice(0, maxRows - 1)
    : projects.slice(0, maxRows);

  visibleProjects.forEach((project, index) => {
    const rowY = y + 134 + index * 20;
    ctx.fillStyle = COLORS.accent;
    ctx.font = "12px monospace";
    ctx.fillText("drwxr-xr-x", x + 24, rowY);
    ctx.fillText("1", x + 107, rowY);
    ctx.fillText("adrien", x + 124, rowY);
    ctx.fillText("4.0K", x + 175, rowY);
    ctx.fillText(formatProjectDate(project.createdAt), x + 215, rowY);
    ctx.fillStyle = COLORS.secondary;
    ctx.fillText(`${project.fileName}/`, x + 316, rowY);
  });

  if (hasHiddenProjects) {
    const hiddenCount = projects.length - visibleProjects.length;
    const rowY = y + 134 + visibleProjects.length * 20;
    ctx.fillStyle = COLORS.accent;
    ctx.font = "12px monospace";
    ctx.fillText(
      `… ${hiddenCount} autre${hiddenCount > 1 ? "s" : ""}`,
      x + 24,
      rowY,
    );
  }

  ctx.fillStyle = COLORS.secondary;
  ctx.font = "16px monospace";
  ctx.fillText("$", x + 24, y + 368);
  ctx.fillRect(x + 49, y + 353, 8, 18);
}

function renderPortfolioOg(projects = []) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  drawBackground(ctx);
  drawBrand(ctx);

  ctx.fillStyle = COLORS.text;
  ctx.font = "700 92px sans-serif";
  ctx.fillText("Adrien", 68, 208);

  ctx.fillStyle = COLORS.text;
  ctx.font = "600 32px sans-serif";
  wrapText(ctx, "Des projets faits pour être utilisés.", 70, 278, 510, 40, 2);

  ctx.fillStyle = COLORS.accent;
  ctx.font = "22px sans-serif";
  wrapText(
    ctx,
    "Développeur web et étudiant à l’ESGI Paris.",
    70,
    360,
    500,
    32,
    2,
  );

  roundedRect(ctx, 70, 425, 258, 45, 23);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = COLORS.green;
  ctx.beginPath();
  ctx.arc(94, 447.5, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.accent;
  ctx.font = "600 14px sans-serif";
  ctx.fillText("DISPONIBLE EN LIGNE", 112, 453);

  drawTerminal(ctx, projects);

  ctx.fillStyle = COLORS.border;
  ctx.fillRect(70, 556, WIDTH - 140, 1);
  ctx.fillStyle = COLORS.accent;
  ctx.font = "15px monospace";
  ctx.fillText("React · Node.js · PHP · C · Docker", 70, 588);
  ctx.textAlign = "right";
  ctx.fillText("portfolio.addrien.fr", WIDTH - 70, 588);
  ctx.textAlign = "left";

  return canvas.toBuffer("image/png");
}

function drawImageContain(ctx, image, x, y, width, height) {
  const scale = Math.min(width / image.width, height / image.height);
  const renderedWidth = image.width * scale;
  const renderedHeight = image.height * scale;
  const imageX = x + (width - renderedWidth) / 2;
  const imageY = y + (height - renderedHeight) / 2;

  ctx.fillStyle = COLORS.surfaceSoft;
  ctx.fillRect(x, y, width, height);
  ctx.drawImage(image, imageX, imageY, renderedWidth, renderedHeight);
}

async function renderProjectOg(project, imageBuffer) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  const image = await loadImage(imageBuffer);

  drawBackground(ctx);
  drawBrand(ctx, "PROJET · ADRIEN PORTFOLIO");

  ctx.fillStyle = COLORS.secondary;
  ctx.font = "600 16px sans-serif";
  ctx.fillText("APERÇU INTERACTIF", 70, 137);

  const title = project?.name || "Projet";
  const titleSize = title.length > 24 ? 58 : 70;
  ctx.fillStyle = COLORS.text;
  ctx.font = `700 ${titleSize}px sans-serif`;
  const titleBottom = wrapText(ctx, title, 70, 205, 650, titleSize + 8, 2);

  ctx.fillStyle = COLORS.accent;
  ctx.font = "24px sans-serif";
  const descriptionBottom = wrapText(
    ctx,
    project?.description || "Découvrez ce projet sur mon portfolio.",
    70,
    titleBottom + 5,
    630,
    35,
    titleBottom > 320 ? 2 : 4,
  );

  const projectUrl = `portfolio.addrien.fr/projects/${project?.fileName || ""}`;
  const urlY = Math.min(descriptionBottom + 24, 480);
  ctx.font = "16px monospace";
  const urlWidth = Math.min(ctx.measureText(projectUrl).width + 50, 630);

  roundedRect(ctx, 70, urlY, urlWidth, 48, 24);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = COLORS.secondary;
  ctx.fillText(projectUrl, 94, urlY + 30);

  ctx.save();
  roundedRect(ctx, 820, 104, 300, 430, 20);
  ctx.clip();
  drawImageContain(ctx, image, 820, 104, 300, 430);
  ctx.restore();

  roundedRect(ctx, 820, 104, 300, 430, 20);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  return canvas.toBuffer("image/png");
}

module.exports = {
  HEIGHT,
  WIDTH,
  renderPortfolioOg,
  renderProjectOg,
};
