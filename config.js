const SITE_URL = (
  process.env.SITE_URL || "https://portfolio.addrien.fr"
).replace(/\/$/, "");

const allowedHostnames = new Set(
  (
    process.env.SITE_HOSTNAMES ||
    "addrien.fr,portfolio.addrien.fr,localhost,127.0.0.1"
  )
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean),
);

const getSiteUrl = (req) => {
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost = forwardedHost || req.get("host") || "";
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

module.exports = { SITE_URL, getSiteUrl };
