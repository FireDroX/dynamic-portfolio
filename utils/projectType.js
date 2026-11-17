const PROJECT_TYPES = Object.freeze(["game", "webapp", "tool"]);

// Labels shown on the site (client/src/locales/{fr,en}.json, `projectTypes`),
// so the public search finds a project by the type a visitor reads on its card.
const PROJECT_TYPE_LABELS = Object.freeze({
  game: ["Jeu", "Game"],
  webapp: ["Application web", "Web app"],
  tool: ["Outil", "Tool"],
});

// Returns undefined when absent, "" to clear the type, the id when valid,
// and null when the input is invalid so callers can reject it.
function parseProjectType(input) {
  if (input === undefined) return undefined;
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (value === "") return "";
  return PROJECT_TYPES.includes(value) ? value : null;
}

// Reads the `type` column; tolerant of NULL and unknown values.
const readStoredType = (value) =>
  PROJECT_TYPES.includes(value) ? value : null;

// Type ids whose id or displayed label contains the search, case-insensitive.
function findMatchingTypes(search) {
  const needle = String(search ?? "").trim().toLowerCase();
  if (!needle) return [];
  return PROJECT_TYPES.filter((type) =>
    [type, ...PROJECT_TYPE_LABELS[type]].some((label) =>
      label.toLowerCase().includes(needle),
    ),
  );
}

module.exports = {
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  findMatchingTypes,
  parseProjectType,
  readStoredType,
};
