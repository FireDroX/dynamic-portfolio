// Idempotent schema upgrades for the `projects` table, run once at startup so
// existing deployments pick up new columns without a manual migration.
async function ensureProjectsSchema(pool) {
  const [columns] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects'
       AND COLUMN_NAME = 'contributors'`,
  );

  if (!columns.length) {
    await pool.query("ALTER TABLE projects ADD COLUMN contributors TEXT NULL");
  }
}

module.exports = { ensureProjectsSchema };
