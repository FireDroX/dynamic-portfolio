const fs = require("fs");
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

// The image panel is anchored to the right edge and vertically centred; its
// shape follows the image's aspect ratio (portrait, square or landscape)
// within these bounds, so a thumbnail is shown whole instead of shrunk into a
// fixed portrait frame.
const PANEL_RIGHT = 1120;
const PANEL_CENTER_Y = 319;
const PANEL_MIN = { width: 240, height: 200 };
const PANEL_MAX = { width: 440, height: 430 };
const PLACEHOLDER_PANEL = { width: 300, height: 430 };
const TEXT_X = 70;
const TEXT_GAP = 70;

function getPanel(image) {
  let { width, height } = PLACEHOLDER_PANEL;
  if (image?.width > 0 && image?.height > 0) {
    const scale = Math.min(
      PANEL_MAX.width / image.width,
      PANEL_MAX.height / image.height,
    );
    width = clamp(Math.round(image.width * scale), PANEL_MIN.width, PANEL_MAX.width);
    height = clamp(Math.round(image.height * scale), PANEL_MIN.height, PANEL_MAX.height);
  }
  return {
    x: PANEL_RIGHT - width,
    y: Math.round(PANEL_CENTER_Y - height / 2),
    width,
    height,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const isWebp = (buffer) =>
  buffer.length >= 12 &&
  buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
  buffer.subarray(8, 12).toString("ascii") === "WEBP";

// node-canvas cannot decode WebP, so WebP thumbnails go through the WASM
// decoder of @jsquash/webp (ESM only, loaded once on first use).
let webpDecoder = null;
function getWebpDecoder() {
  webpDecoder ??= (async () => {
    const { init, default: decode } = await import("@jsquash/webp/decode.js");
    const wasmPath = path.join(
      path.dirname(require.resolve("@jsquash/webp/package.json")),
      "codec",
      "dec",
      "webp_dec.wasm",
    );
    await init(await WebAssembly.compile(await fs.promises.readFile(wasmPath)));
    return decode;
  })().catch((err) => {
    webpDecoder = null;
    throw err;
  });
  return webpDecoder;
}

async function loadProjectImage(buffer) {
  if (!isWebp(buffer)) return loadImage(buffer);

  const decode = await getWebpDecoder();
  const { width, height, data } = await decode(buffer);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(data);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function drawImagePanel(ctx, image, panel) {
  const { x, y, width, height } = panel;
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

function drawPlaceholderPanel(ctx, name, slug, panel) {
  const { x, y, width, height } = panel;
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
      image = await loadProjectImage(imageBuffer);
    } catch (err) {
      console.warn("OG project image could not be decoded:", err.message);
      image = null;
    }
  }

  const panel = getPanel(image);
  const maxWidth = Math.min(650, panel.x - TEXT_X - TEXT_GAP);

  drawBackground(ctx);
  drawBrand(ctx, "PROJET · ADRIEN PORTFOLIO");
  drawEyebrow(ctx, "Aperçu interactif", 70, 137);

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
    maxWidth - 20,
    titleLines.length > 1 ? 3 : 4,
  );
  const descBottom = drawLines(ctx, descLines, 70, titleBottom + 5, 35);

  ctx.font = mono(400, 16);
  const urlText = truncateLine(
    ctx,
    `addrien.fr/projects/${slug}`,
    Math.min(580, maxWidth - 70),
  );
  const urlY = Math.min(descBottom + 24, 480);
  drawPill(ctx, 70, urlY, ctx.measureText(urlText).width + 50, 48);
  ctx.fillStyle = COLORS.accent;
  ctx.fillText(urlText, 94, urlY + 29);

  if (image) drawImagePanel(ctx, image, panel);
  else drawPlaceholderPanel(ctx, name, slug, panel);

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
