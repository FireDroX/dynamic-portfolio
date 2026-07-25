require("dotenv/config");

const fs = require("fs");
const path = require("path");
const db = require("../db");
const { renderPortfolioOg } = require("../utils/og");

const outputPath = path.join(
  __dirname,
  "..",
  "client",
  "public",
  "preview.png",
);

async function generatePreview() {
  const [projects] = await db.query(`
    SELECT fileName, createdAt
    FROM projects
    ORDER BY fileName
  `);

  fs.writeFileSync(outputPath, renderPortfolioOg(projects));
  console.log(`Open Graph preview generated: ${outputPath}`);
  await db.end();
}

generatePreview().catch(async (error) => {
  console.error("Open Graph preview generation failed:", error);
  await db.end();
  process.exitCode = 1;
});
