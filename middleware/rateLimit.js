const { ipKeyGenerator, rateLimit } = require("express-rate-limit");

const GLOBAL_THROTTLE_TTL_MS = 60000;
const GLOBAL_THROTTLE_LIMIT = 100;

// Loading one page or one game pulls many files, so only the routes doing real
// work are counted. A project's `meta` and `image` routes are not static files.
const STATIC_FILE_PATHS = [
  /^\/assets\//,
  /^\/api\/panel\/preview\//,
  /^\/api\/projects\/[^/]+\/(?!(?:meta|image)\/?$).+/i,
];

const isStaticFileRequest = (req) =>
  STATIC_FILE_PATHS.some((pattern) => pattern.test(req.path));

// Cloudflare sets this header to the visitor's address however many proxies
// follow it, where req.ip depends on `trust proxy` matching the exact hop count.
// A wrong count would put every visitor in one bucket. The container only
// listens on the host's loopback, so the header cannot be sent from outside.
const getClientKey = (req) =>
  ipKeyGenerator(req.get("cf-connecting-ip") || req.ip);

const globalLimiter = rateLimit({
  windowMs: GLOBAL_THROTTLE_TTL_MS,
  limit: GLOBAL_THROTTLE_LIMIT,
  skip: isStaticFileRequest,
  keyGenerator: getClientKey,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez plus tard." },
});

module.exports = {
  GLOBAL_THROTTLE_LIMIT,
  GLOBAL_THROTTLE_TTL_MS,
  getClientKey,
  globalLimiter,
};
