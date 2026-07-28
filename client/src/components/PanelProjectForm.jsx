import { useEffect, useState } from "react";
import PanelUploadIcon from "./PanelUploadIcon";
import "./styles/PanelProjectForm.css";

const EMPTY_FILES = { image: "", zip: "" };

const PanelProjectForm = ({ isSaving, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState("");
  const [files, setFiles] = useState(EMPTY_FILES);

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const wasAdded = await onSubmit(new FormData(form));
    if (!wasAdded) return;

    form.reset();
    setImagePreview("");
    setFiles(EMPTY_FILES);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setFiles((previous) => ({ ...previous, image: file.name }));
  };

  const handleZipChange = (event) => {
    setFiles((previous) => ({
      ...previous,
      zip: event.target.files[0]?.name || "",
    }));
  };

  return (
    <section className="panel-add-section">
      <div className="panel-section-heading">
        <div>
          <small>Nouveau contenu</small>
          <h2>Ajouter un projet</h2>
        </div>
      </div>

      <form
        className="panel-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="panel-form-fields">
          <label className="panel-field">
            Nom du projet
            <input
              required
              type="text"
              name="name"
              placeholder="Mon nouveau projet"
            />
          </label>
          <label className="panel-field">
            Description
            <textarea
              required
              name="description"
              placeholder="Une courte description du projet"
              rows="5"
            />
          </label>
        </div>

        <div className="panel-new-assets">
          <label className="panel-upload panel-upload--image">
            {imagePreview ? (
              <img src={imagePreview} alt="Nouvel aperçu" />
            ) : (
              <PanelUploadIcon />
            )}
            <strong>{files.image || "Choisir l'image"}</strong>
            <span>PNG, JPG, WEBP</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <label className="panel-upload">
            <PanelUploadIcon />
            <strong>{files.zip || "Choisir les fichiers"}</strong>
            <span>Archive ZIP avec index.html</span>
            <input
              required
              type="file"
              name="zip"
              accept=".zip,application/zip"
              onChange={handleZipChange}
            />
          </label>
        </div>

        <button className="panel-primary-button" disabled={isSaving}>
          {isSaving ? "Publication..." : "Publier le projet"}
          <span>→</span>
        </button>
      </form>
    </section>
  );
};

export default PanelProjectForm;
