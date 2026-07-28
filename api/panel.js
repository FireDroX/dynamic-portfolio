const { getPool } = require("../utils/functions");
const express = require("express");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const auth = require("../middleware/auth");
const { parseImageDataUrl } = require("../utils/images");

const router = express.Router();
const projectsPath = path.join(__dirname, "../projects");

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return crc >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const getProjectFiles = async (directory, relativePath = "") => {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryRelativePath = path.posix.join(relativePath, entry.name);
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await getProjectFiles(entryPath, entryRelativePath));
    } else if (entry.isFile()) {
      files.push({ name: entryRelativePath, data: await fs.promises.readFile(entryPath) });
    }
  }

  return files;
};

const createZip = (files) => {
  const localFiles = [];
  const centralDirectory = [];
  let offset = 0;

  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const compressed = zlib.deflateRawSync(file.data);
    const checksum = crc32(file.data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(file.data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);

    localFiles.push(localHeader, name, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(file.data.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt32LE(offset, 42);
    centralDirectory.push(centralHeader, name);

    offset += localHeader.length + name.length + compressed.length;
  }

  const centralDirectorySize = centralDirectory.reduce((size, part) => size + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectorySize, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...localFiles, ...centralDirectory, end]);
};

// GET all projects
router.get("/", auth, async (req, res) => {
  const db = await getPool();

  try {
    const [rows] = await db.query("SELECT * FROM projects");
    res.json(
      rows.map((project) => ({
        ...project,
        image: parseImageDataUrl(project.image) ? project.image : "",
      })),
    );
  } catch (error) {
    return res.send("Erreur DB");
  }
});

router.get("/download/:project", auth, async (req, res) => {
  const projectName = req.params.project.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!projectName || projectName !== req.params.project) {
    return res.status(400).json({ error: "Projet invalide" });
  }

  const projectPath = path.join(projectsPath, projectName);

  try {
    if (!(await fs.promises.stat(projectPath)).isDirectory()) {
      return res.status(404).json({ error: "Projet introuvable" });
    }

    const zip = createZip(await getProjectFiles(projectPath));
    res.attachment(`${projectName}.zip`);
    res.type("application/zip");
    return res.send(zip);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Projet introuvable" });
    }
    return res.status(500).json({ error: "Téléchargement impossible" });
  }
});

module.exports = router;
