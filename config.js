const SITE_URL = (
  process.env.SITE_URL || "https://addrien.fr"
).replace(/\/$/, "");

const canonicalHostname = new URL(SITE_URL).hostname.toLowerCase();

const allowedHostnames = new Set(
  (
    process.env.SITE_HOSTNAMES ||
    "addrien.fr,portfolio.addrien.fr,localhost,127.0.0.1"
  )
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean),
);

const getRequestHost = (req) => {
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0].trim();
  return forwardedHost || req.get("host") || "";
};

const getRequestHostname = (req) =>
  getRequestHost(req).replace(/:\d+$/, "").toLowerCase();

const getSiteUrl = (req) => {
  const requestHost = getRequestHost(req);
  const hostname = requestHost.replace(/:\d+$/, "").toLowerCase();

  if (!allowedHostnames.has(hostname)) return SITE_URL;

  const forwardedProtocol = req
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim()
    .toLowerCase();
  const requestProtocol = forwardedProtocol || req.protocol;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const protocol = isLocal && requestProtocol === "http" ? "http" : "https";
  const authority = isLocal ? requestHost : hostname;

  return `${protocol}://${authority}`;
};

// Consolidates duplicate-content domains (e.g. portfolio.addrien.fr) onto the
// single canonical host from SITE_URL, so Google indexes one domain instead
// of splitting authority across several that serve the same content.
const getCanonicalRedirectUrl = (req) => {
  const hostname = getRequestHostname(req);
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (hostname === canonicalHostname || isLocal) return null;
  if (!allowedHostnames.has(hostname)) return null;

  return `https://${canonicalHostname}${req.originalUrl}`;
};

module.exports = { SITE_URL, getSiteUrl, getCanonicalRedirectUrl };
