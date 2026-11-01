import "./styles/Panel.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PanelProjectCard from "../components/PanelProjectCard";
import PanelProjectForm from "../components/PanelProjectForm";
import usePanelProjects from "../hooks/usePanelProjects";

const Panel = ({ onLogout }) => {
  const { t } = useTranslation();
  const {
    projects,
    editedProjects,
    openPreviews,
    previewVersions,
    saving,
    notice,
    addProject,
    changeProject,
    changeProjectFile,
    deleteProject,
    dismissNotice,
    saveProject,
    togglePreview,
  } = usePanelProjects(onLogout);

  // null = follow the latest project (also after an add or a delete).
  const [selectedFileName, setSelectedFileName] = useState(null);

  const latestProject = [...projects].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  )[0];
  const selectedProject =
    projects.find(({ fileName }) => fileName === selectedFileName) ??
    latestProject;

  const nameCounts = projects.reduce(
    (counts, { name }) => counts.set(name, (counts.get(name) || 0) + 1),
    new Map(),
  );
  const pickerProjects = [...projects].sort((first, second) =>
    first.name.localeCompare(second.name, undefined, { sensitivity: "base" }),
  );
  const getOptionLabel = (project) => {
    // Names are not unique: the slug tells duplicates apart.
    const name =
      nameCounts.get(project.name) > 1
        ? `${project.name} (${project.fileName})`
        : project.name;
    const tags = [
      project === latestProject && t("panel.latestProject"),
      !project.published && t("panel.unpublishedOption"),
      editedProjects[project.fileName] && t("panel.modifiedOption"),
    ].filter(Boolean);
    return tags.length ? `${name} — ${tags.join(" · ")}` : name;
  };
  const unpublishedCount = projects.filter(
    ({ published }) => !published,
  ).length;

  const handleAddProject = async (formData) => {
    const wasAdded = await addProject(formData);
    if (wasAdded) setSelectedFileName(null);
    return wasAdded;
  };

  const handleLogout = async () => {
    await fetch("/api/panel/login/logout", {
      method: "POST",
      credentials: "include",
    });
    onLogout();
  };

  return (
    <main className="App panel-page">
      <header className="panel-header">
        <div>
          <small>{t("panel.privateArea")}</small>
          <h1>Panel</h1>
          <p>{t("panel.description")}</p>
        </div>
        <button className="panel-logout" onClick={handleLogout}>
          {t("panel.logout")}
        </button>
      </header>

      {notice && (
        <div
          className={`panel-notice panel-notice--${notice.type}`}
          role="status"
        >
          {notice.text}
          <button onClick={dismissNotice} aria-label={t("panel.close")}>
            ×
          </button>
        </div>
      )}

      <div className="panel-columns">
        <PanelProjectForm
          isSaving={saving === "new"}
          onSubmit={handleAddProject}
        />

        <section className="panel-projects-section">
          <div className="panel-section-heading">
            <div>
              <small>{t("panel.library")}</small>
              <h2>{t("panel.publishedProjects")}</h2>
            </div>
            <p>
              {t("panel.projectCount", { count: projects.length })}
              {unpublishedCount > 0 &&
                ` · ${t("panel.unpublishedCount", { count: unpublishedCount })}`}
            </p>
          </div>

          {selectedProject ? (
            <div className="panel-projects">
              <label className="panel-field panel-project-picker">
                {t("panel.pickProject")}
                <select
                  value={selectedProject.fileName}
                  onChange={(event) => setSelectedFileName(event.target.value)}
                >
                  {pickerProjects.map((project) => (
                    <option key={project.fileName} value={project.fileName}>
                      {getOptionLabel(project)}
                    </option>
                  ))}
                </select>
              </label>

              <PanelProjectCard
                key={selectedProject.fileName}
                project={selectedProject}
                edited={editedProjects[selectedProject.fileName] || {}}
                isPreviewOpen={openPreviews[selectedProject.fileName]}
                previewVersion={previewVersions[selectedProject.fileName] || 0}
                isSaving={saving === selectedProject.fileName}
                onChange={changeProject}
                onProjectFile={changeProjectFile}
                onTogglePreview={() => togglePreview(selectedProject.fileName)}
                onDelete={deleteProject}
                onSave={saveProject}
              />
            </div>
          ) : (
            <p className="panel-empty">{t("panel.noProjects")}</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Panel;
