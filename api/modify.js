const { getPool } = require("../utils/functions");
const express = require("express");
const Busboy = require("busboy");
const unzipper = require("unzipper");
const fs = require("node:fs");
const path = require("node:path");
const stream = require("node:stream");
const auth = require("../middleware/auth");

const router = express.Router();
const projectsPath = path.join(__dirname, "../projects");

const extractZip = async (buffer, destination) => {
  const directory = await unzipper.Open.buffer(buffer);

  for (const entry of directory.files) {
    const normalized = entry.path.replace(/\\/g, "/");
    const segments = normalized.split("/");
    if (
      path.posix.isAbsolute(normalized) ||
      segments.includes("..") ||
      entry.type === "SymbolicLink"
    ) {
      throw new Error("L'archive contient un chemin non autorisé.");
    }
  }

  const readable = new stream.PassThrough();
  readable.end(buffer);
  await readable.pipe(unzipper.Extract({ path: destination })).promise();

  if (!fs.existsSync(path.join(destination, "index.html"))) {
    throw new Error("Le ZIP doit contenir un fichier index.html à sa racine.");
  }
};

router.post("/", auth, (req, res) => {
  let busboy;

  try {
    busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: 100 * 1024 * 1024, files: 2 },
    });
  } catch {
    return res.status(400).json({ error: "Formulaire invalide." });
  }

  const fields = {};
  let image = null;
  let zip = null;
  let uploadError = null;

  busboy.on("field", (name, value) => {
    fields[name] = value;
  });

  busboy.on("file", (name, file, info) => {
    const chunks = [];

    file.on("data", (chunk) => chunks.push(chunk));
    file.on("limit", () => {
      uploadError = "Un fichier dépasse la limite de 100 Mo.";
    });
    file.on("end", () => {
      if (!info.filename) return;
      const buffer = Buffer.concat(chunks);

      if (name === "image") {
        if (!info.mimeType.startsWith("image/")) {
          uploadError = "Le fichier image n'est pas valide.";
          return;
        }
        image = `data:${info.mimeType};base64,${buffer.toString("base64")}`;
      }

      if (name === "zip") zip = buffer;
    });
  });

  busboy.on("finish", async () => {
    const originalFileName = (fields.originalFileName || "").replace(
      /[^a-zA-Z0-9_-]/g,
      "",
    );
    const name = fields.name?.trim();
    const description = fields.description?.trim();

    if (uploadError) return res.status(400).json({ error: uploadError });
    if (!originalFileName || !name || !description) {
      return res.status(400).json({ error: "Champs manquants." });
    }

    let temporaryPath = null;
    let backupPath = null;
    const projectPath = path.join(projectsPath, originalFileName);

    try {
      const pool = await getPool();
      const [projects] = await pool.query(
        "SELECT fileName FROM projects WHERE fileName = ?",
        [originalFileName],
      );
      if (!projects.length) {
        return res.status(404).json({ error: "Projet introuvable." });
      }

      if (zip) {
        await fs.promises.mkdir(projectsPath, { recursive: true });
        temporaryPath = await fs.promises.mkdtemp(
          path.join(projectsPath, `.update-${originalFileName}-`),
        );
        await extractZip(zip, temporaryPath);

        backupPath = path.join(
          projectsPath,
          `.backup-${originalFileName}-${Date.now()}`,
        );
        if (fs.existsSync(projectPath)) {
          await fs.promises.rename(projectPath, backupPath);
        }
        await fs.promises.rename(temporaryPath, projectPath);
        temporaryPath = null;
      }

      if (image) {
        await pool.query(
          "UPDATE projects SET name = ?, description = ?, image = ? WHERE fileName = ?",
          [name, description, image, originalFileName],
        );
      } else {
        await pool.query(
          "UPDATE projects SET name = ?, description = ? WHERE fileName = ?",
          [name, description, originalFileName],
        );
      }

      if (backupPath) {
        await fs.promises.rm(backupPath, { recursive: true, force: true });
      }

      res.json({ success: true });
    } catch (error) {
      try {
        if (temporaryPath) {
          await fs.promises.rm(temporaryPath, { recursive: true, force: true });
        }
        if (backupPath && fs.existsSync(backupPath)) {
          await fs.promises.rm(projectPath, { recursive: true, force: true });
          await fs.promises.rename(backupPath, projectPath);
        }
      } catch (rollbackError) {
        console.error("Project rollback failed:", rollbackError);
      }

      console.error("Project update failed:", error);
      res.status(400).json({
        error: error.message || "Impossible de modifier le projet.",
      });
    }
  });

  req.pipe(busboy);
});

module.exports = router;
