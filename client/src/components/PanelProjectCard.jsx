export const UploadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 16.5v-9m0 0-3.5 3.5M12 7.5l3.5 3.5M5 15.75v2A2.25 2.25 0 0 0 7.25 20h9.5A2.25 2.25 0 0 0 19 17.75v-2" />
  </svg>
);

const PanelProjectCard = ({
  project,
  edited,
  isPreviewOpen,
  previewVersion,
  isSaving,
  onChange,
  onProjectFile,
  onTogglePreview,
  onDelete,
  onSave,
}) => {
  const isModified = Object.keys(edited).length > 0;
  const imageSrc = edited.imagePreview || project.image;

  return (
    <article className="panel-project-card">
      <div className="panel-project-main">
        <div className="panel-project-image">
          {imageSrc ? (
            <img src={imageSrc} alt={`Aperçu de ${project.name}`} />
          ) : (
            <span>Aucune image</span>
          )}
          <label>
            Remplacer
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onProjectFile(
                project.fileName,
                "image",
                event.target.files[0],
              )}
            />
          </label>
        </div>

        <div className="panel-project-editor">
          <div className="panel-project-meta">
            <span>{project.fileName}</span>
            <span>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
          <label>
            Nom
            <input
              value={edited.name ?? project.name}
              onChange={(event) => onChange(project.fileName, "name", event.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={edited.description ?? project.description}
              onChange={(event) => onChange(project.fileName, "description", event.target.value)}
            />
          </label>

          <div className="panel-project-assets">
            <label className={edited.zip ? "has-file" : ""}>
              <UploadIcon />
              <span>{edited.zip?.name || "Remplacer le ZIP du projet"}</span>
              <input
                type="file"
                accept=".zip,application/zip"
                onChange={(event) => onProjectFile(
                  project.fileName,
                  "zip",
                  event.target.files[0],
                )}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="panel-project-actions">
        <button className="panel-preview-button" onClick={onTogglePreview}>
          {isPreviewOpen ? "Fermer l'aperçu" : "Prévisualiser les fichiers"}
        </button>
        <a href={`/projects/${project.fileName}`} target="_blank" rel="noopener noreferrer">
          Voir la page ↗
        </a>
        <a
          href={`/api/panel/download/${encodeURIComponent(project.fileName)}`}
          download={`${project.fileName}.zip`}
        >
          Télécharger le ZIP
        </a>
        <div className="panel-project-actions-spacer" />
        <button className="panel-delete-button" onClick={() => onDelete(project)}>
          Supprimer
        </button>
        <button
          className="panel-save-button"
          disabled={!isModified || isSaving}
          onClick={() => onSave(project)}
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {isPreviewOpen && (
        <div className="panel-live-preview">
          <div>
            <span>Aperçu live</span>
            <strong>{project.name}</strong>
          </div>
          <iframe
            key={previewVersion}
            src={`/api/projects/${project.fileName}?preview=${previewVersion}`}
            title={`Aperçu de ${project.name}`}
          />
        </div>
      )}
    </article>
  );
};

export default PanelProjectCard;
