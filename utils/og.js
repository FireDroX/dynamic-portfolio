const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const { getProjectDescription } = require("./projectDescription");

const WIDTH = 1200;
const HEIGHT = 630;

const FONTS_DIR = path.join(__dirname, "..", "fonts");
[
  ["urbanist/Urbanist-Regular.ttf", "Urbanist", "400"],
  ["urbanist/Urbanist-Medium.ttf", "Urbanist", "500"],
  ["urbanist/Urbanist-SemiBold.ttf", "Urbanist", "600"],
  ["dm-mono/DMMono-Regular.ttf", "DM Mono", "400"],
  ["dm-mono/DMMono-Medium.ttf", "DM Mono", "500"],
].forEach(([file, family, weight]) => {
  try {
    registerFont(path.join(FONTS_DIR, file), { family, weight });
  } catch {
    console.warn(`OG font unavailable: ${family} ${weight}`);
  }
});

const display = (weight, size) => `${weight} ${size}px "Urbanist", sans-serif`;
const mono = (weight, size) => `${weight} ${size}px "DM Mono", monospace`;

// Dark scheme of client/src/styles/tokens.css
const COLORS = {
  bg: "#0e0e0e", // --p-bg
  surface: "#151515", // --p-surface
  surface2: "#1a1918", // --surface-2
  ink: "#e7e5e5", // --p-ink
  muted: "#acabaa", // --p-muted
  accent: "#b29a80", // --p-accent
  border: "#34312e", // --border
  ok: "#78ad77", // --ok
  dotRed: "#ff5f57", // --dot-red
  dotYellow: "#febc2e", // --dot-yellow
  dotGreen: "#28c840", // --dot-green
};

const RADIUS = 20; // --r-lg

function sanitizeOgText(value, maxChars) {
  const clean = String(value ?? "")
    .replace(/[\u0000-\u001F\u007F-\u009F‪-‮⁦-⁩]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(clean).slice(0, maxChars).join("");
}

function setTracking(ctx, px) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

function fitWithEllipsis(ctx, text, maxWidth) {
  const chars = Array.from(text);
  while (chars.length && ctx.measureText(`${chars.join("")}…`).width > maxWidth) {
    chars.pop();
  }
  return `${chars.join("").trimEnd()}…`;
}

function truncateLine(ctx, text, maxWidth) {
  const value = String(text ?? "");
  if (ctx.measureText(value).width <= maxWidth) return value;
  return fitWithEllipsis(ctx, value, maxWidth);
}

function breakWord(ctx, word, maxWidth) {
  const pieces = [];
  let piece = "";
  for (const char of Array.from(word)) {
    if (piece && ctx.measureText(piece + char).width > maxWidth) {
      pieces.push(piece);
      piece = char;
    } else {
      piece += char;
    }
  }
  if (piece) pieces.push(piece);
  return pieces;
}

function wrapText(ctx, text, maxWidth, maxLines = Infinity) {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      return;
    }
    if (line) lines.push(line);
    const pieces = breakWord(ctx, word, maxWidth);
    lines.push(...pieces.slice(0, -1));
    line = pieces.at(-1) || "";
  });
  if (line) lines.push(line);

  if (lines.length <= maxLines) return lines;

  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = fitWithEllipsis(ctx, visible[maxLines - 1], maxWidth);
  return visible;
}

function drawLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function paintBackground(ctx) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createRadialGradient(965, 180, 20, 965, 180, 500);
  glow.addColorStop(0, "rgba(178, 154, 128, 0.12)");
  glow.addColorStop(1, "rgba(178, 154, 128, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#222120";
  for (let y = 18; y < HEIGHT; y += 18) {
    for (let x = 18; x < WIDTH; x += 18) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// The dotted background (~2,300 arcs) never changes: paint it once and copy
// it into each image, since rendering runs on the server's only thread.
let backgroundCanvas = null;

function drawBackground(ctx) {
  if (!backgroundCanvas) {
    backgroundCanvas = createCanvas(WIDTH, HEIGHT);
    paintBackground(backgroundCanvas.getContext("2d"));
  }
  ctx.drawImage(backgroundCanvas, 0, 0);
}

function drawEyebrow(ctx, label, x, y) {
  ctx.fillStyle = COLORS.accent;
  ctx.font = mono(500, 16);
  setTracking(ctx, 2.9);
  ctx.fillText(label.toUpperCase(), x, y);
  setTracking(ctx, 0);
}

function drawBrand(ctx, label = "ADRIEN · PORTFOLIO") {
  drawEyebrow(ctx, label, 70, 72);

  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(400, 16);
  ctx.textAlign = "right";
  ctx.fillText("addrien.fr", WIDTH - 70, 72);
  ctx.textAlign = "left";
}

function drawPill(ctx, x, y, width, height) {
  roundedRect(ctx, x, y, width, height, 999);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.stroke();
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

  roundedRect(ctx, x, y, width, height, RADIUS);
  ctx.fillStyle = COLORS.surface;
  ctx.fill();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  roundedRect(ctx, x, y, width, height, RADIUS);
  ctx.clip();
  ctx.fillStyle = COLORS.surface2;
  ctx.fillRect(x, y, width, 52);
  ctx.fillStyle = COLORS.border;
  ctx.fillRect(x, y + 52, width, 1);
  ctx.restore();

  [COLORS.dotRed, COLORS.dotYellow, COLORS.dotGreen].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 26 + i * 20, y + 26, 5.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(400, 13);
  ctx.fillText("adrien@portfolio: ~/projects", x + 100, y + 31);

  ctx.fillStyle = COLORS.accent;
  ctx.font = mono(500, 16);
  ctx.fillText("$", x + 24, y + 86);
  ctx.fillStyle = COLORS.ink;
  ctx.fillText("ls -lah", x + 49, y + 86);

  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(400, 13);
  ctx.fillText(
    `total ${projects.length} projet${projects.length > 1 ? "s" : ""}`,
    x + 24,
    y + 112,
  );

  const maxRows = 10;
  const hasHidden = projects.length > maxRows;
  const visible = projects.slice(0, hasHidden ? maxRows - 1 : maxRows);
  const nameX = x + 316;
  const nameMax = x + width - 24 - nameX;

  visible.forEach((project, index) => {
    const rowY = y + 140 + index * 20;
    ctx.fillStyle = COLORS.muted;
    ctx.font = mono(400, 12);
    ctx.fillText("drwxr-xr-x", x + 24, rowY);
    ctx.fillText("1", x + 107, rowY);
    ctx.fillText("adrien", x + 124, rowY);
    ctx.fillText("4.0K", x + 175, rowY);
    ctx.fillText(formatProjectDate(project.createdAt), x + 215, rowY);
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(
      truncateLine(ctx, `${sanitizeOgText(project.fileName, 80)}/`, nameMax),
      nameX,
      rowY,
    );
  });

  if (hasHidden) {
    const hiddenCount = projects.length - visible.length;
    ctx.fillStyle = COLORS.muted;
    ctx.font = mono(400, 12);
    ctx.fillText(
      `… ${hiddenCount} autre${hiddenCount > 1 ? "s" : ""}`,
      x + 24,
      y + 140 + visible.length * 20,
    );
  }

  ctx.fillStyle = COLORS.accent;
  ctx.font = mono(500, 16);
  ctx.fillText("$", x + 24, y + 372);
  ctx.fillRect(x + 49, y + 358, 8, 18);
}

// The portfolio image only depends on the project list: keep the last PNG
// and render again only when that list changes.
let lastPortfolioOg = { key: null, png: null };

function renderPortfolioOg(projects = []) {
  const key = JSON.stringify(projects);
  if (lastPortfolioOg.key === key) return lastPortfolioOg.png;

  const png = paintPortfolioOg(projects);
  lastPortfolioOg = { key, png };
  return png;
}

function paintPortfolioOg(projects) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  drawBackground(ctx);
  drawBrand(ctx);

  ctx.fillStyle = COLORS.ink;
  ctx.font = display(500, 96);
  setTracking(ctx, -2.9);
  ctx.fillText("Adrien", 68, 208);
  setTracking(ctx, -0.6);
  ctx.font = display(500, 34);
  drawLines(
    ctx,
    wrapText(ctx, "Des projets faits pour être utilisés.", 510, 2),
    70,
    278,
    42,
  );
  setTracking(ctx, 0);

  ctx.fillStyle = COLORS.muted;
  ctx.font = display(400, 23);
  drawLines(
    ctx,
    wrapText(ctx, "Développeur web et étudiant à l’ESGI Paris.", 500, 2),
    70,
    362,
    32,
  );

  drawPill(ctx, 70, 425, 262, 45);
  ctx.fillStyle = COLORS.ok;
  ctx.beginPath();
  ctx.arc(94, 447.5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(500, 13);
  setTracking(ctx, 1.6);
  ctx.fillText("DISPONIBLE EN LIGNE", 112, 452);
  setTracking(ctx, 0);

  drawTerminal(ctx, projects);

  ctx.fillStyle = COLORS.border;
  ctx.fillRect(70, 556, WIDTH - 140, 1);
  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(400, 15);
  ctx.fillText("React · Node.js · PHP · C · Docker", 70, 588);
  ctx.textAlign = "right";
  ctx.fillText("addrien.fr", WIDTH - 70, 588);
  ctx.textAlign = "left";

  return canvas.toBuffer("image/png");
}

const PANEL = { x: 820, y: 104, width: 300, height: 430 };

function drawImagePanel(ctx, image) {
  const { x, y, width, height } = PANEL;
  ctx.save();
  roundedRect(ctx, x, y, width, height, RADIUS);
  ctx.clip();
  ctx.fillStyle = COLORS.surface2;
  ctx.fillRect(x, y, width, height);
  const scale = Math.min(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
  ctx.restore();

  roundedRect(ctx, x, y, width, height, RADIUS);
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawPlaceholderPanel(ctx, name, slug) {
  const { x, y, width, height } = PANEL;
  roundedRect(ctx, x, y, width, height, RADIUS);
  ctx.fillStyle = COLORS.surface2;
  ctx.fill();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.stroke();

  const letter = (Array.from(name)[0] || "?").toUpperCase();
  ctx.fillStyle = COLORS.accent;
  ctx.font = display(500, 150);
  ctx.textAlign = "center";
  ctx.fillText(truncateLine(ctx, letter, width - 40), x + width / 2, y + height / 2 + 30);

  ctx.fillStyle = COLORS.muted;
  ctx.font = mono(400, 14);
  ctx.fillText(
    truncateLine(ctx, `/${slug}`, width - 40),
    x + width / 2,
    y + height - 36,
  );
  ctx.textAlign = "left";
}

async function renderProjectOg(project, imageBuffer) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  const name = sanitizeOgText(project?.name, 120) || "Projet";
  const description =
    sanitizeOgText(getProjectDescription(project), 400) ||
    "Découvrez ce projet sur mon portfolio.";
  const slug = sanitizeOgText(project?.fileName, 80);

  let image = null;
  if (imageBuffer) {
    try {
      image = await loadImage(imageBuffer);
    } catch {
      image = null;
    }
  }

  drawBackground(ctx);
  drawBrand(ctx, "PROJET · ADRIEN PORTFOLIO");
  drawEyebrow(ctx, "Aperçu interactif", 70, 137);

  const maxWidth = 650;
  let titleSize = 70;
  let titleLines;
  for (const size of [70, 58, 48]) {
    titleSize = size;
    ctx.font = display(500, size);
    setTracking(ctx, -size * 0.03);
    titleLines = wrapText(ctx, name, maxWidth, 3);
    if (titleLines.length <= 2) break;
  }
  if (titleLines.length > 2) titleLines = wrapText(ctx, name, maxWidth, 2);
  ctx.fillStyle = COLORS.ink;
  const titleBottom = drawLines(ctx, titleLines, 70, 205, titleSize + 8);
  setTracking(ctx, 0);

  ctx.fillStyle = COLORS.muted;
  ctx.font = display(400, 24);
  const descLines = wrapText(
    ctx,
    description,
    630,
    titleLines.length > 1 ? 3 : 4,
  );
  const descBottom = drawLines(ctx, descLines, 70, titleBottom + 5, 35);

  ctx.font = mono(400, 16);
  const urlText = truncateLine(
    ctx,
    `addrien.fr/projects/${slug}`,
    580,
  );
  const urlY = Math.min(descBottom + 24, 480);
  drawPill(ctx, 70, urlY, ctx.measureText(urlText).width + 50, 48);
  ctx.fillStyle = COLORS.accent;
  ctx.fillText(urlText, 94, urlY + 29);

  if (image) drawImagePanel(ctx, image);
  else drawPlaceholderPanel(ctx, name, slug);

  return canvas.toBuffer("image/png");
}

module.exports = {
  HEIGHT,
  WIDTH,
  renderPortfolioOg,
  renderProjectOg,
  sanitizeOgText,
  truncateLine,
  wrapText,
};
