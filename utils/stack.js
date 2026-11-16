const MAX_STACK = 12;
const MAX_TECH_LENGTH = 30;
const TECH_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .+#/&_-]*$/u;

const normalizeTech = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

const isValidTech = (value) => {
  const tech = normalizeTech(value);
  return tech.length > 0 && tech.length <= MAX_TECH_LENGTH && TECH_PATTERN.test(tech);
};

// Accepts the JSON array sent by the panel (or an already parsed array) and
// returns a deduplicated list of valid technology names.
// Returns null when the input is not a list, so callers can reject it.
function parseStack(input) {
  let list = input;

  if (typeof input === "string") {
    if (!input.trim()) return [];
    try {
      list = JSON.parse(input);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(list)) return null;

  const seen = new Set();
  const stack = [];

  for (const value of list) {
    const tech = normalizeTech(value);
    const key = tech.toLowerCase();
    if (!isValidTech(tech) || seen.has(key)) continue;

    seen.add(key);
    stack.push(tech);
    if (stack.length === MAX_STACK) break;
  }

  return stack;
}

// Reads the value stored in the `stack` column; tolerant of NULL and of
// anything malformed so a bad row never breaks a page.
const readStoredStack = (value) => parseStack(value ?? "") || [];

module.exports = {
  MAX_STACK,
  MAX_TECH_LENGTH,
  normalizeTech,
  isValidTech,
  parseStack,
  readStoredStack,
};
