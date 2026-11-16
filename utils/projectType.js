const PROJECT_TYPES = Object.freeze(["game", "webapp", "tool"]);

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

module.exports = { PROJECT_TYPES, parseProjectType, readStoredType };
