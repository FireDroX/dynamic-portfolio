import "./styles/Panel.css";
import { useCallback, useEffect, useState } from "react";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 16.5v-9m0 0-3.5 3.5M12 7.5l3.5 3.5M5 15.75v2A2.25 2.25 0 0 0 7.25 20h9.5A2.25 2.25 0 0 0 19 17.75v-2" />
  </svg>
);

const Panel = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [editedProjects, setEditedProjects] = useState({});
  const [openPreviews, setOpenPreviews] = useState({});
  const [previewVersions, setPreviewVersions] = useState({});
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [newFiles, setNewFiles] = useState({ image: "", zip: "" });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/panel", { credentials: "include" });

      if (res.status === 401) {
        onLogout();
        return;
      }

      if (!res.ok) throw new Error("Chargement impossible");
      setProjects(await res.json());
    } catch {
      setNotice({ type: "error", text: "Impossible de charger les projets." });
    }
  }, [onLogout]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleChange = (fileName, field, value) => {
    setEditedProjects((previous) => ({
      ...previous,
      [fileName]: { ...previous[fileName], [field]: value },
    }));
  };

  const handleProjectFile = (fileName, field, file) => {
    if (!file) return;

    setEditedProjects((previous) => {
      const current = previous[fileName] || {};
      if (field === "image" && current.imagePreview) {
        URL.revokeObjectURL(current.imagePreview);
      }

      return {
        ...previous,
        [fileName]: {
          ...current,
          [field]: file,
          ...(field === "image" ? { imagePreview: URL.createObjectURL(file) } : {}),
        },
      };
    });
  };

  const handleSave = async (project) => {
    const updated = editedProjects[project.fileName];
    if (!updated) return;

    const formData = new FormData();
    formData.append("originalFileName", project.fileName);
    formData.append("name", updated.name ?? project.name);
    formData.append("description", updated.description ?? project.description);
    if (updated.image) formData.append("image", updated.image);
    if (updated.zip) formData.append("zip", updated.zip);

    setSaving(project.fileName);
    setNotice(null);

    try {
      const res = await fetch("/api/panel/modify", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Modification impossible");

      if (updated.imagePreview) URL.revokeObjectURL(updated.imagePreview);
      setEditedProjects((previous) => {
        const copy = { ...previous };
        delete copy[project.fileName];
        return copy;
      });
      setPreviewVersions((previous) => ({
        ...previous,
        [project.fileName]: Date.now(),
      }));
      setNotice({ type: "success", text: `${project.name} a bien été mis à jour.` });
      await fetchProjects();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving("");
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Supprimer définitivement « ${project.name} » ?`)) return;

    const res = await fetch("/api/panel/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: project.name }),
      credentials: "include",
    });

    if (res.ok) {
      setNotice({ type: "success", text: `${project.name} a été supprimé.` });
      fetchProjects();
    } else {
      setNotice({ type: "error", text: "La suppression a échoué." });
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving("new");
    setNotice(null);

    try {
      const res = await fetch("/api/panel/add", {
        method: "POST",
        credentials: "include",
        body: new FormData(form),
      });
      if (!res.ok) throw new Error("Impossible d'ajouter le projet.");

      form.reset();
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
      setNewImagePreview("");
      setNewFiles({ image: "", zip: "" });
      setNotice({ type: "success", text: "Le projet a bien été ajouté." });
      await fetchProjects();
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving("");
    }
  };

  return (
    <main className="App panel-page">
      <header className="panel-header">
        <div>
          <small>espace privé</small>
          <h1>Panel</h1>
          <p>Publie et maintiens les expériences visibles sur le portfolio.</p>
        </div>
        <button
          className="panel-logout"
          onClick={async () => {
            await fetch("/api/panel/login/logout", { method: "POST", credentials: "include" });
            onLogout();
          }}
        >
          Déconnexion
        </button>
      </header>

      {notice && (
        <div className={`panel-notice panel-notice--${notice.type}`} role="status">
          {notice.text}
          <button onClick={() => setNotice(null)} aria-label="Fermer">×</button>
        </div>
      )}

      <section className="panel-add-section">
        <div className="panel-section-heading">
          <div>
            <small>Nouveau contenu</small>
            <h2>Ajouter un projet</h2>
          </div>
        </div>

        <form className="panel-form" onSubmit={handleAdd} encType="multipart/form-data">
          <div className="panel-form-fields">
            <label>
              Nom du projet
              <input required type="text" name="name" placeholder="Mon nouveau projet" />
            </label>
            <label>
              Description
              <textarea required name="description" placeholder="Une courte description du projet" rows="5" />
            </label>
          </div>

          <div className="panel-new-assets">
            <label className="panel-upload panel-upload--image">
              {newImagePreview ? (
                <img src={newImagePreview} alt="Nouvel aperçu" />
              ) : (
                <UploadIcon />
              )}
              <strong>{newFiles.image || "Choisir l'image"}</strong>
              <span>PNG, JPG, WEBP</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (!file) return;
                  if (newImagePreview) URL.revokeObjectURL(newImagePreview);
                  setNewImagePreview(URL.createObjectURL(file));
                  setNewFiles((previous) => ({ ...previous, image: file.name }));
                }}
              />
            </label>
            <label className="panel-upload">
              <UploadIcon />
              <strong>{newFiles.zip || "Choisir les fichiers"}</strong>
              <span>Archive ZIP avec index.html</span>
              <input
                required
                type="file"
                name="zip"
                accept=".zip,application/zip"
                onChange={(event) => setNewFiles((previous) => ({
                  ...previous,
                  zip: event.target.files[0]?.name || "",
                }))}
              />
            </label>
          </div>

          <button className="panel-primary-button" disabled={saving === "new"}>
            {saving === "new" ? "Publication..." : "Publier le projet"}
            <span>→</span>
          </button>
        </form>
      </section>

      <section className="panel-projects-section">
        <div className="panel-section-heading">
          <div>
            <small>Bibliothèque</small>
            <h2>Projets publiés</h2>
          </div>
          <p>{projects.length} projet{projects.length > 1 ? "s" : ""}</p>
        </div>

        <div className="panel-projects">
          {[...projects]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((project) => {
              const edited = editedProjects[project.fileName] || {};
              const isModified = Object.keys(edited).length > 0;
              const isPreviewOpen = openPreviews[project.fileName];
              const imageSrc = edited.imagePreview || project.image;

              return (
                <article key={project.fileName} className="panel-project-card">
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
                          onChange={(event) => handleProjectFile(
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
                          onChange={(event) => handleChange(project.fileName, "name", event.target.value)}
                        />
                      </label>
                      <label>
                        Description
                        <textarea
                          rows="4"
                          value={edited.description ?? project.description}
                          onChange={(event) => handleChange(project.fileName, "description", event.target.value)}
                        />
                      </label>

                      <div className="panel-project-assets">
                        <label className={edited.zip ? "has-file" : ""}>
                          <UploadIcon />
                          <span>{edited.zip?.name || "Remplacer le ZIP du projet"}</span>
                          <input
                            type="file"
                            accept=".zip,application/zip"
                            onChange={(event) => handleProjectFile(
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
                    <button
                      className="panel-preview-button"
                      onClick={() => setOpenPreviews((previous) => ({
                        ...previous,
                        [project.fileName]: !previous[project.fileName],
                      }))}
                    >
                      {isPreviewOpen ? "Fermer l'aperçu" : "Prévisualiser les fichiers"}
                    </button>
                    <a href={`/projects/${project.fileName}`} target="_blank" rel="noopener noreferrer">
                      Voir la page ↗
                    </a>
                    <div className="panel-project-actions-spacer" />
                    <button className="panel-delete-button" onClick={() => handleDelete(project)}>
                      Supprimer
                    </button>
                    <button
                      className="panel-save-button"
                      disabled={!isModified || saving === project.fileName}
                      onClick={() => handleSave(project)}
                    >
                      {saving === project.fileName ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>

                  {isPreviewOpen && (
                    <div className="panel-live-preview">
                      <div>
                        <span>Aperçu live</span>
                        <strong>{project.name}</strong>
                      </div>
                      <iframe
                        key={previewVersions[project.fileName] || 0}
                        src={`/api/projects/${project.fileName}?preview=${previewVersions[project.fileName] || 0}`}
                        title={`Aperçu de ${project.name}`}
                      />
                    </div>
                  )}
                </article>
              );
            })}
        </div>
      </section>
    </main>
  );
};

export default Panel;
