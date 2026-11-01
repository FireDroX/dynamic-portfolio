// Idempotent schema upgrades for the `projects` table, run once at startup so
// existing deployments pick up new columns without a manual migration.
const PROJECT_COLUMNS = {
  contributors: "TEXT NULL",
  // Unpublished projects stay in the panel but disappear from the public site.
  published: "TINYINT(1) NOT NULL DEFAULT 1",
};

async function ensureProjectsSchema(pool) {
  const [columns] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects'`,
  );
  const existing = new Set(columns.map((column) => column.COLUMN_NAME));

  for (const [name, definition] of Object.entries(PROJECT_COLUMNS)) {
    if (!existing.has(name)) {
      await pool.query(`ALTER TABLE projects ADD COLUMN ${name} ${definition}`);
    }
  }
}

module.exports = { ensureProjectsSchema };
