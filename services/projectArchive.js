const fs = require("node:fs");
const path = require("node:path");
const stream = require("node:stream");
const unzipper = require("unzipper");

const projectsPath = path.join(__dirname, "../projects");

class ProjectArchiveError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ProjectArchiveError";
    this.statusCode = statusCode;
  }
}

function getProjectSlug(fileName) {
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);
  const slug = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");

  if (!slug) {
    throw new ProjectArchiveError("Le nom du fichier ZIP est invalide.");
  }

  return slug;
}

async function extractProjectArchive(buffer, destination) {
  let archive;

  try {
    archive = await unzipper.Open.buffer(buffer);
  } catch {
    throw new ProjectArchiveError("L'archive ZIP est invalide.");
  }

  for (const entry of archive.files) {
    const normalizedPath = entry.path.replace(/\\/g, "/");
    const segments = normalizedPath.split("/");
    const isAbsolutePath =
      path.posix.isAbsolute(normalizedPath) ||
      /^[a-zA-Z]:\//.test(normalizedPath);

    if (
      isAbsolutePath ||
      segments.includes("..") ||
      entry.type === "SymbolicLink"
    ) {
      throw new ProjectArchiveError(
        "L'archive contient un chemin non autorisé.",
      );
    }
  }

  const hasRootIndex = archive.files.some(
    (entry) =>
      entry.type !== "Directory" &&
      entry.path.replace(/\\/g, "/") === "index.html",
  );
  if (!hasRootIndex) {
    throw new ProjectArchiveError(
      "Le ZIP doit contenir un fichier index.html à sa racine.",
    );
  }

  const readable = new stream.PassThrough();
  readable.end(buffer);
  await readable.pipe(unzipper.Extract({ path: destination })).promise();
}

async function installProjectArchive(buffer, projectSlug) {
  await fs.promises.mkdir(projectsPath, { recursive: true });

  const projectPath = path.join(projectsPath, projectSlug);
  if (fs.existsSync(projectPath)) {
    throw new ProjectArchiveError(
      "Un projet utilisant ce nom de fichier existe déjà.",
      409,
    );
  }

  const temporaryPath = await fs.promises.mkdtemp(
    path.join(projectsPath, `.add-${projectSlug}-`),
  );

  try {
    await extractProjectArchive(buffer, temporaryPath);
    await fs.promises.rename(temporaryPath, projectPath);
  } catch (error) {
    await fs.promises.rm(temporaryPath, { recursive: true, force: true });
    throw error;
  }

  return {
    commit: async () => {},
    rollback: () =>
      fs.promises.rm(projectPath, { recursive: true, force: true }),
  };
}

async function replaceProjectArchive(buffer, projectSlug) {
  await fs.promises.mkdir(projectsPath, { recursive: true });

  const projectPath = path.join(projectsPath, projectSlug);
  const temporaryPath = await fs.promises.mkdtemp(
    path.join(projectsPath, `.update-${projectSlug}-`),
  );
  const backupPath = path.join(
    projectsPath,
    `.backup-${projectSlug}-${Date.now()}`,
  );
  let hasBackup = false;

  try {
    await extractProjectArchive(buffer, temporaryPath);

    if (fs.existsSync(projectPath)) {
      await fs.promises.rename(projectPath, backupPath);
      hasBackup = true;
    }

    await fs.promises.rename(temporaryPath, projectPath);
  } catch (error) {
    await fs.promises.rm(temporaryPath, { recursive: true, force: true });

    if (hasBackup) {
      await fs.promises.rename(backupPath, projectPath);
    }

    throw error;
  }

  return {
    commit: async () => {
      if (hasBackup) {
        await fs.promises.rm(backupPath, { recursive: true, force: true });
        hasBackup = false;
      }
    },
    rollback: async () => {
      await fs.promises.rm(projectPath, { recursive: true, force: true });
      if (hasBackup && fs.existsSync(backupPath)) {
        await fs.promises.rename(backupPath, projectPath);
        hasBackup = false;
      }
    },
  };
}

module.exports = {
  getProjectSlug,
  installProjectArchive,
  replaceProjectArchive,
};
