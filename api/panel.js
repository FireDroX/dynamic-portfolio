const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM projects", [], (err, projects) => {
    if (err) return res.send("Erreur DB");

    res.send(`
      <h1>Panel</h1>

      <h2>Ajouter</h2>
      <form method="POST" action="/panel/add" enctype="multipart/form-data">
        <input required name="name" placeholder="Nom du projet (peut contenir des espaces)"/><br/>
        <input required name="description" placeholder="Description"/><br/><br/>

        <label>Image :</label><br/>
        <input type="file" name="image" accept="image/*"/><br/><br/>

        <label>Fichier HTML :</label><br/>
        <input required type="file" name="htmlFile" accept=".html"/><br/><br/>

        <button>Ajouter</button>
      </form>

      <h2>Projets</h2>
      ${projects
        .map(
          (p) => `
        <div>
          <b>${p.name}</b>
          <form method="POST" action="/panel/delete">
            <input type="hidden" name="name" value="${p.name}" />
            <a href="/projects/${p.fileName}">Go</a>
            <img src="${p.image}" />
            <button>Supprimer</button>
          </form>
        </div>
      `,
        )
        .join("")}
    `);
  });
});

module.exports = router;
