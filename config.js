const SITE_URL = (process.env.SITE_URL || "https://portfolio.addrien.fr").replace(
  /\/$/,
  "",
);

module.exports = { SITE_URL };
