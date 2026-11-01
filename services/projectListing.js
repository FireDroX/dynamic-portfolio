// Public, paginated listing of published projects (`GET /api/projects`).

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

// Columns safe to expose publicly: the base64 image is replaced by a flag,
// the image itself is served by `/api/projects/:project/image`.
const PUBLIC_PROJECT_COLUMNS = `id, name, descriptionFr, descriptionEn, fileName, createdAt, contributors,
  (image LIKE 'data:image/%;base64,%'
    AND MOD(CHAR_LENGTH(SUBSTRING_INDEX(image, ',', -1)), 4) = 0) AS hasImage`;

const toPositiveInteger = (value, fallback) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
};

// Invalid or missing values fall back to defaults instead of failing:
// a stale or hand-edited URL should still show a page.
function parseProjectListQuery(query = {}) {
  const page = toPositiveInteger(query.page, 1);
  const size = Math.min(
    toPositiveInteger(query.size, DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );
  const year = /^\d{4}$/.test(String(query.year ?? ""))
    ? Number(query.year)
    : null;
  const search =
    typeof query.q === "string"
      ? query.q.trim().slice(0, MAX_SEARCH_LENGTH)
      : "";

  return { page, size, year, search };
}

const escapeLike = (value) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

function buildProjectFilters({ year, search }) {
  const conditions = ["published = 1"];
  const params = [];

  if (year) {
    conditions.push("YEAR(createdAt) = ?");
    params.push(year);
  }
  if (search) {
    const pattern = `%${escapeLike(search)}%`;
    conditions.push(
      "(name LIKE ? OR fileName LIKE ? OR descriptionFr LIKE ? OR descriptionEn LIKE ?)",
    );
    params.push(pattern, pattern, pattern, pattern);
  }

  return { where: conditions.join(" AND "), params };
}

async function listPublishedProjects(pool, query) {
  const options = parseProjectListQuery(query);
  const { where, params } = buildProjectFilters(options);

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM projects WHERE ${where}`,
    params,
  );
  const [items] = await pool.query(
    `SELECT ${PUBLIC_PROJECT_COLUMNS}
     FROM projects
     WHERE ${where}
     ORDER BY createdAt DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...params, options.size, (options.page - 1) * options.size],
  );
  // Year facets ignore the active filters so every year button keeps its count.
  const [years] = await pool.query(
    `SELECT YEAR(createdAt) AS year, COUNT(*) AS count
     FROM projects
     WHERE published = 1
     GROUP BY YEAR(createdAt)
     ORDER BY year DESC`,
  );

  const totalCount = Number(total);

  return {
    items,
    page: options.page,
    size: options.size,
    total: totalCount,
    totalPages: Math.ceil(totalCount / options.size),
    years: years.map((row) => ({
      year: Number(row.year),
      count: Number(row.count),
    })),
  };
}

module.exports = {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PUBLIC_PROJECT_COLUMNS,
  buildProjectFilters,
  listPublishedProjects,
  parseProjectListQuery,
};
