const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

const Busboy = require("busboy");
const unzipper = require("unzipper");
const stream = require("stream");

router.post("/", auth, (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  let name = "";
  let description = "";
  let imageBase64 = "";
  let zipFileName = "";
  let zipBuffer = [];

  busboy.on("field", (fieldname, val) => {
    if (fieldname === "name") name = val;
    if (fieldname === "description") description = val;
  });

  busboy.on("file", (fieldname, file, info) => {
    const { filename, mimeType } = info;

    if (fieldname === "zip") {
      zipFileName = filename;

      file.on("data", (data) => {
        zipBuffer.push(data);
      });
    } else if (fieldname === "image") {
      const imageBuffer = [];

      file.on("data", (data) => {
        imageBuffer.push(data);
      });

      file.on("end", () => {
        const finalBuffer = Buffer.concat(imageBuffer);
        imageBase64 = `data:${mimeType};base64,${finalBuffer.toString("base64")}`;
      });
    } else {
      file.resume();
    }
  });

  busboy.on("finish", async () => {
    try {
      const folderName = zipFileName
        .replace(".zip", "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const extractPath = path.join(__dirname, "../projects", folderName);

      fs.mkdirSync(extractPath, { recursive: true });

      const buffer = Buffer.concat(zipBuffer);

      const readable = new stream.PassThrough();
      readable.end(buffer);

      await readable.pipe(unzipper.Extract({ path: extractPath })).promise();

      db.run(
        "INSERT INTO projects (name, description, fileName, image) VALUES (?, ?, ?, ?)",
        [name, description, folderName, imageBase64],
        function () {
          res.redirect("/panel");
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur extraction ZIP" });
    }
  });

  req.pipe(busboy);
});

module.exports = router;
