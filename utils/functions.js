import { createRequire } from "module";
const require = createRequire(import.meta.url);

let pool;

export async function getPool() {
  if (!pool) {
    pool = require("../db");
  }
  return pool;
}

export async function getProjectsCached(metaCache) {
  if (!metaCache.projects || Date.now() - metaCache.lastFetch > metaCache.ttl) {
    const pool = await getPool();

    const [rows] = await pool.query("SELECT * FROM projects");

    metaCache.projects = rows;
    metaCache.lastFetch = Date.now();
  }

  return metaCache.projects;
}

// Public lookup: unpublished projects are treated as missing.
export async function getPublishedProjectBySlug(slug) {
  const pool = await getPool();

  const [rows] = await pool.query(
    "SELECT * FROM projects WHERE fileName = ? AND published = 1",
    [slug],
  );

  return rows[0] || null;
}
