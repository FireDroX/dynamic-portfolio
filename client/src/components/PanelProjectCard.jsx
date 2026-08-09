import PanelUploadIcon from "./PanelUploadIcon";
import { useTranslation } from "react-i18next";
import "./styles/PanelProjectCard.css";

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
  const { t, i18n } = useTranslation();
  const isModified = Object.keys(edited).length > 0;
  const imageSrc = edited.imagePreview || project.image;

  return (
    <article className="panel-project-card">
      <div className="panel-project-main">
        <div className="panel-project-image">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={t("panel.previewAlt", { name: project.name })}
            />
          ) : (
            <span>{t("panel.noImage")}</span>
          )}
          <label>
            {t("panel.replace")}
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                onProjectFile(project.fileName, "image", event.target.files[0])
              }
            />
          </label>
        </div>

        <div className="panel-project-editor">
          <div className="panel-project-meta">
            <span>{project.fileName}</span>
            <span>
              {new Date(project.createdAt).toLocaleDateString(
                i18n.resolvedLanguage === "en" ? "en-GB" : "fr-FR",
              )}
            </span>
          </div>
          <label className="panel-field">
            {t("panel.name")}
            <input
              value={edited.name ?? project.name}
              onChange={(event) =>
                onChange(project.fileName, "name", event.target.value)
              }
            />
          </label>
          <label className="panel-field">
            {t("panel.descriptionLabel")}
            <textarea
              rows="4"
              value={edited.description ?? project.description}
              onChange={(event) =>
                onChange(project.fileName, "description", event.target.value)
              }
            />
          </label>

          <div className="panel-project-assets">
            <label className={edited.zip ? "has-file" : ""}>
              <PanelUploadIcon />
              <span>{edited.zip?.name || t("panel.replaceZip")}</span>
              <input
                type="file"
                accept=".zip,application/zip"
                onChange={(event) =>
                  onProjectFile(project.fileName, "zip", event.target.files[0])
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="panel-project-actions">
        <button className="panel-preview-button" onClick={onTogglePreview}>
          {t(isPreviewOpen ? "panel.closePreview" : "panel.previewFiles")}
        </button>
        <a
          href={`/projects/${project.fileName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("panel.viewPage")}
        </a>
        <a
          href={`/api/panel/download/${encodeURIComponent(project.fileName)}`}
          download={`${project.fileName}.zip`}
        >
          {t("panel.downloadZip")}
        </a>
        <div className="panel-project-actions-spacer" />
        <button
          className="panel-delete-button"
          onClick={() => onDelete(project)}
        >
          {t("panel.delete")}
        </button>
        <button
          className="panel-save-button"
          disabled={!isModified || isSaving}
          onClick={() => onSave(project)}
        >
          {t(isSaving ? "panel.saving" : "panel.save")}
        </button>
      </div>

      {isPreviewOpen && (
        <div className="panel-live-preview">
          <div>
            <span>{t("panel.livePreview")}</span>
            <strong>{project.name}</strong>
          </div>
          <iframe
            key={previewVersion}
            src={`/api/projects/${project.fileName}?preview=${previewVersion}`}
            title={t("panel.previewAlt", { name: project.name })}
          />
        </div>
      )}
    </article>
  );
};

export default PanelProjectCard;
