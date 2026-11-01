// GitHub logins: 1-39 alphanumeric characters or single hyphens, no leading,
// trailing or doubled hyphen.
const GITHUB_LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const MAX_CONTRIBUTORS = 20;

const normalizeLogin = (value) =>
  typeof value === "string" ? value.trim().replace(/^@/, "") : "";

const isGithubLogin = (value) => GITHUB_LOGIN.test(normalizeLogin(value));

// Accepts the JSON array sent by the panel (or an already parsed array) and
// returns a deduplicated list of valid logins, without the leading "@".
// Returns null when the input is not a list, so callers can reject it.
function parseContributors(input) {
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
  const contributors = [];

  for (const value of list) {
    const login = normalizeLogin(value);
    const key = login.toLowerCase();
    if (!GITHUB_LOGIN.test(login) || seen.has(key)) continue;

    seen.add(key);
    contributors.push(login);
    if (contributors.length === MAX_CONTRIBUTORS) break;
  }

  return contributors;
}

// Reads the value stored in the `contributors` column; tolerant of NULL and
// of anything malformed so a bad row never breaks a page.
const readStoredContributors = (value) => parseContributors(value ?? "") || [];

module.exports = {
  MAX_CONTRIBUTORS,
  isGithubLogin,
  parseContributors,
  readStoredContributors,
};
