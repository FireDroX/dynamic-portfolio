const Busboy = require("busboy");
const { parseImageDataUrl } = require("../utils/images");

const MAX_FILE_SIZE = 100 * 1024 * 1024;

class ProjectUploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProjectUploadError";
    this.statusCode = 400;
  }
}

function parseProjectUpload(req) {
  return new Promise((resolve, reject) => {
    let parser;

    try {
      parser = Busboy({
        headers: req.headers,
        limits: {
          fileSize: MAX_FILE_SIZE,
          files: 2,
          fields: 5,
          fieldSize: 64 * 1024,
        },
      });
    } catch {
      reject(new ProjectUploadError("Formulaire invalide."));
      return;
    }

    const fields = {};
    let image = null;
    let zip = null;
    let uploadError = null;

    parser.on("field", (name, value) => {
      fields[name] = value;
    });

    parser.on("file", (name, file, info) => {
      if (name !== "image" && name !== "zip") {
        file.resume();
        return;
      }

      const chunks = [];

      file.on("data", (chunk) => chunks.push(chunk));
      file.on("limit", () => {
        uploadError = new ProjectUploadError(
          "Un fichier dépasse la limite de 100 Mo.",
        );
      });
      file.on("error", reject);
      file.on("end", () => {
        if (!info.filename || uploadError) return;

        const buffer = Buffer.concat(chunks);

        if (name === "image") {
          if (!info.mimeType.startsWith("image/")) {
            uploadError = new ProjectUploadError(
              "Le fichier image n'est pas valide.",
            );
            return;
          }

          const dataUrl = `data:${info.mimeType};base64,${buffer.toString("base64")}`;
          if (!parseImageDataUrl(dataUrl)) {
            uploadError = new ProjectUploadError(
              "Le fichier image est incomplet ou invalide.",
            );
            return;
          }

          image = dataUrl;
        }

        if (name === "zip") {
          zip = {
            buffer,
            fileName: info.filename,
          };
        }
      });
    });

    parser.on("filesLimit", () => {
      uploadError = new ProjectUploadError("Trop de fichiers ont été envoyés.");
    });
    parser.on("fieldsLimit", () => {
      uploadError = new ProjectUploadError("Trop de champs ont été envoyés.");
    });
    parser.on("error", reject);
    parser.on("finish", () => {
      if (uploadError) {
        reject(uploadError);
        return;
      }

      resolve({ fields, image, zip });
    });

    req.pipe(parser);
  });
}

module.exports = {
  parseProjectUpload,
};
