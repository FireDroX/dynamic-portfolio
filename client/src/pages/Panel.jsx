import "./styles/Panel.css";
import PanelProjectCard from "../components/PanelProjectCard";
import PanelProjectForm from "../components/PanelProjectForm";
import usePanelProjects from "../hooks/usePanelProjects";

const Panel = ({ onLogout }) => {
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

  const sortedProjects = [...projects].sort(
    (first, second) =>
      new Date(second.createdAt) - new Date(first.createdAt),
  );

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
          <small>espace privé</small>
          <h1>Panel</h1>
          <p>Publie et maintiens les expériences visibles sur le portfolio.</p>
        </div>
        <button className="panel-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </header>

      {notice && (
        <div
          className={`panel-notice panel-notice--${notice.type}`}
          role="status"
        >
          {notice.text}
          <button onClick={dismissNotice} aria-label="Fermer">
            ×
          </button>
        </div>
      )}

      <PanelProjectForm
        isSaving={saving === "new"}
        onSubmit={addProject}
      />

      <section className="panel-projects-section">
        <div className="panel-section-heading">
          <div>
            <small>Bibliothèque</small>
            <h2>Projets publiés</h2>
          </div>
          <p>
            {projects.length} projet{projects.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="panel-projects">
          {sortedProjects.map((project) => (
            <PanelProjectCard
              key={project.fileName}
              project={project}
              edited={editedProjects[project.fileName] || {}}
              isPreviewOpen={openPreviews[project.fileName]}
              previewVersion={previewVersions[project.fileName] || 0}
              isSaving={saving === project.fileName}
              onChange={changeProject}
              onProjectFile={changeProjectFile}
              onTogglePreview={() => togglePreview(project.fileName)}
              onDelete={deleteProject}
              onSave={saveProject}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Panel;
