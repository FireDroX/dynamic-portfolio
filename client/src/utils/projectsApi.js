// Client for the paginated public listing (`GET /api/projects`).
export const PROJECTS_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export async function fetchProjectsPage(
  { page = 1, size = PROJECTS_PAGE_SIZE, year, q } = {},
  { signal } = {},
) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (year) params.set("year", String(year));
  if (q) params.set("q", q);

  const response = await fetch(`/api/projects?${params}`, {
    credentials: "include",
    signal,
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

// For the views that need every published project (home terminal,
// achievements): walks the pages instead of relying on one big page.
export async function fetchAllProjects({ signal } = {}) {
  const projects = [];

  for (let page = 1; ; page += 1) {
    const data = await fetchProjectsPage(
      { page, size: MAX_PAGE_SIZE },
      { signal },
    );
    projects.push(...data.items);
    if (page >= data.totalPages) return projects;
  }
}
