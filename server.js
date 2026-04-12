require("dotenv/config");

const cors = require("cors");
const path = require("node:path");
const express = require("express");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./api");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://portfolio.addrien.fr";

  try {
    const pool = await require("./db");
    const results = await pool.query`SELECT * FROM projects`;
    const projects = results.recordset;

    const projectUrls = projects
      .map(
        (p) => `
        <url>
          <loc>${baseUrl}/projects/${p.fileName}</loc>
          <lastmod>${new Date(p.createdAt).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `,
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

        <url>
          <loc>${baseUrl}/</loc>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>

        <url>
          <loc>${baseUrl}/projects</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>

        <url>
          <loc>${baseUrl}/about</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>

        <url>
          <loc>${baseUrl}/mentions-legales</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>

        ${projectUrls}

      </urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erreur sitemap");
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
