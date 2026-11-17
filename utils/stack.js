const MAX_STACK = 12;
const MAX_TECH_LENGTH = 30;
const TECH_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .+#/&_-]*$/u;

const normalizeTech = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

const isValidTech = (value) => {
  const tech = normalizeTech(value);
  return tech.length > 0 && tech.length <= MAX_TECH_LENGTH && TECH_PATTERN.test(tech);
};

// Accepts a JSON array string (or an already parsed array); an empty string
// is an empty list. Returns null when the input is not a list.
function toList(input) {
  if (typeof input !== "string") return Array.isArray(input) ? input : null;
  if (!input.trim()) return [];
  try {
    const list = JSON.parse(input);
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
}

// Normalized names, deduplicated case-insensitively (first spelling wins).
function dedupe(list) {
  const seen = new Set();
  const stack = [];
  for (const value of list) {
    const tech = normalizeTech(value);
    const key = tech.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    stack.push(tech);
  }
  return stack;
}

// Validates the stack sent by the panel. Strict: an invalid entry or more
// than MAX_STACK technologies rejects the whole list (null) instead of being
// silently dropped, so the client learns its data would be lost.
function parseStack(input) {
  const list = toList(input);
  if (!list || !list.every(isValidTech)) return null;

  const stack = dedupe(list);
  return stack.length > MAX_STACK ? null : stack;
}

// Reads the value stored in the `stack` column; tolerant of NULL and of
// anything malformed so a bad row never breaks a page.
const readStoredStack = (value) => {
  const list = toList(value ?? "");
  if (!list) return [];
  return dedupe(list.filter(isValidTech)).slice(0, MAX_STACK);
};

module.exports = {
  MAX_STACK,
  TECH_PATTERN,
  MAX_TECH_LENGTH,
  normalizeTech,
  isValidTech,
  parseStack,
  readStoredStack,
};
