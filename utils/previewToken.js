const crypto = require("node:crypto");

// The panel preview iframe is sandboxed without allow-same-origin, so the
// requests for the project's scripts and assets do not carry the admin
// session cookie. A short-lived signed token in the URL path lets the panel
// preview a project even while it is unpublished; relative asset URLs keep
// the token since they resolve against the same base path.
const PREVIEW_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const sign = (slug, expiresAt, secret) =>
  crypto
    .createHmac("sha256", secret)
    .update(`project-preview:${slug}:${expiresAt}`)
    .digest("base64url");

function createPreviewToken(
  slug,
  { now = Date.now(), secret = process.env.SESSION_SECRET } = {},
) {
  const expiresAt = now + PREVIEW_TOKEN_TTL_MS;
  return `${expiresAt.toString(36)}.${sign(slug, expiresAt, secret)}`;
}

function verifyPreviewToken(
  token,
  slug,
  { now = Date.now(), secret = process.env.SESSION_SECRET } = {},
) {
  const [encodedExpiry, signature] = String(token || "").split(".");
  const expiresAt = parseInt(encodedExpiry, 36);
  if (!signature || !Number.isSafeInteger(expiresAt) || expiresAt < now) {
    return false;
  }

  const expected = Buffer.from(sign(slug, expiresAt, secret));
  const received = Buffer.from(signature);
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}

const getPreviewUrl = (slug, options) =>
  `/api/panel/preview/${createPreviewToken(slug, options)}/${slug}/`;

module.exports = {
  PREVIEW_TOKEN_TTL_MS,
  createPreviewToken,
  getPreviewUrl,
  verifyPreviewToken,
};
