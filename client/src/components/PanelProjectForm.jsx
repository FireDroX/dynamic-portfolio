import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ContributorsInput from "./ContributorsInput";
import PanelUploadIcon from "./PanelUploadIcon";
import "./styles/PanelProjectForm.css";

const EMPTY_FILES = { image: "", zip: "" };

const PanelProjectForm = ({ isSaving, onSubmit }) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState("");
  const [files, setFiles] = useState(EMPTY_FILES);
  const [contributors, setContributors] = useState([]);

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
    setContributors([]);
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
          <small>{t("panel.newContent")}</small>
          <h2>{t("panel.addProject")}</h2>
        </div>
      </div>

      <form
        className="panel-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="panel-form-fields">
          <label className="panel-field">
            {t("panel.projectName")}
            <input
              required
              type="text"
              name="name"
              placeholder={t("panel.projectNamePlaceholder")}
            />
          </label>
          <div className="panel-description-fields">
            <label className="panel-field">
              {t("panel.descriptionFrLabel")}
              <textarea
                required
                name="descriptionFr"
                placeholder={t("panel.descriptionFrPlaceholder")}
                rows="5"
              />
            </label>
            <label className="panel-field">
              {t("panel.descriptionEnLabel")}
              <textarea
                required
                name="descriptionEn"
                placeholder={t("panel.descriptionEnPlaceholder")}
                rows="5"
              />
            </label>
          </div>
          <ContributorsInput
            name="contributors"
            value={contributors}
            onChange={setContributors}
          />
          <label className="panel-field">
            {t("panel.status")}
            <select name="published" defaultValue="1">
              <option value="1">{t("panel.statusPublished")}</option>
              <option value="0">{t("panel.statusUnpublished")}</option>
            </select>
          </label>
        </div>

        <div className="panel-new-assets">
          <label className="panel-upload panel-upload--image">
            {imagePreview ? (
              <img src={imagePreview} alt={t("panel.newPreview")} />
            ) : (
              <PanelUploadIcon />
            )}
            <strong>{files.image || t("panel.chooseImage")}</strong>
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
            <strong>{files.zip || t("panel.chooseFiles")}</strong>
            <span>{t("panel.zipHelp")}</span>
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
          {t(isSaving ? "panel.publishing" : "panel.publish")}
          <span>→</span>
        </button>
      </form>
    </section>
  );
};

export default PanelProjectForm;
