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
    const results = await pool.query`SELECT * FROM projects`;
    metaCache.projects = results.recordset;
    metaCache.lastFetch = Date.now();
  }

  return metaCache.projects;
}

export async function getProjectBySlug(slug) {
  const pool = await getPool();
  const result =
    await pool.query`SELECT * FROM projects WHERE fileName = ${slug}`;
  return result.recordset[0];
}
