require("dotenv/config");

const cors = require("cors");
const path = require("node:path");
const express = require("express");
const session = require("express-session");

const {
  getProjectBySlug,
  getProjectsCached,
  getPool,
} = require("./utils/functions");

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./api");

const metaCache = {
  projects: null,
  lastFetch: 0,
  ttl: 60 * 1000, // 1 minute
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use(express.static(path.join(__dirname, "client/build"), { index: false }));

app.use(async (req, res) => {
  try {
    let title = "Portfolio Adrien | Développeur React & Node.js";
    let description;
    let image = "https://portfolio.addrien.fr/favicon.svg";

    // PAGE PROJET
    if (req.path.startsWith("/projects/")) {
      const slug = req.path.split("/")[2];
      const project = await getProjectBySlug(slug);

      if (project) {
        title = `${project.name} | Portfolio Adrien`;
        description = project.description;

        // Si tu as une image en DB
        if (project.image) {
          image = `https://portfolio.addrien.fr/og-image/${slug}`;
        }
      } else {
        title = "Projet introuvable | Portfolio Adrien";
        description = "Ce projet n'existe pas ou a été supprimé.";
      }
    }

    // AUTRES PAGES
    else {
      const projects = await getProjectsCached(metaCache);

      description = `
Portfolio d’Adrien — Développeur React & Node.js.
${projects.length} projets web interactifs à découvrir.
Démonstrations en live, interfaces testables et architecture fullstack moderne.`;
    }

    const filePath = path.join(__dirname, "client/build/index.html");
    let html = await require("fs").promises.readFile(filePath, "utf-8");

    html = html
      .replace(/__TITLE__/g, title)
      .replace(/__DESCRIPTION__/g, description)
      .replace(/__IMAGE__/g, image);

    res.send(html);
  } catch (err) {
    console.error(err);
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
