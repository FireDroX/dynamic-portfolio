const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const db = require("../db");
const auth = require("../middleware/auth");
const Busboy = require("busboy");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let name = "";
  let description = "";
  let imageBase64 = "";
  let htmlContent = "";
  let htmlFileName = "";

  busboy.on("field", (fieldname, val) => {
    if (fieldname === "name") name = val;
    if (fieldname === "description") description = val;
  });

  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;

    let buffers = [];

    file.on("data", (data) => {
      buffers.push(data);
    });

    file.on("end", () => {
      const fileBuffer = Buffer.concat(buffers);

      if (fieldname === "image") {
        imageBase64 = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
      }

      if (fieldname === "htmlFile") {
        htmlContent = fileBuffer.toString("utf-8");
        htmlFileName = filename;
      }
    });
  });

  busboy.on("finish", () => {
    if (!name || !htmlContent) {
      return res.send("Champs manquants");
    }

    const safeFileName = htmlFileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const filePath = path.join(__dirname, "../projects", safeFileName);

    fs.writeFile(filePath, htmlContent, (err) => {
      if (err) return res.send("Erreur écriture fichier");

      db.run(
        "INSERT INTO projects (name, fileName, description, image) VALUES (?, ?, ?, ?)",
        [name, safeFileName.split(".html")[0], description, imageBase64],
        (err) => {
          if (err) return res.send("Erreur DB");

          res.redirect("/panel");
        },
      );
    });
  });

  req.pipe(busboy);
});

module.exports = router;
