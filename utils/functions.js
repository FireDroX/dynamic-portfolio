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

export async function getProjectBySlug(slug) {
  const pool = await getPool();

  const [rows] = await pool.query("SELECT * FROM projects WHERE fileName = ?", [
    slug,
  ]);

  return rows[0] || null;
}
