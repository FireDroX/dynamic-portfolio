require("dotenv/config");

const cors = require("cors");
const compression = require("compression");
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const { getProjectBySlug } = require("./utils/functions");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const routes = require("./api");
const { getSiteUrl } = require("./config");

const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
    createDatabaseTable: true,
  },
  db,
);

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    },
  }),
);
app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/robots.txt", (req, res) => {
  const siteUrl = getSiteUrl(req);
  res.type("text/plain").send(`User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml

Disallow: /api/
Disallow: /panel/`);
});

app.use("/", routes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Route API introuvable" });
});

app.use(express.static(path.join(__dirname, "client/build"), { index: false }));

app.use(async (req, res) => {
  try {
    const pathWithoutTrailingSlash = req.path.replace(/\/$/, "") || "/";
    const staticPages = {
      "/": {
        title: "Adrien | Développeur React & Node.js",
        description:
          "Adrien conçoit des applications web, des jeux et des expériences interactives avec React et Node.js. Découvrez ses projets directement en ligne.",
      },
      "/projects": {
        title: "Projets web interactifs | Portfolio Adrien",
        description:
          "Découvrez les projets web d’Adrien : applications React, expériences interactives et créations full-stack testables en ligne.",
      },
      "/about": {
        title: "À propos d’Adrien | Développeur web",
        description:
          "Découvrez le parcours, la façon de travailler et la boîte à outils d’Adrien, étudiant à l’ESGI Paris et développeur web.",
      },
      "/mentions-legales": {
        title: "Mentions légales | Portfolio Adrien",
        description:
          "Mentions légales et politique de confidentialité du portfolio d’Adrien.",
      },
      "/achievements": {
        title: "Secrets et achievements | Portfolio Adrien",
        description: "Les secrets cachés dans le portfolio d’Adrien.",
        robots: "noindex, follow",
      },
    };

    const siteUrl = getSiteUrl(req);
    let meta = staticPages[pathWithoutTrailingSlash];
    let status = 200;
    let image = `${siteUrl}/og-image`;

    const projectMatch = pathWithoutTrailingSlash.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      const slug = projectMatch[1];
      const project = await getProjectBySlug(slug);

      if (project) {
        meta = {
          title: `${project.name} | Portfolio Adrien`,
          description: project.description,
        };
        if (project.image) {
          image = `${siteUrl}/og-image/${encodeURIComponent(slug)}`;
        }
      } else {
        status = 404;
        meta = {
          title: "Projet introuvable | Portfolio Adrien",
          description: "Ce projet n’existe pas ou a été supprimé.",
          robots: "noindex, nofollow",
        };
      }
    } else if (pathWithoutTrailingSlash.startsWith("/panel")) {
      meta = {
        title: "Administration | Portfolio Adrien",
        description: "Espace d’administration du portfolio.",
        robots: "noindex, nofollow",
      };
    } else if (!meta) {
      status = 404;
      meta = {
        title: "Page introuvable | Portfolio Adrien",
        description: "La page demandée n’existe pas.",
        robots: "noindex, nofollow",
      };
    }

    const filePath = path.join(__dirname, "client/build/index.html");
    let html = await require("fs").promises.readFile(filePath, "utf-8");
    const canonicalUrl = `${siteUrl}${pathWithoutTrailingSlash === "/" ? "" : pathWithoutTrailingSlash}`;
    const escapeAttribute = (value) =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\s+/g, " ")
        .trim();
    const replaceToken = (source, token, value) =>
      source.replace(new RegExp(token, "g"), () => escapeAttribute(value));

    html = replaceToken(html, "__TITLE__", meta.title);
    html = replaceToken(html, "__DESCRIPTION__", meta.description);
    html = replaceToken(html, "__IMAGE__", image);
    html = replaceToken(html, "__URL__", canonicalUrl);
    html = replaceToken(html, "__ORIGIN__", siteUrl);
    html = replaceToken(html, "__ROBOTS__", meta.robots || "index, follow");

    res.status(status).send(html);
  } catch (err) {
    console.error(err);
    res.status(500).sendFile(path.join(__dirname, "client/build/index.html"));
  }
});

sessionStore
  .onReady()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MySQL session store initialization failed:", error);
    process.exitCode = 1;
  });
