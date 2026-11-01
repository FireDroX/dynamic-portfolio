// Same rule as the backend (utils/contributors.js): 1-39 alphanumeric
// characters or single hyphens, no leading, trailing or doubled hyphen.
const GITHUB_LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const MAX_CONTRIBUTORS = 20;

export const normalizeLogin = (value) => value.trim().replace(/^@/, "");

export const isGithubLogin = (value) => GITHUB_LOGIN.test(normalizeLogin(value));

export const githubProfileUrl = (login) =>
  `https://github.com/${encodeURIComponent(login)}`;

export const githubAvatarUrl = (login, size = 64) =>
  `https://github.com/${encodeURIComponent(login)}.png?size=${size}`;

export const getContributors = (project) =>
  Array.isArray(project?.contributors) ? project.contributors : [];
